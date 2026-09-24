import { Container } from "@/components/ui";

/** Gabarit des pages juridiques : les textes sont des modèles à faire valider. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <Container className="py-12 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Informations</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-ink-muted">Dernière mise à jour : {updated}</p>
        <div role="note" className="mt-8 rounded-xl border border-ochre/30 bg-ochre-soft p-5 text-sm leading-relaxed text-ink">
          <strong>Document provisoire, à compléter.</strong> Ce texte est un modèle de travail : les champs entre
          crochets doivent être renseignés et l&apos;ensemble relu par une personne compétente avant la mise en ligne
          publique du site.
        </div>
        <div className="prose-legal mt-4">{children}</div>
      </div>
    </Container>
  );
}
