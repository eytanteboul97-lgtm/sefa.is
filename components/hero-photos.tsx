"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A slow-crossfading, slow-zooming sequence of real editorial beauty
 * photography — hair, makeup, facials, nails, barbering — standing in for
 * a filmed cinematic loop. No stock-video source is reliably fetchable
 * from this environment, so this is the honest, working alternative: real
 * photography, real motion (Ken Burns pan/zoom), no fabricated video link
 * that might not load. Swap the `slides` array for real <video> sources
 * once footage is shot (see README).
 */
const slides = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80&auto=format",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80&auto=format",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&q=80&auto=format",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1600&q=80&auto=format",
  "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=1600&q=80&auto=format",
];

export function HeroPhotos() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={slides[index]}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.18 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4 }, scale: { duration: 5.6, ease: "linear" } }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index]}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-ink/72" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
    </div>
  );
}
