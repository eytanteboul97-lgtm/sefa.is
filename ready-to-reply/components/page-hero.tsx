import { Container, SectionHeading } from "@/components/ui";

/** En-tête commun aux pages intérieures : porte le H1 unique de la page. */
export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode }) {
  return (
    <section className="border-b border-line">
      <Container className="pb-16 pt-12 sm:pb-20 sm:pt-20">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} className="max-w-3xl" />
      </Container>
    </section>
  );
}
