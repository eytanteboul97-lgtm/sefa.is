"use client";

import { Reveal } from "@/components/reveal";

const COLLECTION = [
  { name: "Sable", num: "01", edition: "045", color: "#D9C7AC" },
  { name: "Dune", num: "02", edition: "034", color: "#CBA46B" },
  { name: "Palm", num: "03", edition: "002", color: "#7C8768" },
  { name: "Ocean", num: "04", edition: "088", color: "#5C6A74" },
  { name: "Stone", num: "05", edition: "092", color: "#D6D0C4" },
  { name: "Cocoa", num: "06", edition: "025", color: "#5A4230" },
  { name: "Midnight", num: "07", edition: "041", color: "#2C2C30" },
  { name: "Sage", num: "08", edition: "051", color: "#93987F" },
  { name: "Terracotta", num: "09", edition: "015", color: "#B15E3E" },
  { name: "Pearl", num: "10", edition: "001", color: "#F3EEE1" },
];

/**
 * A museum-inventory ritual, not a color swatch picker. No product photos
 * exist yet, so each tone is represented abstractly — a single circle of
 * its true color rather than a placeholder stock photo standing in for it.
 */
export function NumberedCollection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <Reveal className="text-center">
        <span className="naturel-display text-[11px] uppercase tracking-[0.35em] text-naturel-ink/45">
          The Collection
        </span>
        <h2 className="naturel-serif mt-3 text-3xl text-naturel-ink sm:text-4xl">
          One hundred of each. Never more.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-naturel-ink/55">
          Ten tones drawn from the coastline — five for summer, five for the quiet season after it.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-5">
        {COLLECTION.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.05} className="flex flex-col items-center text-center">
            <div
              className="naturel-grain h-20 w-20 rounded-full shadow-[0_18px_40px_-16px_rgba(43,38,32,0.35)] sm:h-24 sm:w-24"
              style={{
                background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${item.color} 88%, white 12%), ${item.color} 70%)`,
              }}
            />
            <p className="naturel-display mt-4 text-xs font-medium uppercase tracking-[0.2em] text-naturel-ink">
              {item.name} {item.num}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-naturel-ink/40">Coastal Series</p>
            <p className="mt-1 font-mono text-[11px] text-naturel-gold">{item.edition} / 100</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
