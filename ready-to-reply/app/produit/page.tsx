import { FinalCta } from "@/components/final-cta";
import Link from "next/link";
import { StatusBadge, type FeatureStatus } from "@/components/labels";
import { PageHero } from "@/components/page-hero";
import { Arrow, ButtonLink, Section, SectionHeading, buttonClasses } from "@/components/ui";
import { features, productStatus } from "@/content/product";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Le produit",
  description:
    "Veille, fiche de synthèse, points de vigilance, score d'affinité, coffre-fort documentaire, préparation et suivi : les fonctions envisagées de Ready to Reply et leur statut réel.",
  path: "/produit",
});

const legend: { status: FeatureStatus; text: string }[] = [
  { status: "test", text: "utilisable dès aujourd'hui, en version de test" },
  { status: "v1", text: "en cours de conception, prévu pour la première version (V1)" },
  { status: "later", text: "envisagé après la première version" },
];

const vaultPromises = [
  ["Elles restent les vôtres", "Vous les consultez, les téléchargez ou les supprimez quand vous voulez."],
  ["Confidentielles, point", "Jamais revendues, jamais partagées, jamais utilisées pour une autre entreprise."],
  ["Pour vos dossiers uniquement", "Elles ne servent qu'à préparer vos réponses, et seule votre entreprise y a accès."],
  ["Nous veillons dessus", "Une alerte avant chaque expiration, pour ne jamais déposer une pièce périmée."],
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
              {f.tryHref && (
                <Link href={f.tryHref} className={buttonClasses("primary", "mt-5 self-start")}>
                  Essayer la veille <Arrow />
                </Link>
              )}
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

      <Section labelledBy="coffre-titre" className="bg-ink text-cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-tan">Coffre-fort documentaire</p>
            <h2 id="coffre-titre" className="mt-3 text-3xl leading-tight text-ivory sm:text-4xl">
              Vos pièces, sous bonne garde.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream">
              Kbis, attestations, bilans, assurances : des documents sensibles, qui disent tout de votre entreprise.
              Voici nos engagements, pris avant même l&apos;ouverture du coffre-fort.
            </p>
          </div>
          <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {vaultPromises.map(([t, d]) => (
              <li key={t} className="border-t-2 border-terracotta-bright pt-4">
                <h3 className="text-xl text-ivory">{t}</h3>
                <p className="mt-2 leading-relaxed text-cream">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-sm text-tan">
          Le coffre-fort est en conception. Les conditions précises d&apos;hébergement et de sécurité seront publiées
          avant son ouverture.
        </p>
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
