/**
 * The bridge between GSAP ScrollTrigger and the R3F frame loop.
 *
 * ScrollTrigger scrubs tween plain numbers into this mutable singleton;
 * useFrame reads them every frame and applies damped transforms. GSAP never
 * touches three.js objects, and nothing here triggers React re-renders.
 */

export interface ScrollState {
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  fov: number;
  /** Satellite orientation — authored as small eulers, damped to quaternions per frame */
  satEuler: [number, number, number];
  earthPos: [number, number, number];
  /** 0..1 factors driving per-section effects */
  cloud: number;
  arcs: number; // orbit arcs visibility (section 2)
  arcBreak: number; // dash gaps widening ("orbit uncertainty")
  frustum: number; // imaging frustum + ground footprint (section 3)
  orbitLines: number; // GNSS vs estimate lines visibility (section 6)
  converge: number; // estimate → reference convergence (section 6)
  split: number; // twin separation (sections 7, 13)
  deploy: number; // solar wing deployment on real hinge axes (0 stowed → 1 flight)
  explode: number; // exploded view (section 9)
  dim: number; // canvas dimming under DOM-led sections
  warm: number; // final-CTA warm lighting
  idleSpin: number; // multiplier on the satellite idle yaw
}

export const scrollState: ScrollState = {
  cameraPos: [1.6, 0.5, 2.8],
  cameraTarget: [0, 0, 0],
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
  deploy: 0,
  explode: 0,
  dim: 0,
  warm: 0,
  idleSpin: 1,
};
