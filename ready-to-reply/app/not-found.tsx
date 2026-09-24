import { ButtonLink, Container } from "@/components/ui";

export const metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Cette page n&apos;existe pas.</h1>
      <p className="mt-5 max-w-xl text-lg text-ink-soft">
        Le lien est peut-être incorrect, ou la page a été déplacée.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Nous contacter
        </ButtonLink>
      </div>
    </Container>
  );
}
