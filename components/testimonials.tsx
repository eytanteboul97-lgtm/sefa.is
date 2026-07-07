"use client";

import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";

const quotes = [
  {
    text: "We cut no-shows by 35% in the first month. I used to spend an hour a day on the phone — now I don't spend any.",
    name: "Sarah Cohen",
    role: "Hair Studio · Tel Aviv",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format",
  },
  {
    text: "My clients love booking at midnight. I wake up to three new appointments. The deposit ends last-minute cancellations.",
    name: "Maya Levi",
    role: "Nail Studio · Jerusalem",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80&auto=format",
  },
  {
    text: "Setup took ten minutes. I added the link to my Instagram bio and bookings started the same day.",
    name: "Ronit Mizrahi",
    role: "Spa & Wellness · Haifa",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80&auto=format",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <span className="text-xs font-medium uppercase tracking-widest text-gold">Reviews</span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Salons <span className="font-accent-italic">love Sefa</span>
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {quotes.map((q, i) => (
          <Reveal key={q.name} delay={i * 0.08} className="ticket tilt-card flex flex-col justify-between p-6 shadow-glass transition-transform duration-500 hover:-translate-y-2 hover:shadow-glass-lg">
            <p className="font-luxury text-lg italic leading-snug text-ink/85">&ldquo;{q.text}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3 border-t border-dashed border-ink/10 pt-5">
              <Image src={q.image} alt={q.name} width={40} height={40} className="rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium">{q.name}</p>
                <p className="font-mono text-xs text-ink/45">{q.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-16 grid grid-cols-3 gap-8 border-t border-ink/10 pt-10">
        <AnimatedCounter value={48000} suffix="+" label="Appointments booked" />
        <AnimatedCounter value={620} suffix="+" label="Salons joined" />
        <AnimatedCounter value={4.9} decimals={1} suffix="★" label="Average rating" />
      </Reveal>
    </section>
  );
}
