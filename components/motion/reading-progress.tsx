"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-16 z-40 h-0.5 w-full origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
      style={{ scaleX }}
    />
  );
}
