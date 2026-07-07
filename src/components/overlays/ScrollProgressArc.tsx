"use client";

import { useEffect, useRef } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 16;

/** Scroll progress rendered as an orbit arc — bottom-right, desktop only. */
export function ScrollProgressArc() {
  const arc = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = arc.current;
      if (el) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        el.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - p));
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden md:block" aria-hidden>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(244,247,251,0.12)" strokeWidth="1" />
        <circle
          ref={arc}
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="#58d7ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 20 20)"
        />
        <circle cx="20" cy="4" r="1.8" fill="#58d7ff" opacity="0.9" />
      </svg>
    </div>
  );
}
