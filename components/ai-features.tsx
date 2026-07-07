"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, BellRing, TrendingUp, Wand2, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/reveal";

const features = [
  {
    icon: Wand2,
    title: "Smart recommendations",
    body: "Sefa learns your preferences and surfaces the salons, treatments and stylists most likely to become your new favourites.",
  },
  {
    icon: Target,
    title: "Intelligent matching",
    body: "Describe what you want in plain language — the AI matches you to the right salon, service and time slot in seconds.",
  },
  {
    icon: ShieldAlert,
    title: "No-show prediction",
    body: "Sefa flags bookings at risk of a no-show before they happen, so salons can act — a reminder, a deposit, a confirmation call.",
  },
  {
    icon: BellRing,
    title: "Reminders that adapt",
    body: "Timing and tone adjust to each client's history — a first-timer gets a gentle nudge, a regular gets a quick confirmation.",
  },
  {
    icon: TrendingUp,
    title: "Business insights",
    body: "Salons see which services, hours and staff drive the most revenue — and where the next opening should go.",
  },
  {
    icon: Sparkles,
    title: "Pricing suggestions",
    body: "Sefa suggests deposit and pricing adjustments based on demand, so chairs stay full without a single spreadsheet.",
  },
];

export function AIFeatures() {
  return (
    <section className="relative overflow-hidden bg-night py-24 text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(183,147,85,0.18), transparent 45%), radial-gradient(circle at 85% 80%, rgba(92,106,116,0.18), transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold-light">
            <Sparkles className="h-3.5 w-3.5" /> Sefa Intelligence
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Beauty, <span className="font-accent-italic">understood by design.</span>
          </h2>
          <p className="mt-4 text-paper/60">
            Every booking teaches Sefa a little more about what you love —
            and helps every salon run a little smarter.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="glass-dark gold-line relative h-full rounded-ticket p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-light">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-paper/55">{f.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
