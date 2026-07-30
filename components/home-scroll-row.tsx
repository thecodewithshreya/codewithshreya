"use client";

import { Children, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type HomeScrollRowProps = {
  children: ReactNode;
  className?: string;
};

const easing = [0.22, 1, 0.36, 1] as const;

export function HomeScrollRow({ children, className }: HomeScrollRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const childCount = Children.count(children);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanScroll(maxScroll > 8);
    setAtStart(scroller.scrollLeft <= 4);
    setAtEnd(scroller.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();

    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      scroller.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [childCount, updateScrollState]);

  function scroll(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller || !canScroll) return;

    scroller.scrollBy({
      left: direction * scroller.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className={`section-carousel ${className ?? ""}`}>
      {canScroll && (
        <button
          type="button"
          className="carousel-button carousel-button-left"
          aria-label="Previous cards"
          onClick={() => scroll(-1)}
          disabled={atStart}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <div ref={scrollerRef} className="scroll-card-row">
        {Children.map(children, (child, index) => (
          <motion.div
            key={index}
            className="scroll-card-item h-full"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.62,
              delay: Math.min(index * 0.05, 0.25),
              ease: easing,
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
      {canScroll && (
        <button
          type="button"
          className="carousel-button carousel-button-right"
          aria-label="Next cards"
          onClick={() => scroll(1)}
          disabled={atEnd}
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
