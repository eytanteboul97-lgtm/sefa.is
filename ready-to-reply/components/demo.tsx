"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { FictionalLabel } from "@/components/labels";
import { buttonClasses, Arrow } from "@/components/ui";
import { toneBox, tonePhrase } from "@/components/verdict-tag";
import {
  consultation,
  documents,
  priceRange,
  profiles,
  scoreCriteria,
  timeline,
  toProduce,
  verdict,
  vigilance,
  type DocState,
} from "@/content/demo";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "resume", label: "Résumé" },
  { id: "pieces", label: "Pièces à fournir" },
  { id: "dates", label: "Dates clés" },
  { id: "vigilance", label: "Points de vigilance" },
  { id: "score", label: "Score d'affinité" },
  { id: "prix", label: "Fourchette de prix" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/**
 * Démonstration interactive sur un marché fictif.
 * Rien n'est calculé à partir de données réelles : c'est une maquette
 * cliquable qui montre ce que la fiche marché est censée apporter.
 */
export function Demo() {
  const [active, setActive] = useState<TabId>("resume");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line px-5 pb-5 pt-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
            Commune · {consultation.procedure}
          </p>
          <FictionalLabel />
        </div>
        <h3 className="mt-3 text-2xl sm:text-[1.75rem]">{consultation.title}</h3>
      </div>

      <div className="border-b border-line bg-cream/60">
        <div
          role="tablist"
          aria-label="Sections de la fiche marché"
          className="flex flex-wrap gap-1 px-3 py-2 sm:px-6"
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active === t.id ? "bg-ink text-ivory" : "text-ink-soft hover:bg-sand hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${baseId}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={active !== t.id}
          tabIndex={0}
          className="px-5 py-7 focus-visible:outline-offset-[-4px] sm:px-8 sm:py-9"
        >
          {active === t.id && <Panel id={t.id} />}
        </div>
      ))}

      <div className="flex flex-col gap-4 border-t border-line bg-sand/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-ink-soft">
          La préparation du dossier à partir de cette fiche n&apos;est pas encore disponible : elle sera construite
          avec les entreprises pilotes.
        </p>
        <Link href="/contact" className={buttonClasses("primary", "shrink-0")}>
          Rejoindre le pilote <Arrow />
        </Link>
      </div>
    </div>
  );
}

function Panel({ id }: { id: TabId }) {
  switch (id) {
    case "resume":
      return <Summary />;
    case "pieces":
      return <Documents />;
    case "dates":
      return <Timeline />;
    case "vigilance":
      return <Vigilance />;
    case "score":
      return <Score />;
    case "prix":
      return <Price />;
  }
}

function PanelIntro({ children }: { children: React.ReactNode }) {
  return <p className="max-w-2xl text-[0.97rem] leading-relaxed text-ink-soft">{children}</p>;
}

