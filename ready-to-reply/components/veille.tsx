"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MarchesResponse } from "@/app/api/marches/route";
import { buttonClasses } from "@/components/ui";
import { AffinityScale, VerdictPill, toneBox, tonePhrase } from "@/components/verdict-tag";
import { defaultProfile, parseProfile, type MarketType, type Profile, type ScoredNotice } from "@/lib/matching";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "rtr-veille-profil-v1";

const typeOptions: { value: MarketType; label: string }[] = [
  { value: "FOURNITURES", label: "Fournitures" },
  { value: "TRAVAUX", label: "Travaux" },
  { value: "SERVICES", label: "Services" },
];
const amountOptions = [
  { value: 0, label: "Pas de minimum" },
  { value: 40000, label: "40 000 € HT et plus" },
  { value: 100000, label: "100 000 € HT et plus" },
  { value: 250000, label: "250 000 € HT et plus" },
  { value: 500000, label: "500 000 € HT et plus" },
];
const dayOptions = [7, 14, 21, 30];

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ok"; data: Extract<MarchesResponse, { status: "ok" }> };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const fmtDate = (iso: string | null) => (iso ? dateFmt.format(new Date(iso)) : "non indiquée");

function toQuery(p: Profile) {
  const q = new URLSearchParams();
  q.set("keywords", p.keywords.join(","));
  if (p.types.length) q.set("types", p.types.join(","));
  if (p.departments.length) q.set("departments", p.departments.join(","));
  q.set("minAmount", String(p.minAmount));
  q.set("days", String(p.days));
  return q.toString();
}

