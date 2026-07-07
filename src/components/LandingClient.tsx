"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/reducedMotion";
import { useChoreography } from "@/lib/useChoreography";
import { StaticNarrative } from "@/components/static/StaticNarrative";
import { CalloutLayer } from "@/components/overlays/CalloutLayer";
import { ScrollProgressArc } from "@/components/overlays/ScrollProgressArc";

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false }
);

/**
 * The reduced-motion gate. Children (the 13 motion sections) are rendered
 * on the server for SEO; once mounted, users who prefer reduced motion get
 * the designed StaticNarrative instead, and everyone else gets the canvas +
 * scroll choreography layered behind the sections.
 */
export function LandingClient({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  useChoreography(reduced === false);

  if (reduced === true) {
    return <StaticNarrative />;
  }

  return (
    <>
      {reduced === false && <SceneCanvas />}
      {/* dimmer between canvas and content — GSAP drives its opacity */}
      <div
        id="scene-dim"
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-bg opacity-0 will-change-[opacity]"
      />
      <CalloutLayer />
      <ScrollProgressArc />
      <main className="relative">{children}</main>
    </>
  );
}