function Summary() {
  const facts = [
    { label: "Acheteur", value: consultation.buyer },
    { label: "Montant", value: consultation.amount },
    { label: "Durée", value: consultation.duration },
    { label: "Découpage", value: consultation.lots },
  ];
  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <PanelIntro>
          En une page, l&apos;essentiel d&apos;une consultation qui en compte souvent plusieurs dizaines : ce qui est
          demandé, pour qui, pour combien et comment les offres seront notées.
        </PanelIntro>
        <h4 className="mt-6 font-sans text-sm font-bold">Ce que l&apos;acheteur demande</h4>
        <p className="mt-2 leading-relaxed">{consultation.object}</p>
        <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="border-t border-line pt-3">
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">{f.label}</dt>
              <dd className="mt-1 text-[0.95rem]">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 rounded-xl bg-cream p-4 text-sm leading-relaxed text-ink-soft">
          <strong className="text-ink">« {consultation.procedure} » : </strong>
          {consultation.procedureHelp}
        </p>
      </div>
      <div>
        <h4 className="font-sans text-sm font-bold">Comment les offres seront notées</h4>
        <ul className="mt-4 space-y-4">
          {consultation.criteria.map((c) => (
            <li key={c.label}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{c.label}</span>
                <span className="figure">{c.weight} %</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-sand">
                <div
                  className="h-2 origin-left animate-grow rounded-full bg-terracotta"
                  style={{ width: `${c.weight}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-ink-soft">
          Ici, la qualité technique compte plus que le prix : le mémoire technique mérite du temps.
        </p>
      </div>
    </div>
  );
}

const docStyles: Record<DocState, { label: string; className: string }> = {
  ready: { label: "Prêt", className: "bg-sage-soft text-sage" },
  expiring: { label: "À renouveler", className: "bg-ochre-soft text-ochre" },
  todo: { label: "À préparer", className: "bg-sand text-ink-soft" },
};

function Documents() {
  const ready = documents.filter((d) => d.state === "ready").length;
  return (
    <div>
      <PanelIntro>
        Les pièces de l&apos;entreprise, saisies une seule fois dans un coffre-fort documentaire, seraient réutilisées
        d&apos;un marché à l&apos;autre, avec une alerte avant expiration.
      </PanelIntro>
      <div className="mt-7 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between">
            <h4 className="font-sans text-sm font-bold">Pièces administratives</h4>
            <p className="text-sm font-semibold text-sage">
              {ready} prêtes sur {documents.length}
            </p>
          </div>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {documents.map((d) => (
              <li key={d.name} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-ink-muted">{d.help}</p>
                  {d.state !== "ready" && <p className="mt-1 text-sm font-medium text-ochre">{d.note}</p>}
                </div>
                <span
                  className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", docStyles[d.state].className)}
                >
                  {d.state === "ready" ? d.note : docStyles[d.state].label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-sm font-bold">À produire pour ce marché</h4>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {toProduce.map((d) => (
              <li key={d.name} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-sm text-ink-muted">{d.help}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", docStyles.todo.className)}>
                  {docStyles.todo.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Liste indicative : les pièces exigées dépendent du règlement de chaque consultation, qui fait toujours foi.
          </p>
        </div>
      </div>
    </div>
  );
}

function dayLabel(day: number) {
  if (day === 0) return "Jour J";
  return day > 0 ? `J+${day}` : `J${day}`;
}

function Timeline() {
  return (
    <div>
      <PanelIntro>
        Les échéances qui comptent, remises dans l&apos;ordre. Dans l&apos;exemple, « Jour J » correspond au jour où
        le marché apparaît dans votre sélection.
      </PanelIntro>
      <ol className="relative mt-8 space-y-6 border-l-2 border-line pl-7 sm:ml-2">
        {timeline.map((t) => (
          <li key={t.label} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-[2.2rem] top-1 h-4 w-4 rounded-full border-2",
                t.day === 0 ? "border-ink bg-ink" : t.key ? "border-terracotta bg-terracotta" : "border-line bg-ivory",
              )}
            />
            <p className="figure text-sm text-ink-muted">{dayLabel(t.day)}</p>
            <p className={cn("mt-0.5 font-semibold", t.key && "text-terracotta-deep")}>{t.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Vigilance() {
  return (
    <div>
      <PanelIntro>
        Les clauses qui font perdre un marché sans même être lu : repérées dans le règlement de la consultation et
        signalées en clair.
      </PanelIntro>
      <ul className="mt-7 grid gap-4 sm:grid-cols-2">
        {vigilance.map((v, i) => (
          <li key={v.title} className="rounded-xl border border-line bg-cream/50 p-5">
            <p className="flex items-center gap-3">
              <span className="figure flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm text-ivory">
                {i + 1}
              </span>
              <span className="font-semibold">{v.title}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Score() {
  const [profileId, setProfileId] = useState(profiles[0].id);
  const profile = profiles.find((p) => p.id === profileId) ?? profiles[0];
  const total = Math.round(profile.scores.reduce((a, b) => a + b, 0) / profile.scores.length);
  const v = verdict(total);
  const groupId = useId();

  return (
    <div>
      <PanelIntro>
        Le même marché n&apos;a pas la même note pour tout le monde. Changez d&apos;entreprise pour voir la note
        évoluer : elle dépend du métier, de la taille, des références, de la zone et des ambitions de chacun.
      </PanelIntro>

      <fieldset className="mt-6">
        <legend id={groupId} className="text-sm font-bold">
          Voir la note pour :
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {profiles.map((p) => (
            <label
              key={p.id}
              className={cn(
                "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta-deep",
                p.id === profileId ? "border-ink bg-cream" : "border-line hover:border-ink/40",
              )}
            >
              <input
                type="radio"
                name={groupId}
                value={p.id}
                checked={p.id === profileId}
                onChange={() => setProfileId(p.id)}
                className="mt-1 h-4 w-4 accent-[#2B1E18]"
              />
              <span>
                <span className="block font-semibold">{p.name}</span>
                <span className="block text-sm text-ink-muted">{p.summary}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-8 lg:grid-cols-[auto_1fr]">
        <div
          className={cn(
            "flex flex-col justify-center rounded-2xl px-8 py-6 text-center lg:w-56",
            toneBox[v.tone],
          )}
          aria-live="polite"
        >
          <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-90">Affinité</p>
          <p className="figure mt-2 text-6xl leading-none">
            {total}
            <span className="text-xl">/100</span>
          </p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em]">{v.label}</p>
          <p className="mt-2 text-sm">{tonePhrase[v.tone]}</p>
        </div>

        <div>
          <ul className="space-y-3">
            {scoreCriteria.map((c, i) => (
              <li key={c} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[13rem_1fr_2.5rem]">
                <span className="text-sm font-medium">{c}</span>
                <span className="figure text-right text-sm sm:order-last">{profile.scores[i]}</span>
                <span className="col-span-2 h-2 rounded-full bg-sand sm:col-span-1">
                  <span
                    className="block h-2 rounded-full bg-ink transition-[width] duration-500"
                    style={{ width: `${profile.scores[i]}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2 text-sm leading-relaxed text-ink-soft">
            {profile.reasons.map((r) => (
              <li key={r} className="flex gap-2">
                <span aria-hidden="true" className="text-terracotta-deep">
                  —
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
        <p className="rounded-lg bg-sage-soft px-4 py-2.5 text-sage">
          <strong>80 à 100 · Allez-y</strong>
          <br />
          Très bon match, à regarder en priorité
        </p>
        <p className="rounded-lg bg-ochre-soft px-4 py-2.5 text-ochre">
          <strong>60 à 79 · À étudier</strong>
          <br />
          Correspond en partie, à vérifier
        </p>
        <p className="rounded-lg bg-sand px-4 py-2.5 text-ink-soft">
          <strong>0 à 59 · Passez</strong>
          <br />
          Peu adapté à votre entreprise
        </p>
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-muted">
        La note est une aide au tri, pas une garantie : elle ne dit pas si vous remporterez le marché, ni si votre
        dossier sera conforme. La décision de répondre reste la vôtre. Dans cet exemple, la note globale est la moyenne
        des cinq critères ; la méthode définitive reste à construire et à valider avec les entreprises pilotes.
      </p>
    </div>
  );
}

const euro = (n: number) => `${n.toLocaleString("fr-FR")} € HT`;

function Price() {
  const [price, setPrice] = useState(priceRange.example);
  const span = priceRange.max - priceRange.min;
  const pos = (n: number) => ((n - priceRange.min) / span) * 100;
  const status =
    price < priceRange.low ? "below" : price > priceRange.high ? "above" : ("inside" as "below" | "above" | "inside");
  const inputId = useId();

  return (
    <div>
      <PanelIntro>
        Pour ne plus chiffrer à l&apos;aveugle : une fourchette de prix tirée de marchés comparables déjà attribués.
        Déplacez le curseur pour situer un prix dans la fourchette.
      </PanelIntro>

      <div className="mt-8 rounded-2xl border border-line bg-cream/50 p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Fourchette indicative</p>
        <p className="figure mt-1 text-3xl">
          {Math.round(priceRange.low / 1000)} – {Math.round(priceRange.high / 1000)} k€ HT
        </p>

        <div className="relative mt-8 h-2 rounded-full bg-sand" aria-hidden="true">
          <div
            className="absolute inset-y-0 rounded-full bg-sage"
            style={{ left: `${pos(priceRange.low)}%`, width: `${pos(priceRange.high) - pos(priceRange.low)}%` }}
          />
          <div
            className="absolute -top-2 h-6 w-1 -translate-x-1/2 rounded-full bg-ink transition-[left] duration-150"
            style={{ left: `${pos(price)}%` }}
          />
        </div>

        <label htmlFor={inputId} className="mt-8 block text-sm font-bold">
          Votre prix (exemple) : <span className="figure font-normal">{euro(price)}</span>
        </label>
        <input
          id={inputId}
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={250}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          aria-valuetext={euro(price)}
          className="mt-3 w-full accent-[#2B1E18]"
        />
        <p
          aria-live="polite"
          className={cn(
            "mt-4 text-sm font-semibold",
            status === "inside" ? "text-sage" : "text-ochre",
          )}
        >
          {status === "inside" && "Dans la fourchette indicative."}
          {status === "below" &&
            "En dessous de la fourchette : vérifiez que ce prix couvre bien vos coûts, ou qu'il ne sera pas jugé anormalement bas."}
          {status === "above" && "Au-dessus de la fourchette : un écart à justifier par la qualité de votre offre."}
        </p>
      </div>

      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-muted">
        Fonction à l&apos;étude. Sa fiabilité dépendra des données d&apos;attribution réellement disponibles pour chaque
        métier ; elle donnera un repère, jamais le « bon » prix. C&apos;est toujours l&apos;entreprise qui fixe son prix.
      </p>
    </div>
  );
}
