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
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,23rem)_1fr] lg:gap-[4.5rem]">
          <figure className="relative mx-auto w-full max-w-[20rem] pt-6 lg:max-w-[23rem]">
            {/* Arche de la couleur du fond de la photo : le portrait s'y fond au lieu d'être posé en bloc. */}
            <span aria-hidden="true" className="portrait-arch absolute bottom-[5.5rem] left-[9%] right-0 top-0" />
            <Image
              src="/eytan-fondateur-duo.jpg"
              alt={`Portrait d'${founderDisplayName()}, fondateur de Ready to Reply`}
              width={620}
              height={1172}
              sizes="(min-width: 1024px) 23rem, 20rem"
              className="portrait-fade relative block h-auto max-h-[36rem] w-full object-cover object-top"
            />
            <figcaption className="relative -mt-9 pl-[9%]">
              <p className="font-serif text-2xl leading-tight">
                {founderDisplayName()} {!founder.lastName && <Placeholder>Nom à compléter</Placeholder>}
              </p>
              <p className="mt-1.5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-terracotta-deep">
                <span aria-hidden="true" className="h-0.5 w-7 bg-terracotta" />
                Fondateur
              </p>
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
                « Trop de plateformes. Trop d&apos;identifiants. Trop de pages à lire pour savoir si un marché vaut le
                coup. Les PME savent faire le travail : c&apos;est la réponse qui les épuise. Ready to Reply, c&apos;est
                l&apos;outil que j&apos;aurais voulu avoir. »
              </p>
              <footer className="mt-4 text-sm">— {founderDisplayName()}, fondateur</footer>
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
          Informations à compléter par le fondateur :           <Placeholder>société et statut juridique</Placeholder>
        </p>
      </Container>

      <FinalCta />
    </>
  );
}
