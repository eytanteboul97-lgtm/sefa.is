"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Scissors, Droplet, Sparkles, Gem, Flower2 } from "lucide-react";
import { Reveal } from "@/components/reveal";

const rituals = [
  {
    icon: Scissors,
    title: "Cut & Styling",
    body: "From the first snip to the final blowout, every gesture is considered.",
  },
  {
    icon: Droplet,
    title: "Treatment & Serum",
    body: "Concentrated formulas, applied by expert hands.",
  },
  {
    icon: Gem,
    title: "Manicure & Polish",
    body: "A mirror finish, from shade selection to the final coat.",
  },
  {
    icon: Flower2,
    title: "Spa & Facial ritual",
    body: "Skincare that leaves your complexion breathing again.",
  },
];

function RitualCard({ icon: Icon, title, body }: (typeof rituals)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-40, 40], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="tilt-card group relative rounded-ticket border border-ink/10 bg-white/60 p-7 shadow-glass"
    >
      <motion.div
        style={{ transform: "translateZ(30px)" }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white"
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      <h3 style={{ transform: "translateZ(20px)" }} className="mt-5 font-luxury text-lg italic font-medium">
        {title}
      </h3>
      <p style={{ transform: "translateZ(20px)" }} className="mt-2 text-sm text-ink/55">
        {body}
      </p>
    </motion.div>
  );
}

export function BeautyRituals() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="max-w-lg">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold">
          <Sparkles className="h-3.5 w-3.5" /> Our rituals
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Every treatment, <span className="font-accent-italic">a ritual.</span>
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rituals.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.07}>
            <RitualCard {...r} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
