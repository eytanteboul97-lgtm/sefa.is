"use client";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const perks = [
  { title: "3 months free", body: "Full access from day one. No credit card, no commitment." },
  { title: "Founder rate, locked forever", body: "Your price never rises, whatever public pricing becomes." },
  { title: "Founding Salon badge", body: "A visible badge on your profile, priority in Sefa's search." },
  { title: "Early access to everything new", body: "Waitlists, smart recommendations, loyalty — you get it all first." },
  { title: "Shape Sefa with us", body: "Direct access to the founding team. Your feedback shapes the roadmap." },
  { title: "Priority onboarding", body: "A dedicated setup call. Your profile is ready within 24 hours." },
];

export function FoundingProgram() {
  return (
    <section className="relative overflow-hidden bg-teal py-24 text-paper">
      <div className="band-divider absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-xl">
          <span className="text-xs font-medium uppercase tracking-widest text-paper/70">Founding Partner Program</span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Join the salons <span className="font-accent-italic">building it with us.</span>
          </h2>
          <p className="mt-4 text-paper/75">
            We're inviting a select group of founding partners to shape
            beauty booking in Israel.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="glass-dark gold-line rounded-ticket p-6">
              <h3 className="font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-paper/65">{p.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-12">
          <Button size="lg" variant="dark" className="mirror-shine">
            Apply to the Founding Program →
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
