"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

export function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0,
  label,
  dark = false,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 24, stiffness: 60 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest.toFixed(decimals)}${suffix}`;
      }
    });
  }, [spring, decimals, suffix]);

  return (
    <motion.div className="flex flex-col items-center gap-1 sm:items-start">
      <span ref={ref} className={`font-display text-2xl font-semibold tabular-nums sm:text-3xl ${dark ? "text-paper" : "text-ink"}`}>
        0{suffix}
      </span>
      <span className={`text-xs ${dark ? "text-paper/45" : "text-ink/50"}`}>{label}</span>
    </motion.div>
  );
}
