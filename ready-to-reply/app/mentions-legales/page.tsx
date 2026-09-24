import { Placeholder } from "@/components/labels";
import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/metadata";
import { contact, legal } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site Ready to Reply : éditeur, hébergeur, propriété intellectuelle.",
  path: "/mentions-legales",
});

const v = (value: string | null, label: string) => value ?? <Placeholder>{label}</Placeholder>;

export default function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales" updated="septembre 2026">
      <h2>Éditeur du site</h2>
      <p>
        Le site Ready to Reply est édité par {v(legal.companyName, "dénomination de la société")},{" "}
        {v(legal.legalForm, "forme juridique et capital")}, dont le siège est situé {v(legal.address, "adresse du siège")},
        immatriculée sous le numéro {v(legal.siren, "SIREN / RCS")}.
      </p>
      <p>Directeur ou directrice de la publication : {v(legal.publicationDirector, "nom et fonction")}.</p>
      <p>
        Contact : {v(contact.email, "adresse e-mail")} · {v(contact.phone, "téléphone")}
      </p>

      <h2>Hébergement</h2>
      <p>Le site est hébergé par {v(legal.host, "nom, adresse et téléphone de l'hébergeur")}.</p>

      <h2>Nature du service</h2>
      <p>
        Ready to Reply est un service indépendant, actuellement en cours de construction. Il n&apos;est ni un organisme
        public, ni un partenaire officiel des acheteurs publics ou des plateformes de publication des marchés publics.
        Les écrans présentés sur ce site sont des maquettes ; les exemples de marchés et les données qui les
        accompagnent sont fictifs.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, visuels, maquettes et le logo Ready to Reply sont la propriété de leur éditeur, sauf mention
        contraire. Toute reproduction sans autorisation préalable est interdite.
      </p>

      <h2>Sources citées</h2>
      <p>
        Les chiffres de la commande publique mentionnés sur le site proviennent de la Direction des affaires
        juridiques, Observatoire économique de la commande publique (DAJ/OECP), chiffres 2024.
      </p>
    </LegalPage>
  );
}
