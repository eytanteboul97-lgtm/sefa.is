import Link from "next/link";
import { Placeholder } from "@/components/labels";
import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/metadata";
import { contact, legal } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Comment Ready to Reply traite les informations envoyées via le formulaire de contact : finalité, durée de conservation et droits.",
  path: "/confidentialite",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité" updated="septembre 2026">
      <h2>Responsable du traitement</h2>
      <p>
        {legal.companyName ?? <Placeholder>dénomination de la société</Placeholder>},{" "}
        {legal.address ?? <Placeholder>adresse</Placeholder>}. Contact pour toute question relative à vos données :{" "}
        {contact.email ?? <Placeholder>adresse e-mail dédiée</Placeholder>}.
      </p>

      <h2>Données collectées</h2>
      <p>Ce site ne collecte des données personnelles que via le formulaire de contact :</p>
      <ul>
        <li>prénom et nom, adresse e-mail professionnelle ;</li>
        <li>nom de l&apos;entreprise, métier, taille de l&apos;entreprise (facultatif) ;</li>
        <li>besoin principal et message libre (facultatif).</li>
      </ul>
      <p>
        Aucun document d&apos;entreprise n&apos;est demandé ni stocké. Merci de ne transmettre aucune information
        confidentielle dans le message libre.
      </p>

      <h2>Finalité et base légale</h2>
      <p>
        Ces informations servent uniquement à répondre à votre demande (phase pilote, démonstration, rappel) et à vous
        recontacter à ce sujet. Le traitement repose sur votre consentement, recueilli dans le formulaire. Elles ne sont
        ni vendues, ni louées, ni utilisées à d&apos;autres fins.
      </p>

      <h2>Destinataires et sous-traitants</h2>
      <p>
        Les demandes sont transmises à l&apos;équipe Ready to Reply via{" "}
        <Placeholder>outil de réception : nom du service et pays d&apos;hébergement</Placeholder>. Le site est hébergé par{" "}
        {legal.host ?? <Placeholder>hébergeur</Placeholder>}.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        <Placeholder>durée à définir, par exemple : 3 ans à compter du dernier contact</Placeholder>
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez accéder à vos données, les rectifier, les effacer, en limiter le traitement, vous opposer à leur
        traitement, en demander la portabilité et retirer votre consentement à tout moment, en écrivant à{" "}
        {contact.email ?? <Placeholder>adresse e-mail dédiée</Placeholder>}. Vous pouvez également introduire une
        réclamation auprès de la CNIL (cnil.fr).
      </p>

      <h2>Cookies</h2>
      <p>
        Voir la page <Link href="/cookies">Cookies</Link>.
      </p>
    </LegalPage>
  );
}
