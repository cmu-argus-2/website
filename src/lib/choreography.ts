import type { ScrollState } from "./scrollState";

/**
 * The scroll film, authored as data.
 *
 * Each section names the ScrollState it should reach by the time the viewer
 * finishes scrolling through it. A section's starting state is the previous
 * section's exit state, so the film stays continuous no matter how section
 * heights are tuned. `pin` sections pin the DOM and scrub across extra
 * scroll distance.
 */

export type SectionId =
  | "hero"
  | "lost"
  | "sees"
  | "pipeline"
  | "fusion"
  | "validation"
  | "twins"
  | "secondary"
  | "exploded"
  | "built"
  | "opensource"
  | "updates"
  | "finale";

export interface SectionKeyframe {
  id: SectionId;
  /** Pin the section and scrub over this much extra scroll (e.g. "+=200%") */
  pin?: string;
  exit: Partial<ScrollState>;
}

export const INITIAL: Partial<ScrollState> = {
  // wide enough to hold the full deployed wingspan right of the headline
  cameraPos: [2.0, 0.55, 4.25],
  cameraTarget: [-1.05, 0.05, 0],
  fov: 40,
  satEuler: [0, 0, 0],
  earthPos: [28, -62, -45],
  cloud: 0,
  arcs: 0,
  arcBreak: 0,
  frustum: 0,
  orbitLines: 0,
  converge: 0,
  split: 0,
  // wings are deployed for the whole scroll story; the one-time deployment
  // animation on page load is time-driven in Experience, not scroll-driven
  deploy: 1,
  explode: 0,
  dim: 0,
  warm: 0,
  idleSpin: 1,
};

export const CHOREOGRAPHY: SectionKeyframe[] = [
  {
    // Hero: the wings swing open on their torsion hinges as the page loads
    // (time-driven intro), then the deployed spacecraft holds the composition.
    id: "hero",
    exit: { ...INITIAL },
  },
  {
    // Lost in space: dolly back, Earth recedes, uncertainty grows. The
    // Earth-ward pitch starts here so the slew clearly leads the frustum
    // reveal in "sees" (the cone is rigid to the body).
    id: "lost",
    exit: {
      cameraPos: [3.6, 1.6, 5.6],
      cameraTarget: [0, 0, 0],
      fov: 45,
      satEuler: [-0.35, 0.5, 0.05],
      earthPos: [85, -95, -190],
      cloud: 1,
      arcs: 1,
      arcBreak: 1,
      idleSpin: 0.5,
    },
  },
  {
    // The payload sees Earth: slew toward Earth, frustum + footprint appear.
    id: "sees",
    exit: {
      cameraPos: [2.4, 2.0, 3.6],
      cameraTarget: [0, -0.4, 0],
      fov: 45,
      satEuler: [-0.95, 0.35, 0],
      earthPos: [6, -74, -38],
      cloud: 0,
      arcs: 0,
      arcBreak: 0,
      frustum: 1,
      idleSpin: 0,
    },
  },
  {
    // Image → measurement (pinned, DOM-led): satellite small upper-left, scene dims.
    id: "pipeline",
    pin: "+=200%",
    exit: {
      cameraPos: [4.4, -0.9, 6.2],
      cameraTarget: [1.3, 0.7, 0],
      fov: 45,
      dim: 0.55,
      frustum: 0.35,
    },
  },
  {
    // Sensor fusion: re-center right-of-frame, medium 3/4 shot.
    id: "fusion",
    exit: {
      cameraPos: [2.7, 0.9, 4.4],
      cameraTarget: [-1.3, 0.15, 0],
      fov: 42,
      satEuler: [-0.25, 0.55, 0],
      dim: 0.1,
      frustum: 0,
    },
  },
  {
    // GNSS validation: big pull-back, Earth becomes the centerpiece.
    id: "validation",
    exit: {
      cameraPos: [10, 40, 170],
      cameraTarget: [0, -45, 0],
      fov: 45,
      earthPos: [0, -68, 0],
      orbitLines: 1,
      converge: 1,
      dim: 0,
    },
  },
  {
    // Two spacecraft: return to medium shot, twin separates.
    id: "twins",
    exit: {
      cameraPos: [0.3, 1.0, 4.8],
      cameraTarget: [0, 0.1, 0],
      fov: 42,
      satEuler: [-0.15, 0.4, 0],
      earthPos: [24, -84, -80],
      orbitLines: 0,
      converge: 0,
      split: 1,
    },
  },
  {
    // Secondary missions (DOM cards): dim the scene.
    id: "secondary",
    exit: { dim: 0.85, idleSpin: 0.3 },
  },
  {
    // Exploded view (pinned): recombine, face-on museum shot, open the
    // spacecraft. Wider shot + longer pin than before — the real CAD explodes
    // into 18 staggered assemblies and needs room to breathe.
    id: "exploded",
    pin: "+=350%",
    exit: {
      // target sits above center so the exploded stack reads centered
      // below the section title; z pulled in for a full-frame spacecraft
      cameraPos: [0.5, 0.4, 4.95],
      cameraTarget: [0, 0.3, 0],
      fov: 38,
      satEuler: [0.12, 0.65, 0],
      earthPos: [0, -150, -90],
      split: 0,
      dim: 0,
      explode: 1,
      idleSpin: 0,
    },
  },
  {
    // Built in-house (photo grid): reassemble while the scene fades to near-black.
    id: "built",
    exit: { explode: 0, dim: 0.92 },
  },
  {
    // Open source cards: scene stays dark.
    id: "opensource",
    exit: { dim: 0.95 },
  },
  {
    // Latest updates: scene stays dark.
    id: "updates",
    exit: { dim: 0.95 },
  },
  {
    // Finale: Earth rises, both spacecraft on orbit, warmest light of the page.
    id: "finale",
    exit: {
      cameraPos: [0, 2.2, 9.5],
      cameraTarget: [0, -1.2, 0],
      fov: 40,
      satEuler: [0, 0.3, 0],
      earthPos: [0, -78, -34],
      split: 1,
      dim: 0,
      warm: 1,
      idleSpin: 0.6,
    },
  },
];