export function Veille() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [filter, setFilter] = useState<"all" | "go" | "maybe">("all");
  const requestId = useRef(0);

  const run = useCallback(async (p: Profile) => {
    const id = ++requestId.current;
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/marches?${toQuery(p)}`);
      const data = (await res.json()) as MarchesResponse;
      if (id !== requestId.current) return; // une recherche plus récente a été lancée
      setState(data.status === "ok" ? { kind: "ok", data } : { kind: "error", message: data.message });
    } catch {
      if (id !== requestId.current) return;
      setState({ kind: "error", message: "La connexion a été interrompue. Vérifiez votre réseau puis réessayez." });
    }
  }, []);

  // Profil mémorisé dans ce navigateur uniquement (aucun compte, rien côté serveur).
  useEffect(() => {
    let initial = defaultProfile;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) initial = parseProfile(JSON.parse(saved));
    } catch {}
    setProfile(initial);
    setDraft(initial);
    run(initial);
  }, [run]);

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseProfile(draft);
    setProfile(p);
    setDraft(p);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
    run(p);
  };

  const reset = () => {
    setDraft(defaultProfile);
  };

  const results = state.kind === "ok" ? state.data.results : [];
  const shown = results.filter((r) => filter === "all" || r.verdict === filter);
  const counts = {
    all: results.length,
    go: results.filter((r) => r.verdict === "go").length,
    maybe: results.filter((r) => r.verdict === "maybe").length,
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[20rem_1fr] lg:items-start">
      <ProfileForm draft={draft} setDraft={setDraft} onSubmit={apply} onReset={reset} loading={state.kind === "loading"} />

      <div className="min-w-0">
        <div aria-live="polite" className="min-h-[1.5rem]">
          {state.kind === "loading" && <p className="text-sm text-ink-muted">Recherche dans les avis du BOAMP…</p>}
          {state.kind === "ok" && (
            <p className="text-sm text-ink-soft">
              <strong className="text-ink">
                {results.length} marché{results.length > 1 ? "s" : ""} pour votre profil
              </strong>{" "}
              · {state.data.meta.scanned} avis analysés, publiés depuis le {fmtDate(state.data.meta.since)}
              {state.data.meta.amountUnknown > 0 &&
                ` · ${state.data.meta.amountUnknown} sans montant indiqué (conservés, à vérifier)`}
            </p>
          )}
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-ivory px-4 py-3 text-sm leading-relaxed text-ink-muted">
          <span>
            <strong className="text-ink">Comment lire la note :</strong> l&apos;affinité, sur 100, mesure à quel point
            l&apos;avis correspond à votre profil (métier, type de marché, montant, délai).
          </span>
          <AffinityScale />
        </p>

        {state.kind === "ok" && results.length > 0 && (
          <div role="group" aria-label="Filtrer par avis" className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["all", `Tous (${counts.all})`],
                ["go", `Allez-y (${counts.go})`],
                ["maybe", `À étudier (${counts.maybe})`],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                aria-pressed={filter === v}
                onClick={() => setFilter(v)}
                className={cn(
                  "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                  filter === v ? "bg-ink text-ivory" : "border border-line bg-ivory text-ink-soft hover:border-ink/40",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          {state.kind === "loading" && <Skeleton />}
          {state.kind === "error" && (
            <div role="alert" className="rounded-2xl border border-terracotta/40 bg-terracotta-soft p-6">
              <p className="font-semibold">La recherche n&apos;a pas abouti.</p>
              <p className="mt-2 text-ink-soft">{state.message}</p>
              <button type="button" onClick={() => run(profile)} className={buttonClasses("primary", "mt-5")}>
                Réessayer
              </button>
            </div>
          )}
          {state.kind === "ok" && shown.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink/25 p-8">
              <p className="font-serif text-xl">
                {results.length === 0 ? "Aucun avis ne correspond à votre profil sur cette période." : "Aucun marché dans ce filtre."}
              </p>
              {results.length === 0 && (
                <p className="mt-3 text-ink-soft">
                  Essayez d&apos;allonger la période, d&apos;ajouter des mots-clés proches de votre métier ou de baisser le
                  montant minimum.
                </p>
              )}
            </div>
          )}
          {state.kind === "ok" && shown.length > 0 && (
            <ol className="space-y-4">
              {shown.map((n) => (
                <NoticeCard key={n.id} n={n} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileForm({
  draft,
  setDraft,
  onSubmit,
  onReset,
  loading,
}: {
  draft: Profile;
  setDraft: React.Dispatch<React.SetStateAction<Profile>>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  loading: boolean;
}) {
  const [kw, setKw] = useState("");
  const ids = { kw: useId(), dep: useId(), amount: useId(), days: useId() };

  const addKeyword = () => {
    const k = kw.trim();
    if (k && !draft.keywords.some((x) => x.toLowerCase() === k.toLowerCase()) && draft.keywords.length < 20) {
      setDraft({ ...draft, keywords: [...draft.keywords, k] });
    }
    setKw("");
  };

  return (
    <form onSubmit={onSubmit} className="card min-w-0 space-y-6 p-5 sm:p-6 lg:sticky lg:top-24" aria-label="Profil de votre entreprise">
      <div>
        <h2 className="text-xl">Votre profil</h2>
        <p className="mt-1 text-sm text-ink-muted">Mémorisé dans ce navigateur uniquement.</p>
      </div>

      <div>
        <label htmlFor={ids.kw} className="text-sm font-bold">
          Mots-clés de votre métier
        </label>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Mots-clés retenus">
          {draft.keywords.map((k) => (
            <li key={k} className="inline-flex items-center gap-1 rounded-full bg-sand py-1 pl-3 pr-1 text-sm">
              {k}
              <button
                type="button"
                onClick={() => setDraft({ ...draft, keywords: draft.keywords.filter((x) => x !== k) })}
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-line hover:text-ink"
                aria-label={`Retirer le mot-clé ${k}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <input
            id={ids.kw}
            value={kw}
            maxLength={40}
            onChange={(e) => setKw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="ex. éclairage public"
            className="min-w-0 flex-1 rounded-xl border border-line bg-ivory px-3 py-2 text-base focus:border-ink focus:outline-none"
          />
          <button type="button" onClick={addKeyword} className={buttonClasses("secondary", "min-h-10 px-4 py-2")}>
            Ajouter
          </button>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-bold">Type de marché</legend>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {typeOptions.map((t) => (
            <label key={t.value} className="flex min-h-8 cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.types.includes(t.value)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    types: e.target.checked ? [...draft.types, t.value] : draft.types.filter((x) => x !== t.value),
                  })
                }
                className="h-4 w-4 accent-[#2B1E18]"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={ids.dep} className="text-sm font-bold">
          Départements
        </label>
        <input
          id={ids.dep}
          value={draft.departments.join(", ")}
          onChange={(e) =>
            setDraft({
              ...draft,
              departments: e.target.value
                .split(/[\s,;]+/)
                .map((d) => d.trim().toUpperCase())
                .filter(Boolean),
            })
          }
          placeholder="Toute la France"
          aria-describedby={`${ids.dep}-hint`}
          className="mt-2 block w-full rounded-xl border border-line bg-ivory px-3 py-2 text-base focus:border-ink focus:outline-none"
        />
        <p id={`${ids.dep}-hint`} className="mt-1.5 text-xs text-ink-muted">
          Laisser vide pour toute la France, ou saisir des numéros : 69, 01, 38
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label htmlFor={ids.amount} className="text-sm font-bold">
            Montant minimum
          </label>
          <select
            id={ids.amount}
            value={draft.minAmount}
            onChange={(e) => setDraft({ ...draft, minAmount: Number(e.target.value) })}
            className="mt-2 block w-full rounded-xl border border-line bg-ivory px-3 py-2 text-base focus:border-ink focus:outline-none"
          >
            {amountOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={ids.days} className="text-sm font-bold">
            Période
          </label>
          <select
            id={ids.days}
            value={draft.days}
            onChange={(e) => setDraft({ ...draft, days: Number(e.target.value) })}
            className="mt-2 block w-full rounded-xl border border-line bg-ivory px-3 py-2 text-base focus:border-ink focus:outline-none"
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                Avis des {d} derniers jours
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button type="submit" disabled={loading} className={buttonClasses("primary")}>
          {loading ? "Recherche…" : "Mettre à jour ma sélection"}
        </button>
        <button type="button" onClick={onReset} className="text-sm font-semibold text-terracotta-deep underline-offset-4 hover:underline">
          Revenir au profil de départ
        </button>
      </div>
    </form>
  );
}


