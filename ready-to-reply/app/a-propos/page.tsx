import Image from "next/image";
import { FinalCta } from "@/components/final-cta";
import { Placeholder } from "@/components/labels";
import { PageHero } from "@/components/page-hero";
import { Container, Section, SectionHeading } from "@/components/ui";
import { roadmap } from "@/content/product";
import { founder, founderDisplayName } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "À propos",
  description:
    "Ready to Reply est un projet porté par Eytan, responsable commercial chez DRIM, distributeur d'éclairage, qui prépare lui-même les réponses aux marchés publics.",
  path: "/a-propos",
});

// Éléments repris de la plaquette (septembre 2026), à faire relire par le fondateur.
const facts = [
  { value: "Depuis ses 19 ans", label: "chez DRIM, l'entreprise familiale de distribution d'éclairage" },
  { value: "Responsable commercial", label: "après avoir gravi les échelons un à un" },
  { value: "Lyon · Londres", label: "un ancrage local, un regard international" },
];

const stats = [
  { value: "233,3 Md€", label: "de marchés publics recensés en France en 2024." },
  { value: "60 %", label: "des contrats, en nombre, attribués aux TPE et PME." },
  { value: "25 %", label: "de la valeur seulement leur revient. C'est cet écart que nous voulons aider à réduire." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Un outil pensé par quelqu'un qui répond lui-même aux marchés."
      />

      <Section labelledBy="fondateur-titre">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <figure className="mx-auto w-full max-w-[22rem]">
            <div className="relative aspect-[841/1590] max-h-[34rem] overflow-hidden rounded-2xl bg-sand lg:max-h-none">
              <Image
                src="/eytan-fondateur.jpg"
                alt={`Portrait en noir et blanc d'${founder.firstName}, fondateur de Ready to Reply`}
                fill
                sizes="(min-width: 1024px) 22rem, 90vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="mt-4">
              <p className="font-semibold">
                {founderDisplayName()} {!founder.lastName && <Placeholder>Nom à compléter</Placeholder>}
              </p>
              <p className="text-sm text-ink-muted">{founder.role}</p>
            </figcaption>
          </figure>

          <div>
            <h2 id="fondateur-titre" className="text-3xl sm:text-4xl">
              Le fondateur
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>
                Lyonnais, {founder.firstName} entre à 19 ans chez DRIM, l&apos;entreprise familiale spécialisée dans la
                distribution d&apos;éclairage et d&apos;équipements professionnels. Il en gravit les échelons un à un,
                jusqu&apos;au poste de responsable commercial qu&apos;il occupe aujourd&apos;hui. Une année vécue à
                Londres a élargi son regard au-delà des frontières.
              </p>
              <p>
                Les appels d&apos;offres, il les prépare lui-même : métropoles, communes, bailleurs sociaux.
                Plateformes multiples, dossiers de cinquante pages, pièces à refournir sans cesse : il connaît chaque
                obstacle de l&apos;intérieur. Ready to Reply, c&apos;est l&apos;outil qu&apos;il aurait voulu avoir.
              </p>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {facts.map((f) => (
                <li key={f.value} className="border-t-2 border-terracotta pt-4">
                  <p className="font-serif text-xl leading-snug">{f.value}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{f.label}</p>
                </li>
              ))}
            </ul>
            <blockquote className="mt-10 rounded-2xl bg-terracotta p-7 text-ivory sm:p-8">
              <p className="font-serif text-xl leading-relaxed">
                « Cent sites, cent comptes, et des documents qu&apos;on ne comprend pas. C&apos;est ce que vivent les PME
                qui répondent, et c&apos;est ce que je veux changer. »
              </p>
              <footer className="mt-4 text-sm">— {founder.firstName}, fondateur</footer>
            </blockquote>
          </div>
        </div>
      </Section>

      <Section labelledBy="pourquoi-titre" className="bg-ivory">
        <SectionHeading
          id="pourquoi-titre"
          eyebrow="Pourquoi ce projet"
          title="Les PME décrochent la majorité des contrats. Mais une petite part de la valeur."
        />
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((s) => (
            <li key={s.value}>
              <p className="figure text-5xl text-terracotta-deep">{s.value}</p>
              <p className="mt-3 leading-relaxed text-ink-soft">{s.label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-ink-muted">
          Source : Direction des affaires juridiques, Observatoire économique de la commande publique (DAJ/OECP),
          chiffres 2024.
        </p>
      </Section>

      <Section labelledBy="projet-titre">
        <SectionHeading
          id="projet-titre"
          eyebrow="Le projet"
          title="France d'abord. Puis, pas à pas, plus loin."
          intro="Ready to Reply est un service indépendant, en construction. Voici les grandes étapes envisagées, qui restent des hypothèses de travail."
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r) => (
            <li key={r.step} className="card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-terracotta-deep">{r.step}</p>
              <h3 className="mt-2 text-xl">{r.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{r.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Container className="pb-16">
        <p className="text-sm text-ink-muted">
          Informations à compléter par le fondateur : <Placeholder>nom complet</Placeholder>{" "}
          <Placeholder>société et statut juridique</Placeholder>
        </p>
      </Container>

      <FinalCta />
    </>
  );
}
