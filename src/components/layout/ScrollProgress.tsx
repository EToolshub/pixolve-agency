"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barra naranja superior que indica el avance de lectura de la página. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="no-print fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-brand-600 via-brand-500 to-brand-300"
    />
  );
}
