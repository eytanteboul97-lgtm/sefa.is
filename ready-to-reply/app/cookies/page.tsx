import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Cookies",
  description: "Le site Ready to Reply n'utilise aucun cookie de mesure d'audience ni de publicité.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies" updated="septembre 2026">
      <h2>Ce que fait ce site aujourd&apos;hui</h2>
      <p>
        Le site Ready to Reply ne dépose aucun cookie de mesure d&apos;audience, de publicité ou de réseaux sociaux, et
        n&apos;intègre aucun contenu tiers qui en déposerait. C&apos;est pourquoi aucun bandeau de consentement ne
        s&apos;affiche.
      </p>
      <p>
        Les polices de caractères sont servies directement par le site, sans appel à un service externe lors de votre
        visite.
      </p>

      <h2>Si cela change</h2>
      <p>
        Si un outil de mesure d&apos;audience ou tout autre traceur non essentiel est ajouté, il ne sera activé
        qu&apos;après votre accord, recueilli via un bandeau de consentement, et cette page sera mise à jour.
      </p>
    </LegalPage>
  );
}
