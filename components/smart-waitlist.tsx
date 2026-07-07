"use client";

import { motion } from "framer-motion";
import { BellRing, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

/**
 * Smart Waitlist — the second unprompted feature suggestion. The single
 * biggest source of lost bookings on any beauty platform isn't a bad
 * design, it's a fully-booked favourite salon and no path back to a "yes".
 * This turns that dead end into a captured, re-engageable lead instead of
 * an abandoned tab.
 */
export function SmartWaitlist() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <div className="grid items-center gap-10 rounded-ticket border border-gold/25 bg-white/50 p-8 shadow-glass sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold">
              <BellRing className="h-3.5 w-3.5" /> Smart Waitlist
            </span>
            <h3 className="mt-3 text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Fully booked isn't a dead end anymore.
            </h3>
            <p className="mt-3 max-w-xl text-ink/60">
              Join the waitlist for any slot and Sefa notifies you the
              moment a cancellation opens it up — often within hours, not
              weeks.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
              {["No booking fee to join", "Notified in real time", "First come, first held"].map((point) => (
                <li key={point} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal" /> {point}
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass-dark w-full max-w-xs rounded-2xl p-5 lg:w-72"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-gold" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="font-mono text-[11px] text-paper/60">Waitlist active</span>
            </div>
            <p className="mt-3 font-display text-sm font-semibold text-paper">Maison Glow · Saturday</p>
            <p className="mt-1 text-xs text-paper/50">You're #2 in line for 11:00–13:00</p>
            <Button size="sm" variant="dark" className="mirror-shine mt-4 w-full">
              Notify me instead
            </Button>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