function NoticeCard({ n }: { n: ScoredNotice }) {
  return (
    <li className="card overflow-hidden">
      <div className="grid gap-5 p-5 sm:grid-cols-[6.5rem_1fr] sm:p-6">
        <div
          aria-label={`Affinité ${n.score} sur 100`}
          className={cn("flex flex-row items-center gap-3 rounded-xl px-4 py-3 sm:flex-col sm:justify-center sm:gap-1 sm:text-center", toneBox[n.verdict])}
        >
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em]">Affinité</p>
          <p className="figure text-3xl leading-none">
            {n.score}
            <span className="text-sm opacity-85">/100</span>
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {n.buyer ?? "Acheteur non indiqué"}
            {n.departments.length > 0 && ` · ${n.departments.join(", ")}`}
          </p>
          <h3 className="mt-1.5 break-words text-lg leading-snug sm:text-xl">{n.title}</h3>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-ink-soft">
            <VerdictPill tone={n.verdict} />
            {tonePhrase[n.verdict]}
          </p>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div className="flex gap-1.5">
              <dt className="text-ink-muted">Date limite :</dt>
              <dd className={cn("font-medium", n.daysLeft !== null && n.daysLeft < 8 && "text-terracotta-deep")}>
                {fmtDate(n.deadline)}
                {n.daysLeft !== null && ` (J-${n.daysLeft})`}
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-ink-muted">Montant :</dt>
              <dd className="font-medium">
                {n.amount !== null ? `${n.amount.toLocaleString("fr-FR")} € HT` : "non indiqué"}
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-ink-muted">Publié le :</dt>
              <dd>{fmtDate(n.publishedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <details className="group border-t border-line">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-sm font-semibold text-terracotta-deep sm:px-6 [&::-webkit-details-marker]:hidden">
          Pourquoi {n.score}/100 ? Le calcul et le détail de l&apos;avis
          <span aria-hidden="true" className="transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="grid gap-6 bg-cream/50 px-5 pb-6 pt-2 sm:px-6 lg:grid-cols-2">
          <div>
            <h4 className="font-sans text-sm font-bold">Calcul de la note</h4>
            <ul className="mt-3 space-y-2.5">
              {n.reasons.map((r) => (
                <li key={r.label} className="text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-ink-soft">{r.label}</span>
                    <span className="figure shrink-0">
                      {r.points}/{r.max}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-sand">
                    <div className="h-1.5 rounded-full bg-ink" style={{ width: `${(r.points / r.max) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              Une aide au tri, pas une garantie. Lisez toujours l&apos;avis et le règlement de la consultation avant de
              décider.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold">Informations de l&apos;avis</h4>
            <dl className="mt-3 space-y-2 text-sm">
              <Info label="Référence BOAMP" value={n.id} />
              <Info label="Procédure" value={n.procedure} />
              <Info label="Type" value={n.types.join(", ").toLowerCase() || null} />
              <Info label="Descripteurs" value={n.descriptors.join(" · ") || null} />
              <Info label="Mots-clés trouvés" value={n.matchedKeywords.join(", ")} />
            </dl>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "mt-5 min-h-10 py-2 text-sm")}
            >
              Voir l&apos;avis officiel sur boamp.fr
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          </div>
        </div>
      </details>
    </li>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="break-words">{value ?? "non indiqué"}</dd>
    </div>
  );
}

function Skeleton() {
  return (
    <ul className="space-y-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="card flex gap-5 p-6">
          <div className="h-16 w-20 animate-pulse rounded-xl bg-sand" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-1/3 animate-pulse rounded bg-sand" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-sand" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-sand" />
          </div>
        </li>
      ))}
    </ul>
  );
}
