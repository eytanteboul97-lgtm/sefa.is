import { Container } from "@/components/ui";
import { Veille } from "@/components/veille";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Veille des marchés · version de test",
  description:
    "Version de test de la veille Ready to Reply : les avis récents du BOAMP filtrés et notés selon le profil de votre entreprise.",
  path: "/veille",
});

export default function VeillePage() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-sage">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
          Version de test · données réelles du BOAMP
        </p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">Vos marchés de la semaine</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Les avis de marchés publiés au BOAMP, triés pour votre entreprise. Ajustez votre profil : la sélection et les notes se recalculent.
        </p>
      </div>

      <div className="mt-10">
        <Veille />
      </div>

      <div className="mt-14 space-y-2 border-t border-line pt-6 text-sm leading-relaxed text-ink-muted">
        <p>
          Source : Bulletin officiel des annonces des marchés publics (BOAMP), données ouvertes publiées par la DILA sous
          licence ouverte. Ready to Reply est un service indépendant, sans lien officiel avec la DILA ni avec les
          acheteurs.
        </p>
        <p>
          Limites de cette version : la recherche porte sur l&apos;objet et les descripteurs des avis, pas encore sur les
          documents de la consultation ; le montant n&apos;est connu que lorsque l&apos;avis l&apos;indique ; seuls les
          avis publiés au BOAMP sont couverts, pas ceux publiés uniquement sur d&apos;autres plateformes.
        </p>
      </div>
    </Container>
  );
}
