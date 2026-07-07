"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";

const categories = [
  { name: "Hair", count: 84 },
  { name: "Nails", count: 62 },
  { name: "Facials", count: 45 },
  { name: "Spa", count: 37 },
  { name: "Barbershop", count: 51 },
];

export function CategoryGrid() {
  return (
    <section id="salons" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <span className="text-xs font-medium uppercase tracking-widest text-gold">Discover</span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Browse by category
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {categories.map((cat, i) => (
          <Reveal key={cat.name} delay={i * 0.06}>
            <motion.button
              whileHover={{ y: -5 }}
              className="tilt-card flex w-full flex-col items-start gap-8 rounded-ticket border border-ink/10 bg-white/50 p-6 text-left transition-colors hover:border-gold/40 hover:bg-white"
            >
              <span className="font-luxury text-lg italic font-medium">{cat.name}</span>
              <span className="text-xs text-ink/50">{cat.count} salons</span>
            </motion.button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
