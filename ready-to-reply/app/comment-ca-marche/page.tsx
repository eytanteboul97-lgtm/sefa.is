import { FinalCta } from "@/components/final-cta";
import { FictionalLabel, StatusBadge } from "@/components/labels";
import { PageHero } from "@/components/page-hero";
import { Arrow, ButtonLink, Section, SectionHeading } from "@/components/ui";
import { productStatus, roadmap, steps } from "@/content/product";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Comment ça marche",
  description:
    "Trouver, comprendre, préparer, suivre : le parcours Ready to Reply en quatre étapes, avec un exemple concret sur un marché fictif, et l'état d'avancement de chaque étape.",
  path: "/comment-ca-marche",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Comment ça marche"
        title="Quatre étapes, de l'annonce au dossier prêt à déposer."
        intro={
          <>
            <p>
              Ready to Reply veut accompagner chaque candidature, du repérage de l&apos;annonce jusqu&apos;au suivi du
              résultat. À chaque étape, l&apos;entreprise garde la main : nous préparons, vous décidez.
            </p>
            <p className="mt-4 rounded-xl border border-line bg-ivory px-4 py-3 text-base">
              <strong className="text-ink">Où en est le projet ? </strong>
              {productStatus.summary}
            </p>
          </>
        }
      />

      <Section labelledBy="etapes-titre">
        <h2 id="etapes-titre" className="sr-only">
          Les quatre étapes
        </h2>
        <ol className="space-y-6">
          {steps.map((s) => (
            <li key={s.n} className="card grid gap-8 p-7 sm:p-10 lg:grid-cols-[auto_1.3fr_1fr]">
              <p className="figure text-5xl text-terracotta-deep">{s.n}</p>
              <div>
                <h3 className="text-3xl">{s.title}</h3>
                <StatusBadge status={s.status} className="mt-4" />
                <p className="mt-5 leading-relaxed text-ink-soft">{s.long}</p>
              </div>
              <div className="rounded-xl bg-cream p-6">
                <FictionalLabel />
                <p className="mt-4 text-[0.97rem] leading-relaxed">{s.example}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-ink p-8 text-cream sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl font-serif text-xl leading-snug">
            Voir la fiche marché de l&apos;exemple, avec ses pièces, ses dates, ses points de vigilance et son score.
          </p>
          <ButtonLink href="/#demo" variant="light">
            Ouvrir la démonstration <Arrow />
          </ButtonLink>
        </div>
      </Section>

      <Section labelledBy="etat-titre" className="bg-ivory">
        <SectionHeading
          id="etat-titre"
          eyebrow="Ce qui existe, ce qui reste à construire"
          title="Avancer par étapes."
          intro="La feuille de route du projet, telle qu'elle est envisagée aujourd'hui. Ce sont des hypothèses de travail, qui évolueront avec les entreprises pilotes."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-sage/30 bg-sage-soft p-7">
            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-sage">Disponible aujourd&apos;hui</h3>
            <ul className="mt-4 space-y-2 leading-relaxed">
              <li>Ce site de présentation.</li>
              <li>Une démonstration interactive sur un marché fictif.</li>
              <li>Un formulaire pour rejoindre la phase pilote ou demander un échange.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-cream p-7">
            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">Pas encore disponible</h3>
            <ul className="mt-4 space-y-2 leading-relaxed text-ink-soft">
              <li>Aucune fonction de la plateforme : veille, fiche marché, score, coffre-fort, préparation, suivi.</li>
              <li>Aucun compte utilisateur, aucun paiement.</li>
            </ul>
          </div>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r) => (
            <li key={r.step} className="border-t-2 border-terracotta pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-terracotta-deep">{r.step}</p>
              <h3 className="mt-2 text-xl">{r.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{r.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <FinalCta />
    </>
  );
}
