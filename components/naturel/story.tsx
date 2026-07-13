"use client";

import { Reveal } from "@/components/reveal";

export function Story() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-28">
      <Reveal>
        <span className="naturel-display block text-center text-[11px] uppercase tracking-[0.35em] text-naturel-ink/45">
          A Note on Time
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="naturel-dropcap naturel-serif mt-8 text-xl leading-[1.85] text-naturel-ink/80 sm:text-2xl">
          Somewhere between the last warm evening and the first cold morning, the coastline changes its mind. The
          sand cools. The light turns from gold to grey. Nothing announces it — it simply happens, the way good
          things tend to.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-8 text-base leading-[1.9] text-naturel-ink/60">
          We built Naturel around that same quiet transition. Every piece is cut from cotton that hasn't been told
          to behave — it will fade unevenly, soften at the brim first, hold the shape of your head before it holds
          anything else. The leather patch will darken faster than you expect. None of this is a flaw. It is the
          object learning who it belongs to.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="mt-6 text-base leading-[1.9] text-naturel-ink/60">
          That is why every piece carries a number instead of a size chart. One hundred per tone, never restocked,
          never reprinted. Not because scarcity is exciting — because a number is the only honest way to say:
          this one is yours, and no one else's will ever be identical to it.
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <p className="naturel-accent mt-10 text-center text-lg text-naturel-ink/50">
          Slowness, we've found, is the only luxury that doesn't run out.
        </p>
      </Reveal>
    </section>
  );
}
