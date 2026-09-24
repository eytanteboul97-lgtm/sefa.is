import { ButtonLink } from "@/components/ui";
import { included, pricing, yearlyDifference } from "@/content/pricing";
import { cn } from "@/lib/utils";

export function PricingPlans() {
  const plans = [
    {
      name: "Mensuel",
      price: pricing.monthly.label,
      period: pricing.monthly.period,
      note: "Tarif de référence envisagé.",
      highlight: true,
    },
    {
      name: "Annuel",
      price: pricing.yearly.label,
      period: pricing.yearly.period,
      note: `Soit ${yearlyDifference.toLocaleString("fr-FR")} € HT de moins que douze mensualités.`,
      highlight: false,
    },
    {
      name: "Tarif fondateur",
      price: pricing.founderOffer.label,
      period: pricing.founderOffer.period,
      note: pricing.founderOffer.enabled
        ? `Réservé aux ${pricing.founderOffer.seats} premiers clients.`
        : `Envisagé pour les ${pricing.founderOffer.seats} premiers clients. Offre à confirmer : conditions et durée non encore arrêtées.`,
      highlight: false,
      pending: !pricing.founderOffer.enabled,
    },
  ];

  return (
    <div>
      <p className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-ochre-soft px-4 py-1.5 text-center text-sm font-semibold text-ochre">
        <span aria-hidden="true">◆</span> Tarifs en cours de validation · rien n&apos;est facturé aujourd&apos;hui
      </p>
      <ul className="grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <li
            key={p.name}
            className={cn(
              "flex flex-col rounded-2xl border p-7",
              p.highlight ? "border-ink bg-ink text-cream" : "border-line bg-ivory",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className={cn("font-sans text-sm font-bold uppercase tracking-[0.14em]", p.highlight ? "text-tan" : "text-ink-muted")}>
                {p.name}
              </h3>
              {p.pending && (
                <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-ink-soft">À confirmer</span>
              )}
            </div>
            <p className={cn("figure mt-4 text-4xl", p.highlight ? "text-ivory" : "text-ink")}>{p.price}</p>
            <p className={cn("text-sm", p.highlight ? "text-cream/80" : "text-ink-muted")}>{p.period}</p>
            <p className={cn("mt-5 text-sm leading-relaxed", p.highlight ? "text-cream/90" : "text-ink-soft")}>{p.note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 rounded-2xl border border-line bg-ivory p-7 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <h3 className="font-sans text-sm font-bold">Ce que l&apos;abonnement doit comprendre</h3>
          <ul className="mt-4 grid gap-2.5 text-[0.95rem] text-ink-soft">
            {included.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            Périmètre envisagé pour la première version, susceptible d&apos;évoluer avec les retours des pilotes.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <ButtonLink href="/contact">Rejoindre le pilote</ButtonLink>
          <ButtonLink href="/contact?demande=rappel" variant="secondary">
            Poser une question sur les tarifs
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
