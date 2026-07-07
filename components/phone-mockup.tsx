"use client";

import { motion } from "framer-motion";

/**
 * A CSS-3D floating phone showing the Sefa booking app. Built with real
 * transforms (perspective + rotateY/rotateX) rather than a modelled Three.js
 * phone, which would cost far more render budget for a shape that reads
 * fine — and stays perfectly crisp for on-screen UI text — as styled HTML.
 */
export function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -25 }}
      animate={{ opacity: 1, y: 0, rotateY: -14 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      whileHover={{ rotateY: -6, rotateX: 2 }}
      style={{ perspective: 1400 }}
      className="relative mx-auto w-[240px] sm:w-[270px]"
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative rounded-[2.4rem] border-[6px] border-ink/90 bg-ink shadow-glass-lg"
      >
        <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink/90" />

        <div className="glass overflow-hidden rounded-[2rem] p-0">
          <div className="relative aspect-[9/19] w-full overflow-hidden bg-paper">
            <div className="flex items-center justify-between px-5 pt-8">
              <span className="font-luxury text-sm italic text-ink/70">Hello, Noa</span>
              <div className="h-7 w-7 rounded-full bg-gold/25" />
            </div>

            <div className="mt-4 px-5">
              <div className="glass gold-line rounded-2xl p-4 shadow-glass">
                <p className="text-[10px] uppercase tracking-widest text-gold">Next appointment</p>
                <p className="mt-1 font-display text-sm font-semibold text-ink">Balayage & Treatment</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink/50">Today · 3:00 PM</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 px-5">
              {["Maison Glow", "Lumière Beauty", "Skin Atelier"].map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.15, duration: 0.5 }}
                  className="flex items-center justify-between rounded-xl bg-white/50 px-3 py-2.5"
                >
                  <span className="text-[11px] font-medium text-ink/80">{name}</span>
                  <span className="text-[10px] text-gold">★ 4.9</span>
                </motion.div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-ink/10 bg-paper/80 py-3 backdrop-blur">
              {["home", "search", "heart", "user"].map((icon) => (
                <span key={icon} className="h-1.5 w-1.5 rounded-full bg-ink/25" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gold/10 blur-2xl"
      />
    </motion.div>
  );
}
