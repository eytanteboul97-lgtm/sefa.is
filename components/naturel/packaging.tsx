"use client";

import { Award, FileText, Mail, PackageOpen, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";

const PIECES = [
  { icon: PackageOpen, title: "The Box", body: "Pressed recycled board, tied — never taped." },
  { icon: Tag, title: "The Leather Tag", body: "Stamped with your edition number, nothing else." },
  { icon: FileText, title: "The Certificate", body: "Hand-numbered, matched to your piece for life." },
  { icon: Award, title: "The Seal", body: "A small mark. Proof, not decoration." },
  { icon: Mail, title: "The Note", body: "A short, handwritten thank you. Always real ink." },
];

/**
 * The unboxing gets its own chapter, staged as a small gallery rather than
 * literal photography we don't have — each object gets space to be looked
 * at on its own.
 */
export function Packaging() {
  return (
    <section className="naturel-grain bg-naturel-champagne/40 px-6 py-28">
      <Reveal className="text-center">
        <span className="naturel-display text-[11px] uppercase tracking-[0.35em] text-naturel-ink/45">
          Details Packaging
        </span>
        <h2 className="naturel-serif mt-3 text-3xl text-naturel-ink sm:text-4xl">Before you see the cap.</h2>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 md:grid-cols-5">
        {PIECES.map((piece, i) => (
          <Reveal key={piece.title} delay={i * 0.08} className="flex flex-col items-center text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-naturel-ink/10 bg-naturel-ivory shadow-[0_16px_36px_-18px_rgba(43,38,32,0.4)]"
            >
              <piece.icon className="h-6 w-6 text-naturel-gold" strokeWidth={1.4} />
            </motion.div>
            <p className="naturel-display mt-4 text-xs font-medium uppercase tracking-[0.2em] text-naturel-ink">
              {piece.title}
            </p>
            <p className="mt-2 max-w-[13rem] text-[13px] leading-relaxed text-naturel-ink/55">{piece.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
