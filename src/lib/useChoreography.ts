"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { scrollState, type ScrollState } from "./scrollState";
import { CHOREOGRAPHY, INITIAL } from "./choreography";
import { getRenderFlags } from "./postfxTier";

gsap.registerPlugin(ScrollTrigger);

type Vec3Key = "cameraPos" | "cameraTarget" | "satEuler" | "earthPos";
const VEC3_KEYS: Vec3Key[] = ["cameraPos", "cameraTarget", "satEuler", "earthPos"];
const SCALAR_KEYS = [
  "fov",
  "cloud",
  "arcs",
  "arcBreak",
  "frustum",
  "orbitLines",
  "converge",
  "split",
  "deploy",
  "explode",
  "dim",
  "warm",
  "idleSpin",
] as const;

/** Fields that animate while their section is pinned, not on entry. */
const PIN_FIELDS: Record<string, (keyof ScrollState)[]> = {
  exploded: ["explode"],
};

function addStateTweens(
  tl: gsap.core.Timeline,
  exit: Partial<ScrollState>,
  only?: (keyof ScrollState)[],
  exclude?: (keyof ScrollState)[]
) {
  const wants = (k: keyof ScrollState) =>
    exit[k] !== undefined && (!only || only.includes(k)) && (!exclude || !exclude.includes(k));

  for (const key of VEC3_KEYS) {
    if (!wants(key)) continue;
    const [x, y, z] = exit[key] as [number, number, number];
    tl.to(scrollState[key], { 0: x, 1: y, 2: z, ease: "none", duration: 1 }, 0);
  }
  const scalars: Record<string, number> = {};
  for (const key of SCALAR_KEYS) {
    if (wants(key)) scalars[key] = exit[key] as number;
  }
  if (Object.keys(scalars).length > 0) {
    tl.to(scrollState, { ...scalars, ease: "none", duration: 1 }, 0);
  }
  if (exit.dim !== undefined && wants("dim")) {
    tl.to("#scene-dim", { opacity: exit.dim, ease: "none", duration: 1 }, 0);
  }
}

/**
 * Builds the entire scroll film: one scrubbed timeline per section driving
 * scrollState (read by the R3F frame loop), pin timelines for the pipeline
 * and exploded sections, and play/reverse reveals for [data-reveal] copy.
 */
export function useChoreography(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    Object.assign(scrollState, structuredClone(INITIAL));
    gsap.set("#scene-dim", { opacity: 0 });
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__argusState = scrollState;
    }

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    let lenis: Lenis | null = null;
    if (!isTouch && getRenderFlags().smooth) {
      lenis = new Lenis({ lerp: 0.12 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      for (const section of CHOREOGRAPHY) {
        const el = document.querySelector<HTMLElement>(`[data-section="${section.id}"]`);
        if (!el) continue;

        const pinFields = PIN_FIELDS[section.id];

        // Entry tween: previous section's exit → this section's exit,
        // scrubbed while the section's top travels viewport bottom → top.
        // Sections are all ≥100vh, so adjacent ranges never overlap.
        const entry = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
        });
        addStateTweens(entry, section.exit, undefined, pinFields);

        if (section.pin) {
          const pinned = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: section.pin,
              pin: true,
              scrub: true,
              anticipatePin: 1,
            },
          });
          if (pinFields) addStateTweens(pinned, section.exit, pinFields);

          // Staged DOM reveals inside pinned sections. Elements share a beat
          // by sharing the same data-stage value.
          const stages = el.querySelectorAll<HTMLElement>("[data-stage]");
          if (stages.length > 0) {
            const maxStage = Math.max(
              ...Array.from(stages, (s) => Number(s.dataset.stage) || 0)
            );
            const per = 1 / (maxStage + 1);
            stages.forEach((stage) => {
              const i = Number(stage.dataset.stage) || 0;
              pinned.fromTo(
                stage,
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, duration: per * 0.6, ease: "none" },
                i * per
              );
            });
          }
        }
      }

      // Copy reveals: play on enter, reverse when scrolled back above.
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.closest("[data-stage]")) return;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    // rotation changes width (ignoreMobileResize only skips height-only
    // resizes); wait a beat for the viewport to settle before re-measuring
    let orientTimer: ReturnType<typeof setTimeout> | undefined;
    const onOrientation = () => {
      clearTimeout(orientTimer);
      orientTimer = setTimeout(refresh, 250);
    };
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", onOrientation);
      clearTimeout(orientTimer);
      ctx.revert();
      lenis?.destroy();
    };
  }, [enabled]);
}
