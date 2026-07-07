"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A hairline progress bar tracking scroll position, rendered under the
 * navbar. Small, functional, and the kind of detail that quietly signals
 * craft — most visitors won't consciously notice it; they'll just feel
 * the page is more "alive" than a static scrollbar would suggest.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gold"
    />
  );
}
