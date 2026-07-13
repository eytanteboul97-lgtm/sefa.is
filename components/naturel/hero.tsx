"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { CapModel, ResponsiveFov, StudioLighting } from "@/components/naturel/procedural-cap";
import { PostFX } from "@/components/naturel/post-fx";

type TimeOfDay = "morning" | "afternoon" | "golden" | "night";

const SKY: Record<TimeOfDay, string> = {
  morning: "linear-gradient(180deg, #F3EFE6 0%, #EAE3D2 55%, #E6DFCF 100%)",
  afternoon: "linear-gradient(180deg, #F8F4EC 0%, #EFE6D2 55%, #E4D6B8 100%)",
  golden: "linear-gradient(180deg, #F7ECD8 0%, #EFD9AE 55%, #E0B888 100%)",
  night: "linear-gradient(180deg, #E9E3D6 0%, #D8CDB8 55%, #C7B99E 100%)",
};

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "golden";
  return "night";
}

export function Hero() {
  const [tod, setTod] = useState<TimeOfDay>("afternoon");

  useEffect(() => {
    setTod(getTimeOfDay());
  }, []);

  return (
    <section
      className="naturel-grain relative flex h-[100svh] min-h-[640px] w-full flex-col items-center justify-end overflow-hidden"
      style={{ background: SKY[tod] }}
    >
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.35, 6.4], fov: 26, near: 0.1, far: 20 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true }}
          shadows="soft"
        >
          <ResponsiveFov baseFov={26} baseAspect={1.7} />
          <StudioLighting />
          <Sparkles count={60} scale={[5, 3, 5]} size={1.6} speed={0.15} opacity={0.35} color="#e9d9b8" />
          <CapModel rotationSpeed={0.08} scale={0.85} />
          <PostFX focusDistance={0.3} bokehScale={1.5} />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 pb-16 text-center sm:pb-20">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="naturel-display text-[11px] font-medium uppercase tracking-[0.35em] text-naturel-ink/50"
        >
          Naturel — Coastal Series
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="naturel-serif mt-5 max-w-2xl text-balance text-4xl font-medium leading-[1.15] text-naturel-ink sm:text-5xl md:text-6xl"
        >
          Every piece tells a story.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="naturel-accent mt-4 text-lg text-naturel-ink/60"
        >
          Crafted slowly. Numbered forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-8 flex flex-col items-center gap-5"
        >
          <span className="naturel-display text-sm tracking-[0.2em] text-naturel-ink/70">€89</span>
          <a
            href="#waiting-list"
            className="group relative inline-flex items-center gap-3 border-b border-naturel-ink/40 pb-1 text-xs font-medium uppercase tracking-[0.3em] text-naturel-ink transition-colors hover:border-naturel-gold hover:text-naturel-gold"
          >
            Join the Waiting List
          </a>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        animate={{ y: [0, 8, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 h-8 w-px -translate-x-1/2 bg-naturel-ink/30"
      />
    </section>
  );
}
