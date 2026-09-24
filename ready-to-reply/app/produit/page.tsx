import { FinalCta } from "@/components/final-cta";
import Link from "next/link";
import { StatusBadge, type FeatureStatus } from "@/components/labels";
import { PageHero } from "@/components/page-hero";
import { Arrow, ButtonLink, Section, SectionHeading } from "@/components/ui";
import { features, productStatus } from "@/content/product";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Le produit",
  description:
    "Veille, fiche de synthèse, points de vigilance, score d'affinité, coffre-fort documentaire, préparation et suivi : les fonctions envisagées de Ready to Reply et leur statut réel.",
  path: "/produit",
});

const legend: { status: FeatureStatus; text: string }[] = [
  { status: "v1", text: "en cours de conception, prévu pour la première version (V1)" },
  { status: "later", text: "envisagé après la première version" },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Le produit"
        title="Plus loin qu'une veille : jusqu'au dossier prêt à déposer."
        intro={
          <p>
            Des outils de veille et d&apos;aide à la réponse existent déjà. Le parti pris de Ready to Reply : aller
            jusqu&apos;au dossier prêt à déposer, métier par métier. {productStatus.summary}
          </p>
        }
      />

      <Section labelledBy="fonctions-titre">
        <SectionHeading id="fonctions-titre" eyebrow="Les fonctions" title="Chaque fonction, avec son statut réel." />
        <dl className="mt-8 flex flex-col gap-3 text-sm text-ink-soft sm:flex-row sm:flex-wrap sm:gap-x-8">
          {legend.map((l) => (
            <div key={l.status} className="flex flex-wrap items-center gap-2">
              <dt>
                <StatusBadge status={l.status} />
              </dt>
              <dd>{l.text}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((f) => (
            <li key={f.title} className="card flex flex-col p-7">
              <StatusBadge status={f.status} className="self-start" />
              <h3 className="mt-5 text-2xl">{f.title}</h3>
              <p className="mt-3 font-medium leading-relaxed">{f.description}</p>
              <p className="mt-3 leading-relaxed text-ink-soft">{f.detail}</p>
              {f.inDemo && (
                <Link
                  href="/#demo"
                  className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-terracotta-deep underline-offset-4 hover:underline"
                >
                  Aperçu dans la démonstration (maquette) <Arrow />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="principes-titre" className="bg-ivory">
        <SectionHeading
          id="principes-titre"
          eyebrow="Nos principes"
          title="Un outil qui aide, sans décider à votre place."
        />
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              t: "Vous gardez la main",
              d: "Rien n'est déposé automatiquement. Vous relisez, modifiez, validez, signez et déposez vous-même votre offre.",
            },
            {
              t: "Des repères, pas des garanties",
              d: "Le score et la fourchette de prix aident à décider. Ils ne garantissent ni le succès d'une candidature, ni sa conformité.",
            },
            {
              t: "Un service indépendant",
              d: "Ready to Reply n'est ni un organisme public, ni un partenaire officiel des acheteurs ou des plateformes de publication.",
            },
          ].map((p) => (
            <li key={p.t} className="border-t-2 border-terracotta pt-5">
              <h3 className="text-xl">{p.t}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{p.d}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <ButtonLink href="/#demo" variant="secondary">
            Essayer la démonstration <Arrow />
          </ButtonLink>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
