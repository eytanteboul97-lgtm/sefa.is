"use client";

import { Reveal } from "@/components/reveal";

const features = [
  {
    n: "01",
    title: "Open what you want, when you want",
    body: "Set your available slots in seconds. Block a day, an hour, or a single service — from your phone, in real time.",
  },
  {
    n: "02",
    title: "Approve before it's confirmed",
    body: "Switch on request mode: every booking becomes a request you approve or redirect. You're never locked in.",
  },
  {
    n: "03",
    title: "Your clients stay yours",
    body: "Sefa never shows your clients to competitors. Your profile is yours — never listed next to the salon down the street.",
  },
  {
    n: "04",
    title: "Per-stylist scheduling",
    body: "Each professional manages their own availability. No one gets booked unless their slot is genuinely open.",
  },
];

export function SalonOwnerFeatures() {
  return (
    <section id="for-salons" className="bg-night py-24 text-paper">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-widest text-gold">For salon owners</span>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Your calendar. <span className="font-accent-italic">Your rules.</span>
            </h2>
            <p className="mt-4 max-w-md text-paper/60">
              You built your salon on your own terms. Sefa keeps you in
              complete control — always.
            </p>
          </Reveal>

          <div className="mt-12 space-y-8">
            {features.map((f, i) => (
              <Reveal key={f.n} delay={i * 0.08} className="flex gap-5">
                <span className="font-mono text-sm text-gold/70">{f.n}</span>
                <div>
                  <h3 className="font-display text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-paper/55">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="glass-dark sticky top-28 rounded-ticket p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-medium">My availability</span>
              <span className="flex items-center gap-1.5 text-xs text-gold-light">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-gold" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Live
              </span>
            </div>

            <p className="mt-1 text-xs text-paper/40">This week</p>

            <div className="mt-5 space-y-2 font-mono text-sm">
              {[
                ["Monday", "09:00 – 18:00"],
                ["Tuesday", "10:00 – 17:00"],
                ["Wednesday", "Closed"],
                ["Thursday", "09:00 – 19:00"],
              ].map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between border-b border-white/5 py-2">
                  <span className="text-paper/70">{day}</span>
                  <span className={hours === "Closed" ? "text-paper/30" : "text-paper/85"}>{hours}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-full bg-white/5 px-4 py-3">
              <span className="text-xs text-paper/70">Request mode</span>
              <span className="text-xs text-paper/40">Bookings require your approval</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
