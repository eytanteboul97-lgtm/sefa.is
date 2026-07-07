"use client";

import { Reveal } from "@/components/reveal";
import { TicketCard } from "@/components/ticket-card";

const salons = [
  {
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80&auto=format",
    name: "Maison Glow",
    category: "Hair · Colour · Tel Aviv",
    rating: 4.9,
    reviews: 312,
    status: "Open now",
  },
  {
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format",
    name: "Lumière Beauty",
    category: "Nails · Gel · Jerusalem",
    rating: 4.8,
    reviews: 187,
    status: "2:00 PM",
  },
  {
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&auto=format",
    name: "Skin Atelier",
    category: "Facials · Tel Aviv",
    rating: 4.9,
    reviews: 94,
    status: "3:00 PM",
  },
  {
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80&auto=format",
    name: "The Barber's District",
    category: "Barbershop · Tel Aviv",
    rating: 4.9,
    reviews: 445,
    status: "Open now",
  },
];

export function PopularSalons() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-teal">Discover</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Most loved, <span className="font-accent-italic">near you</span>
          </h2>
        </div>
        <a href="#" className="inline-block py-1 text-sm font-medium text-ink/60 hover:text-ink">
          View all →
        </a>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {salons.map((salon, i) => (
          <Reveal key={salon.name} delay={i * 0.08}>
            <TicketCard {...salon} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-6 text-center text-xs text-ink/45">
        Founding salons — more joining every week across Israel
      </Reveal>
    </section>
  );
}
