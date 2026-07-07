"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
};

const easing = [0.22, 1, 0.36, 1] as const;

function offsetFor(direction: RevealProps["direction"]) {
  if (direction === "left") return { x: 28, y: 0 };
  if (direction === "right") return { x: -28, y: 0 };
  if (direction === "none") return { x: 0, y: 0 };
  return { x: 0, y: 28 };
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = offsetFor(direction);

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, ...offset }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerReveal({
  children,
  className,
}: Pick<RevealProps, "children" | "className">) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      {Children.map(children, (child, index) => (
        <motion.div
          className="h-full"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
          whileInView={
            reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
          }
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.62,
            delay: Math.min(index * 0.07, 0.35),
            ease: easing,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
