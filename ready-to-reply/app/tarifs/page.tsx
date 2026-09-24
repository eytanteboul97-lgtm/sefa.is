import { Faq } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { PricingPlans } from "@/components/pricing-plans";
import { Section, SectionHeading } from "@/components/ui";
import { faq } from "@/content/faq";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Tarifs",
  description:
    "Tarifs envisagés de Ready to Reply : 149 € HT par mois ou 1 490 € HT par an, tarif fondateur à l'étude. Tarifs en cours de validation, aucun paiement aujourd'hui.",
  path: "/tarifs",
});

const points = [
  {
    t: "Des tarifs en cours de validation",
    d: "Ces montants sont des hypothèses de travail, affinées avec les entreprises pilotes. Ils seront confirmés avant tout lancement commercial, et les conditions complètes (engagement, résiliation, remboursement) publiées à ce moment-là.",
  },
  {
    t: "Rien n'est facturé aujourd'hui",
    d: "La plateforme n'est pas encore ouverte et aucun paiement n'est proposé sur ce site. Rejoindre la phase pilote ne vous engage à rien.",
  },
  {
    t: "Un tarif fondateur à confirmer",
    d: "Un tarif de 99 € HT par mois est envisagé pour les 100 premiers clients. Ses conditions et sa durée ne sont pas encore arrêtées : il n'est pas disponible à ce jour.",
  },
  {
    t: "Des prix hors taxes",
    d: "Les tarifs s'adressent aux entreprises et sont indiqués hors taxes (HT).",
  },
];

const pricingFaq = faq.filter((f) => /tarif|disponibles|pilote/i.test(f.q));

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        title="Un abonnement simple, sans frais cachés."
        intro="Un seul abonnement, qui comprend l'ensemble du parcours : trouver, comprendre, préparer et suivre vos candidatures."
      />
      <Section labelledBy="formules-titre">
        <h2 id="formules-titre" className="sr-only">
          Les formules envisagées
        </h2>
        <PricingPlans />
      </Section>
      <Section labelledBy="transparence-titre" className="bg-ivory">
        <SectionHeading id="transparence-titre" eyebrow="En toute transparence" title="Ce qu'il faut savoir sur ces tarifs." />
        <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {points.map((p) => (
            <li key={p.t} className="border-t-2 border-terracotta pt-5">
              <h3 className="text-xl">{p.t}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{p.d}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section labelledBy="tarifs-faq-titre">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <SectionHeading id="tarifs-faq-titre" eyebrow="Questions" title="Questions sur les tarifs." />
          <Faq items={pricingFaq} />
        </div>
      </Section>
    </>
  );
}
