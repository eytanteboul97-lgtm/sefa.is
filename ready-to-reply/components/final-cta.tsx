import { Arrow, ButtonLink, Container } from "@/components/ui";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-titre" className="bg-terracotta text-ivory">
      <Container className="py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ivory">Phase pilote</p>
            <h2 id="cta-titre" className="mt-3 text-3xl leading-tight text-ivory sm:text-[2.6rem]">
              Construisons l&apos;outil avec celles et ceux qui répondent aux marchés.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory">
              Vous êtes une PME de l&apos;électricité ou de l&apos;éclairage ? Rejoignez la phase pilote : vos retours
              orienteront la première version. Échange sans engagement.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/contact" variant="light">
              Rejoindre le pilote <Arrow />
            </ButtonLink>
            <ButtonLink
              href="/contact?demande=demo"
              className="border border-ivory/60 bg-transparent text-ivory hover:bg-ivory/10"
            >
              Demander une démonstration
            </ButtonLink>
          </div>
        </div>
        <p className="mt-12 text-sm text-ivory">{site.brandLine}</p>
      </Container>
    </section>
  );
}
