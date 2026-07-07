"use client";

import { useEffect } from "react";
import { CALLOUTS } from "@/content/subsystems";
import { calloutBus, cacheLabelRects } from "@/lib/calloutBus";

/**
 * Fixed overlay for the exploded view: thin leader lines from projected
 * subsystem anchors to two fixed label columns. The R3F frame loop writes
 * line points and opacities directly (lib/calloutBus) — no React re-renders.
 */
export function CalloutLayer() {
  useEffect(() => {
    cacheLabelRects();
    const onResize = () => cacheLabelRects();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      calloutBus.container = null;
      calloutBus.lines.clear();
      calloutBus.labels.clear();
    };
  }, []);

  const left = CALLOUTS.filter((s) => s.side === "left");
  const right = CALLOUTS.filter((s) => s.side === "right");

  return (
    <div
      ref={(el) => {
        calloutBus.container = el;
      }}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] opacity-0 transition-opacity duration-300"
    >
      <svg className="absolute inset-0 h-full w-full">
        {CALLOUTS.map((s) => (
          <polyline
            key={s.name}
            ref={(el) => {
              if (el) calloutBus.lines.set(s.name, el);
            }}
            fill="none"
            stroke="#58d7ff"
            strokeWidth="1"
            opacity="0"
          />
        ))}
      </svg>

      <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 flex-col gap-5 md:flex lg:left-10">
        {left.map((s) => (
          <Label key={s.name} name={s.name} label={s.label} blurb={s.blurb} align="left" />
        ))}
      </div>
      <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-5 text-right md:flex lg:right-10">
        {right.map((s) => (
          <Label key={s.name} name={s.name} label={s.label} blurb={s.blurb} align="right" />
        ))}
      </div>

      {/* mobile: one scrollable chip row at the bottom instead of leader
          lines — wrapping to multiple rows collides with the section's
          scroll hint on small screens */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-4 flex flex-nowrap gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
        {CALLOUTS.map((s) => (
          <span
            key={s.name}
            ref={(el) => {
              // registered under a ":m" key; the frame loop drives chip opacity
              if (el) calloutBus.labels.set(`${s.name}:m`, el);
            }}
            className="mono-label shrink-0 whitespace-nowrap rounded border hairline px-2 py-1 text-[10px] text-fg opacity-0"
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Label({
  name,
  label,
  blurb,
  align,
}: {
  name: string;
  label: string;
  blurb: string;
  align: "left" | "right";
}) {
  return (
    <div
      ref={(el) => {
        if (el) calloutBus.labels.set(name, el);
      }}
      className={`max-w-[220px] opacity-0 ${align === "right" ? "ml-auto" : ""}`}
    >
      <p className="mono-label text-fg">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{blurb}</p>
    </div>
  );
}
