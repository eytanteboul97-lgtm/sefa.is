import { MockupLabel } from "@/components/labels";
import { AffinityScale, VerdictTag, toneBar } from "@/components/verdict-tag";
import { cn } from "@/lib/utils";
import { priceRange, verdict, weeklyMarkets } from "@/content/demo";

const k = (n: number) => Math.round(n / 1000);

/** Maquette du hero, reprise de la plaquette. Purement illustrative. */
export function HeroMockup() {
  const span = priceRange.max - priceRange.min;
  const left = ((priceRange.low - priceRange.min) / span) * 100;
  const width = ((priceRange.high - priceRange.low) / span) * 100;
  const marker = ((priceRange.example - priceRange.min) / span) * 100;

  return (
    <figure className="relative mx-auto w-full max-w-[34rem]">
      <div className="card animate-rise p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
        <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
          <p className="text-[0.95rem] font-bold">Vos marchés de la semaine</p>
          <p className="text-xs text-ink-muted">Affinité avec votre entreprise</p>
        </div>
        <ul className="divide-y divide-line">
          {weeklyMarkets.map((m) => (
            <li key={m.title} className="flex items-center gap-4 py-3">
              <span className="w-[3.7rem] shrink-0 leading-none" aria-label={`Affinité ${m.score} sur 100`}>
                <span className="figure text-[1.35rem]">{m.score}</span>
                <span className="text-[0.7rem] text-ink-muted">/100</span>
                <span aria-hidden="true" className="mt-1.5 block h-1 overflow-hidden rounded-full bg-sand">
                  <span className={cn("block h-full rounded-full", toneBar[verdict(m.score).tone])} style={{ width: `${m.score}%` }} />
                </span>
              </span>
              <span className="flex-1 text-sm font-medium">{m.title}</span>
              <VerdictTag score={m.score} />
            </li>
          ))}
        </ul>
        <AffinityScale className="flex w-full border-t border-line pt-3" />
      </div>

      <div
        className="relative z-10 -mt-3 ml-auto w-[88%] animate-rise overflow-hidden rounded-2xl bg-ivory shadow-float sm:-mt-5 sm:w-[78%]"
        style={{ animationDelay: "320ms" }}
      >
        <div className="flex items-center gap-4 bg-ink px-5 py-4 text-cream">
          <p className="figure text-4xl leading-none">
            82<span className="text-base text-tan">/100</span>
          </p>
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-tan">Affinité · Allez-y</p>
            <p className="text-sm font-medium">Éclairage LED — gymnase</p>
          </div>
        </div>
        <div className="px-5 py-4">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-muted">Fourchette indicative</p>
          <p className="figure mt-1 text-2xl">
            {k(priceRange.low)} – {k(priceRange.high)} k€ HT
          </p>
          <div className="relative mt-3 h-1.5 rounded-full bg-sand" aria-hidden="true">
            <div
              className="absolute inset-y-0 origin-left animate-grow rounded-full bg-sage"
              style={{ left: `${left}%`, width: `${width}%`, animationDelay: "600ms" }}
            />
            <div className="absolute -top-1.5 h-4 w-0.5 bg-ink" style={{ left: `${marker}%` }} />
          </div>
          <p className="mt-3 text-sm font-semibold text-sage">Pièces prêtes : 6 / 7</p>
        </div>
      </div>

      <figcaption className="mt-4 text-right">
        <MockupLabel />
      </figcaption>
    </figure>
  );
}
