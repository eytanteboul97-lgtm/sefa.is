import "server-only";
import { fold, type Notice, type Profile } from "@/lib/matching";

/**
 * Connecteur BOAMP (Bulletin officiel des annonces des marchés publics).
 *
 * Source : jeu de données « boamp » publié en open data par la DILA sur
 * Opendatasoft (API Explore v2.1), sous licence ouverte Etalab.
 * https://boamp-datadila.opendatasoft.com/explore/dataset/boamp/
 *
 * La lecture des champs est volontairement tolérante (plusieurs noms
 * possibles, tableaux ou chaînes) : si la DILA fait évoluer le format, un
 * champ manquant donne « non indiqué » au lieu d'une erreur.
 */

export const BOAMP_API_URL =
  process.env.BOAMP_API_URL ||
  "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";

const PAGE_SIZE = 100;
const MAX_RECORDS = 600; // plafond par recherche, pour rester rapide et poli avec l'API publique
const EXCLUDED_NATURES = ["attribution", "rectificatif", "annulation", "resultat", "modification"];

type Raw = Record<string, unknown>;

export class BoampError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

const asList = (v: unknown): string[] => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  const s = String(v).trim();
  return s ? s.split(/\s*[,;|]\s*/).filter(Boolean) : [];
};
const asText = (...vals: unknown[]): string | null => {
  for (const v of vals) {
    if (v == null) continue;
    const s = Array.isArray(v) ? v.join(", ") : String(v);
    if (s.trim()) return s.trim();
  }
  return null;
};
const asDate = (v: unknown): string | null => {
  const s = asText(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

/** Montant en euros depuis « 150 000,00 », « 150000.5 » ou un nombre. */
function toAmount(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[\s  €]/g, "").replace(/,(\d{1,2})$/, ".$1").replace(/,/g, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

/**
 * Cherche un montant estimé dans le détail de l'avis (`donnees`, JSON dont
 * la structure varie selon le formulaire). Ne retient que des clés
 * explicitement liées à une valeur ou un montant ; sinon renvoie null.
 */
export function findAmount(donnees: unknown): number | null {
  let root: unknown = donnees;
  if (typeof donnees === "string") {
    try {
      root = JSON.parse(donnees);
    } catch {
      return null;
    }
  }
  const found: number[] = [];
  const walk = (node: unknown, depth: number) => {
    if (depth > 12 || node == null) return;
    if (Array.isArray(node)) return node.forEach((x) => walk(x, depth + 1));
    if (typeof node !== "object") return;
    for (const [key, value] of Object.entries(node as Raw)) {
      const k = fold(key);
      const isAmountKey = /(valeur|montant|estimated_value|val_estimated|val_total|amount)/.test(k) && !/(devise|currency|pourcentage|percent|nb|nombre)/.test(k);
      if (isAmountKey) {
        const direct = toAmount(value);
        if (direct !== null) found.push(direct);
        else if (value && typeof value === "object") {
          // ex. { "#text": "150000", "@CURRENCY": "EUR" } ou { "value": 150000 }
          for (const inner of Object.values(value as Raw)) {
            const a = toAmount(inner);
            if (a !== null) found.push(a);
          }
        }
      }
      if (value && typeof value === "object") walk(value, depth + 1);
    }
  };
  walk(root, 0);
  const plausible = found.filter((a) => a >= 1000 && a <= 5e9);
  return plausible.length ? Math.max(...plausible) : null;
}

export function normalize(r: Raw): Notice | null {
  const id = asText(r.idweb, r.id, r.recordid);
  const title = asText(r.objet, r.intitule, r.titre);
  if (!id || !title) return null;
  return {
    id,
    title,
    buyer: asText(r.nomacheteur, r.nom_acheteur, r.acheteur),
    departments: asList(r.code_departement ?? r.code_departement_prestation ?? r.departement).map((d) => d.toUpperCase()),
    publishedAt: asDate(r.dateparution ?? r.date_parution),
    deadline: asDate(r.datelimitereponse ?? r.date_limite_reponse),
    types: asList(r.type_marche ?? r.type_marche_facette).map((t) => t.toUpperCase()),
    descriptors: asList(r.descripteur_libelle ?? r.descripteurs),
    procedure: asText(r.procedure_libelle, r.type_procedure, r.procedure_categorise),
    nature: asText(r.nature_libelle, r.nature_categorise_libelle, r.nature),
    amount: findAmount(r.donnees),
    url:
      asText(r.url_avis) ??
      `https://www.boamp.fr/pages/avis/?q=idweb:%22${encodeURIComponent(id)}%22`,
  };
}

const isNoticeOfTender = (n: Notice) => !n.nature || !EXCLUDED_NATURES.some((x) => fold(n.nature!).includes(x));

/** Échappe une chaîne pour un littéral ODSQL entre guillemets doubles. */
const odsString = (s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function fetchPage(where: string, offset: number) {
  const url = new URL(BOAMP_API_URL);
  url.searchParams.set("where", where);
  url.searchParams.set("order_by", "dateparution desc");
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("offset", String(offset));
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 }, // 15 min de cache : les avis paraissent une fois par jour
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new BoampError(`BOAMP a répondu ${res.status}`, res.status);
  const json = (await res.json()) as { results?: Raw[]; records?: { fields?: Raw; record?: { fields?: Raw } }[]; total_count?: number };
  // v2.1 : { total_count, results: [...] } ; on accepte aussi l'ancien format « records ».
  const rows: Raw[] = json.results ?? (json.records ?? []).map((x) => x.fields ?? x.record?.fields ?? {});
  return { rows, total: typeof json.total_count === "number" ? json.total_count : rows.length };
}

export type SearchResult = {
  notices: Notice[];
  scanned: number;
  totalAvailable: number;
  mode: "full-text" | "date-only";
  since: string;
};

/**
 * Récupère les avis récents susceptibles de correspondre au profil.
 * Stratégie : recherche plein texte côté BOAMP sur les mots-clés ; si l'API
 * refuse la requête (400), repli sur les avis récents filtrés localement.
 */
export async function searchNotices(profile: Profile, today = new Date()): Promise<SearchResult> {
  const since = new Date(today.getTime() - profile.days * 86400000);
  const dateClause = `dateparution >= date'${isoDay(since)}'`;
  const kwClause = profile.keywords.map((k) => odsString(k)).join(" OR ");

  const collect = async (where: string) => {
    const rows: Raw[] = [];
    let total = 0;
    for (let offset = 0; offset < MAX_RECORDS; offset += PAGE_SIZE) {
      const page = await fetchPage(where, offset);
      total = page.total;
      rows.push(...page.rows);
      if (page.rows.length < PAGE_SIZE || rows.length >= total) break;
    }
    return { rows, total };
  };

  let mode: SearchResult["mode"] = "full-text";
  let data: { rows: Raw[]; total: number };
  try {
    data = await collect(`${dateClause} AND (${kwClause})`);
  } catch (e) {
    if (!(e instanceof BoampError) || e.status !== 400) throw e;
    mode = "date-only";
    data = await collect(dateClause);
  }

  const seen = new Set<string>();
  const notices = data.rows
    .map(normalize)
    .filter((n): n is Notice => n !== null)
    .filter((n) => (seen.has(n.id) ? false : (seen.add(n.id), true)))
    .filter(isNoticeOfTender);

  return { notices, scanned: data.rows.length, totalAvailable: data.total, mode, since: since.toISOString() };
}
