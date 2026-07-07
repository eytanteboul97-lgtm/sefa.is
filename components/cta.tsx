"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function CTA() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="signup" className="mx-auto max-w-4xl px-6 py-28 text-center">
      <Reveal>
        <h2 className="text-balance font-luxury text-4xl italic font-medium tracking-tight sm:text-5xl">
          Your next <span className="not-italic font-display font-semibold text-coral">beauty moment.</span>
        </h2>
        <p className="mt-4 text-ink/60">Join Israel's smart beauty booking platform.</p>
      </Reveal>

      <Reveal delay={0.15} className="mt-8 flex justify-center">
        {submitted ? (
          <p className="rounded-full bg-teal/10 px-6 py-3 text-sm text-teal">
            You're in — we'll be in touch within 24 hours.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="glass flex w-full max-w-md items-center gap-2 rounded-full p-1.5 shadow-glass"
          >
            <input
              type="email"
              required
              placeholder="you@salon.com"
              className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-ink/35"
            />
            <Button size="sm" type="submit" className="mirror-shine shrink-0">
              Get 3 months free
            </Button>
          </form>
        )}
      </Reveal>

      <Reveal delay={0.25} className="mt-4 text-xs text-ink/40">
        No credit card · Cancel anytime · Setup in 10 minutes
      </Reveal>
    </section>
  );
}
