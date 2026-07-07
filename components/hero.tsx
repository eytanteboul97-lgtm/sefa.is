"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/animated-counter";
import { PhoneMockup } from "@/components/phone-mockup";
import { HeroPhotos } from "@/components/hero-photos";

const BeautyScene = dynamic(
  () => import("@/components/beauty-scene").then((m) => m.BeautyScene),
  { ssr: false }
);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 220]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink pb-24 pt-32 text-paper">
      <HeroPhotos />
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <BeautyScene />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div style={{ y, opacity }} variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-light"
          >
            <Sparkles className="h-3.5 w-3.5" /> Israel's digital beauty house
          </motion.span>

          <motion.h1
            variants={item}
            className="text-balance font-luxury text-[13vw] italic font-medium leading-[0.98] tracking-tight sm:text-6xl md:text-7xl"
          >
            Beauty,
            <br />
            <span className="not-italic font-display font-semibold shimmer-text">booked in a breath.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-7 max-w-md text-balance text-lg text-paper/60">
            Sefa brings Israel's finest salons, hairdressers and spas into
            one experience — as refined as the appointments themselves.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="group mirror-shine">
              Discover a salon
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-paper/20 text-paper hover:border-gold/50">
              For salon owners
            </Button>
          </motion.div>

          <motion.div variants={item} className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 sm:gap-16">
            <AnimatedCounter value={48000} suffix="+" label="Appointments" dark />
            <AnimatedCounter value={620} suffix="+" label="Salons" dark />
            <AnimatedCounter value={4.9} decimals={1} suffix="★" label="Average rating" dark />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: phoneY }} className="hidden lg:block">
          <PhoneMockup />
        </motion.div>
      </div>

      <div className="mt-12 flex justify-center lg:hidden">
        <PhoneMockup />
      </div>
    </section>
  );
}
