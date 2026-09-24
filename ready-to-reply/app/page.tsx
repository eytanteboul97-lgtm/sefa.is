import Link from "next/link";
import { Demo } from "@/components/demo";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { HeroMockup } from "@/components/hero-mockup";
import { StatusBadge } from "@/components/labels";
import { PricingPlans } from "@/components/pricing-plans";
import { Arrow, ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { steps } from "@/content/product";
import { demoCta, primaryCta } from "@/lib/site";

const problems = [
  {
    title: "Des annonces dispersées",
    text: "Des dizaines de plateformes d'acheteurs, un compte par site, et la même recherche à refaire partout.",
  },
  {
    title: "Des consultations longues à lire",
    text: "Règlement, cahier des charges, annexes : souvent plusieurs dizaines de pages, avec des pièges glissés au détour d'un article.",
  },
  {
    title: "Toujours les mêmes pièces",
    text: "Kbis, attestations, assurances, chiffre d'affaires : à retrouver, vérifier et réunir à chaque candidature.",
  },
  {
    title: "Des critères et des délais peu visibles",
    text: "Comment l'offre sera-t-elle notée ? La visite est-elle obligatoire ? Quand faut-il avoir posé ses questions ?",
  },
  {
    title: "Un effort difficile à estimer",
    text: "Combien de temps consacrer à ce dossier, et à quel prix répondre ? Trop cher, on perd. Trop bas, on perd de l'argent.",
  },
];

const benefits = [
  {
    title: "Voir clair plus vite",
    text: "L'essentiel d'une consultation sur une page, pour décider d'y aller ou non sans y passer la matinée.",
  },
  {
    title: "Mettre son temps au bon endroit",
    text: "Un avis franc sur chaque marché, pour consacrer ses efforts aux candidatures qui ont du sens pour l'entreprise.",
  },
  {
    title: "Ne plus rien oublier",
    text: "Visite obligatoire, pièce expirée, date de questions : les détails qui font écarter une offre, signalés à temps.",
  },
  {
    title: "Garder la main",
    text: "Rien n'est déposé à votre place. Vous relisez, ajustez et validez chaque dossier, sous votre nom.",
  },
];

const profiles = [
  "Distributeurs de matériel électrique ou d'éclairage",
  "Installateurs et entreprises d'électricité",
  "Entreprises de maintenance de l'éclairage public",
];

const later = ["Autres métiers des travaux", "Fournitures", "Services", "Belgique et Luxembourg"];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-titre" className="overflow-hidden">
        <Container className="grid items-center gap-14 pb-20 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-28 lg:pt-20">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ivory px-3.5 py-1.5 text-xs font-semibold text-ink-soft">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-terracotta" />
              Projet en construction · phase pilote en préparation
            </p>
            <h1 id="hero-titre" className="mt-6 text-[2.6rem] leading-[1.1] sm:text-6xl lg:text-[2.95rem] xl:text-[3.45rem]">
              <span className="block lg:whitespace-nowrap">Les bons marchés.</span>
              <span className="block italic text-terracotta-deep lg:whitespace-nowrap">Les bonnes réponses.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Ready to Reply aide les PME à repérer les appels d&apos;offres publics faits pour elles, puis à préparer
              leur dossier plus simplement. Vous gardez la main, du premier repérage au dossier prêt à déposer.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={primaryCta.href}>
                {primaryCta.label} <Arrow />
              </ButtonLink>
              <ButtonLink href={demoCta.href} variant="secondary">
                {demoCta.label}
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-ink-muted">
              Pour commencer : les entreprises de l&apos;électricité et de l&apos;éclairage.
            </p>
          </div>
          <HeroMockup />
        </Container>
      </section>

      {/* PROBLÈME */}
      <Section labelledBy="probleme-titre" className="bg-ivory">
        <SectionHeading
          id="probleme-titre"
          eyebrow="Le problème"
          title="Les petites entreprises ont du talent. Pas du temps à perdre."
          intro="Une commune cherche un fournisseur. Une PME pourrait répondre, et gagner. Mais entre l'annonce et le dépôt, le parcours décourage."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <li key={p.title} className="bg-ivory p-7">
              <p className="figure text-sm text-terracotta-deep">0{i + 1}</p>
              <h3 className="mt-3 text-xl">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          ))}
          <li className="flex flex-col justify-end bg-ink p-7 text-cream">
            <p className="font-serif text-xl leading-snug">
              Résultat : des marchés à portée de main qui passent sans réponse.
            </p>
          </li>
        </ul>
      </Section>

      {/* SOLUTION */}
      <Section labelledBy="solution-titre">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="solution-titre"
            eyebrow="La solution"
            title="Trouver. Comprendre. Préparer. Suivre."
            intro="Un parcours simple, de l'annonce au dossier prêt à déposer."
          />
          <Link
            href="/comment-ca-marche"
            className="inline-flex items-center gap-2 font-semibold text-terracotta-deep underline-offset-4 hover:underline"
          >
            Le parcours en détail <Arrow />
          </Link>
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="card flex flex-col p-7">
              <p className="figure text-3xl text-terracotta-deep">{s.n}</p>
              <h3 className="mt-4 text-2xl">{s.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{s.short}</p>
              <StatusBadge status={s.status} className="mt-6 self-start" />
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-2 rounded-2xl bg-ink px-7 py-6 text-cream sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-xl">L&apos;entreprise relit, ajuste, valide et dépose. Elle garde toujours la main.</p>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-tan">Nous préparons · vous décidez</p>
        </div>
      </Section>

      {/* DÉMONSTRATION */}
      <Section id="demo" labelledBy="demo-titre" className="bg-sand/70">
        <SectionHeading
          id="demo-titre"
          eyebrow="Démonstration interactive"
          title="Cinquante pages de consultation. Une page à lire."
          intro="Parcourez la fiche d'un marché fictif, telle que Ready to Reply veut la présenter. C'est une maquette cliquable : la plateforme elle-même est en construction et aucune de ses fonctions n'est encore utilisable."
        />
        <div className="mt-12">
          <Demo />
        </div>
      </Section>

      {/* BÉNÉFICES */}
      <Section labelledBy="benefices-titre">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            id="benefices-titre"
            eyebrow="Ce que nous visons"
            title="Du temps et de la clarté, pour répondre mieux."
            intro="Ce sont les bénéfices que nous cherchons à apporter. Nous les mesurerons avec les entreprises pilotes avant d'annoncer le moindre chiffre."
          />
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b.title} className="border-t-2 border-terracotta pt-5">
                <h3 className="text-xl">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* POUR QUI */}
      <Section labelledBy="pour-qui-titre" className="bg-ivory">
        <SectionHeading
          id="pour-qui-titre"
          eyebrow="Pour qui ?"
          title="D'abord l'électricité et l'éclairage."
          intro="Un premier métier, bien connu de son fondateur, pour construire un outil précis plutôt qu'un outil vague. Pour les dirigeants et responsables commerciaux qui répondent aux communes, métropoles, bailleurs sociaux et établissements publics."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl bg-terracotta p-8 text-ivory">
            <p className="text-xs font-bold uppercase tracking-[0.16em]">Priorité de la phase pilote</p>
            <ul className="mt-6 space-y-4">
              {profiles.map((p) => (
                <li key={p} className="flex gap-3 font-serif text-xl leading-snug">
                  <span aria-hidden="true">—</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-dashed border-ink/25 p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">Pistes d&apos;élargissement</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {later.map((l) => (
                <li key={l} className="rounded-full bg-sand px-3.5 py-1.5 text-sm font-medium text-ink-soft">
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              Envisagées après la phase pilote. Ces secteurs ne sont pas encore couverts.
            </p>
          </div>
        </div>
      </Section>

      {/* TARIFS */}
      <Section labelledBy="tarifs-titre">
        <SectionHeading
          id="tarifs-titre"
          eyebrow="Tarifs"
          title="Un abonnement simple, sans frais cachés."
          intro="Voici les tarifs envisagés. Ils seront confirmés avant tout lancement commercial."
          align="center"
        />
        <div className="mt-12">
          <PricingPlans />
        </div>
        <p className="mt-6 text-center">
          <Link href="/tarifs" className="font-semibold text-terracotta-deep underline-offset-4 hover:underline">
            Tout savoir sur les tarifs
          </Link>
        </p>
      </Section>

      {/* FAQ */}
      <Section labelledBy="faq-titre" className="bg-ivory">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <SectionHeading
            id="faq-titre"
            eyebrow="Questions fréquentes"
            title="Ce qu'il faut savoir."
            intro={
              <>
                Une autre question ?{" "}
                <Link href="/contact?demande=rappel" className="font-semibold text-terracotta-deep underline underline-offset-2">
                  Écrivez-nous
                </Link>
                .
              </>
            }
          />
          <Faq />
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
