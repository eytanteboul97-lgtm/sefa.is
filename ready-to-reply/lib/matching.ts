/**
 * Profil entreprise et score d'affinité de la veille (V1 de test).
 *
 * Le score est volontairement simple et explicable : chaque point attribué
 * est accompagné d'une raison affichée à l'utilisateur. C'est une aide au
 * tri, pas une garantie de pertinence ni de succès.
 */

export type MarketType = "FOURNITURES" | "SERVICES" | "TRAVAUX";

export type Profile = {
  /** Mots-clés recherchés dans l'objet et les descripteurs de l'avis. */
  keywords: string[];
  /** Types de marché visés. */
  types: MarketType[];
  /** Codes département (ex. "69", "2A", "971"). Vide = toute la France. */
  departments: string[];
  /** Montant minimum visé, en euros HT. 0 = pas de minimum. */
  minAmount: number;
  /** Nombre de jours de publication à couvrir. */
  days: number;
};

/** Profil de départ : fourniture d'éclairage, toute la France, plus de 100 000 € HT. */
export const defaultProfile: Profile = {
  keywords: ["éclairage", "luminaire", "LED", "candélabre", "projecteur", "lanterne", "lampe"],
  types: ["FOURNITURES"],
  departments: [],
  minAmount: 100000,
  days: 21,
};

/** Avis BOAMP normalisé, tel que l'API interne le renvoie au navigateur. */
export type Notice = {
  id: string;
  title: string;
  buyer: string | null;
  departments: string[];
  publishedAt: string | null;
  deadline: string | null;
  types: string[];
  descriptors: string[];
  procedure: string | null;
  nature: string | null;
  /** Montant estimé trouvé dans l'avis, en € HT, si l'avis l'indique. */
  amount: number | null;
  url: string;
};

export type Reason = { label: string; points: number; max: number };

export type ScoredNotice = Notice & {
  score: number;
  verdict: "go" | "maybe" | "pass";
  reasons: Reason[];
  matchedKeywords: string[];
  daysLeft: number | null;
};

/** Minuscules et sans accents, pour comparer « Éclairage » et « eclairage ». */
export function fold(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Recherche un mot-clé en mot entier (évite que « LED » trouve « ledit »). */
export function hasKeyword(text: string, keyword: string) {
  const k = fold(keyword.trim());
  if (!k) return false;
  return new RegExp(`(^|[^a-z0-9])${escapeRe(k)}s?($|[^a-z0-9])`).test(fold(text));
}

export function daysBetween(from: Date, to: Date) {
  const d = (Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) -
    Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / 86400000;
  return Math.round(d);
}

export function verdictOf(score: number): ScoredNotice["verdict"] {
  if (score >= 80) return "go";
  if (score >= 60) return "maybe";
  return "pass";
}

/**
 * Note un avis pour un profil. Renvoie null si l'avis est hors cible
 * (aucun mot-clé, hors zone, date limite dépassée, montant connu trop bas).
 */
export function scoreNotice(n: Notice, p: Profile, today = new Date()): ScoredNotice | null {
  const titleHits = p.keywords.filter((k) => hasKeyword(n.title, k));
  const descHits = p.keywords.filter((k) => !titleHits.includes(k) && n.descriptors.some((d) => hasKeyword(d, k)));
  const matched = [...titleHits, ...descHits];
  if (matched.length === 0) return null;

  if (p.departments.length > 0 && !n.departments.some((d) => p.departments.includes(d))) return null;

  const daysLeft = n.deadline ? daysBetween(today, new Date(n.deadline)) : null;
  if (daysLeft !== null && daysLeft < 0) return null;

  if (p.minAmount > 0 && n.amount !== null && n.amount < p.minAmount) return null;

  const reasons: Reason[] = [];

  // Métier : 40 points
  const kw = titleHits.length > 0 ? Math.min(40, 30 + (titleHits.length - 1) * 5) : 20;
  reasons.push({
    label:
      titleHits.length > 0
        ? `Objet de l'avis : ${titleHits.join(", ")}`
        : `Seulement dans les descripteurs : ${descHits.join(", ")}`,
    points: kw,
    max: 40,
  });

  // Type de marché : 20 points
  const typesFolded = n.types.map(fold);
  const typeOk = p.types.length === 0 || p.types.some((t) => typesFolded.some((x) => x.includes(fold(t))));
  const typeUnknown = n.types.length === 0;
  reasons.push({
    label: typeUnknown
      ? "Type de marché non précisé dans l'avis"
      : typeOk
        ? `Type de marché : ${n.types.join(", ").toLowerCase()}`
        : `Type différent de votre cible : ${n.types.join(", ").toLowerCase()}`,
    points: typeUnknown ? 10 : typeOk ? 20 : 0,
    max: 20,
  });

  // Montant : 20 points
  reasons.push({
    label:
      n.amount === null
        ? "Montant non indiqué dans l'avis : à vérifier dans le dossier"
        : `Montant estimé : ${n.amount.toLocaleString("fr-FR")} € HT`,
    points: n.amount === null ? 10 : 20,
    max: 20,
  });

  // Délai : 20 points
  const delay =
    daysLeft === null ? 10 : daysLeft >= 15 ? 20 : daysLeft >= 8 ? 12 : daysLeft >= 3 ? 5 : 0;
  reasons.push({
    label:
      daysLeft === null
        ? "Date limite non indiquée"
        : daysLeft === 0
          ? "Date limite aujourd'hui"
          : `${daysLeft} jour${daysLeft > 1 ? "s" : ""} pour répondre`,
    points: delay,
    max: 20,
  });

  const score = reasons.reduce((a, r) => a + r.points, 0);
  return { ...n, score, verdict: verdictOf(score), reasons, matchedKeywords: matched, daysLeft };
}

/** Lecture tolérante d'un profil venant de l'URL ou du stockage local. */
export function parseProfile(input: Partial<Record<keyof Profile, unknown>>): Profile {
  const list = (v: unknown) =>
    (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : [])
      .map((x) => String(x).trim())
      .filter(Boolean)
      .slice(0, 20);
  const types = list(input.types)
    .map((t) => t.toUpperCase())
    .filter((t): t is MarketType => ["FOURNITURES", "SERVICES", "TRAVAUX"].includes(t));
  const departments = list(input.departments)
    .map((d) => d.toUpperCase())
    .filter((d) => /^(\d{2,3}|2A|2B)$/.test(d));
  const keywords = list(input.keywords).map((k) => k.slice(0, 40));
  const minAmount = Math.max(0, Math.min(1e9, Number(input.minAmount) || 0));
  const days = Math.max(1, Math.min(60, Math.round(Number(input.days) || defaultProfile.days)));
  return {
    keywords: keywords.length ? keywords : defaultProfile.keywords,
    types,
    departments,
    minAmount,
    days,
  };
}
