"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { CapModel, ResponsiveFov, StudioLighting } from "@/components/naturel/procedural-cap";
import { PostFX } from "@/components/naturel/post-fx";

const PARTS = [
  {
    range: [0.06, 0.24] as [number, number],
    index: "01",
    title: "Cotton Canvas",
    body: "A dense, brushed cotton that softens with every wear. It never looks new twice — that's the point.",
  },
  {
    range: [0.24, 0.42] as [number, number],
    index: "02",
    title: "Leather Patch",
    body: "Vegetable-tanned, hand-pressed. It darkens in the sun and lightens with salt air, recording the seasons it has seen.",
  },
  {
    range: [0.42, 0.6] as [number, number],
    index: "03",
    title: "Brushed Buckle",
    body: "Brushed steel, never polished to a mirror. It is meant to be touched, not admired from a distance.",
  },
  {
    range: [0.6, 0.78] as [number, number],
    index: "04",
    title: "Inner Lining",
    body: "Breathable, unlined by design in the warm months — closer to skin than to fabric.",
  },
  {
    range: [0.78, 0.94] as [number, number],
    index: "05",
    title: "Hand Stitching",
    body: "Every seam is walked by hand, not by machine. The irregularities are the signature.",
  },
];

function PartCaption({
  progress,
  range,
  index,
  title,
  body,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  index: string;
  title: string;
  body: string;
}) {
  const mid = (range[0] + range[1]) / 2;
  const span = range[1] - range[0];
  const opacity = useTransform(
    progress,
    [range[0] - span * 0.3, range[0], range[1], range[1] + span * 0.3],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [range[0], mid, range[1]], [16, 0, -16]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
      <span className="naturel-display text-xs tracking-[0.3em] text-naturel-gold">{index} / 05</span>
      <h3 className="naturel-serif mt-3 text-3xl text-naturel-ink sm:text-4xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-naturel-ink/60">{body}</p>
    </motion.div>
  );
}

export function Disassembly() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothed = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const explode = useTransform(smoothed, [0.05, 0.9], [0, 1]);

  return (
    <section ref={sectionRef} className="relative h-[420vh] bg-naturel-ivory">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="mx-auto max-w-lg px-6 pt-16 text-center">
          <span className="naturel-display text-[11px] uppercase tracking-[0.35em] text-naturel-ink/45">
            Exhibition
          </span>
          <h2 className="naturel-serif mt-3 text-2xl text-naturel-ink sm:text-3xl">
            Every component, considered.
          </h2>
        </div>

        <div className="relative flex-1">
          <ExplodedCanvas explode={explode} />
          {PARTS.map((p) => (
            <PartCaption key={p.index} progress={smoothed} range={p.range} index={p.index} title={p.title} body={p.body} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExplodedCanvas({ explode }: { explode: MotionValue<number> }) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0.3, 6.8], fov: 26, near: 0.1, far: 20 }} dpr={[1, 1.75]} shadows="soft">
        <ResponsiveFov baseFov={26} baseAspect={1.7} />
        <StudioLighting />
        <ExplodedCap explode={explode} />
        <PostFX focusDistance={0.32} bokehScale={1.4} />
      </Canvas>
    </div>
  );
}

function ExplodedCap({ explode }: { explode: MotionValue<number> }) {
  const [value, setValue] = useState(0);
  useEffect(() => explode.on("change", setValue), [explode]);
  return <CapModel explode={value} autoRotate rotationSpeed={0.08} scale={0.85} />;
}
