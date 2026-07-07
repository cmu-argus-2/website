"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp3, damp } from "maath/easing";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

const LAMBDA = 4.5;

// The choreography's cameraPos/cameraTarget/fov are authored for a ~16:9
// desktop frame. Narrower viewports compensate here, in one place: widen the
// fov to keep the authored horizontal field, and swing the whole rig toward
// x = 0 (side-by-side compositions stack vertically on mobile, so off-center
// framing no longer applies). Damping runs on the authored values; the
// compensation is applied after, so it never fights the damper.
const DESIGN_ASPECT = 16 / 9;
const FOV_BLEND = 0.6; // 1 = exact horizontal-field match; <1 tempers tall phones
const MAX_FOV = 68;
const CENTER_FULL = 0.6; // fully recentered at aspect ≤ this
const CENTER_STRENGTH = 0.85;
const DOLLY = 0.25; // pull back on narrow viewports so the subject leaves room for copy
const LIFT = 0.15; // looking lower raises the subject in-frame, clear of bottom-anchored copy

const lookTarget = new THREE.Vector3();

/** Damps the camera toward the scroll-driven targets — believable mass, no scrub jitter. */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const pos = useRef(new THREE.Vector3(...scrollState.cameraPos));
  const target = useRef(new THREE.Vector3(...scrollState.cameraTarget));
  const fov = useRef({ value: scrollState.fov });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    damp3(pos.current, scrollState.cameraPos, LAMBDA, dt);
    damp3(target.current, scrollState.cameraTarget, LAMBDA, dt);
    damp(fov.current, "value", scrollState.fov, LAMBDA, dt);

    const aspect = size.width / size.height;
    let fovApplied = fov.current.value;
    if (aspect < DESIGN_ASPECT) {
      const t = Math.tan(THREE.MathUtils.degToRad(fov.current.value / 2));
      const factor = Math.pow(DESIGN_ASPECT / aspect, FOV_BLEND);
      fovApplied = Math.min(2 * THREE.MathUtils.radToDeg(Math.atan(t * factor)), MAX_FOV);
    }
    const r = THREE.MathUtils.clamp(
      (DESIGN_ASPECT - aspect) / (DESIGN_ASPECT - CENTER_FULL),
      0,
      1
    );
    const cx = 1 - CENTER_STRENGTH * r;

    camera.position.set(pos.current.x * cx, pos.current.y, pos.current.z);
    lookTarget.set(target.current.x * cx, target.current.y - LIFT * r, target.current.z);
    // no pull-back in the exploded view — the stack should fill a phone frame
    const dolly = 1 + DOLLY * r * (1 - scrollState.explode);
    camera.position.sub(lookTarget).multiplyScalar(dolly).add(lookTarget);
    camera.lookAt(lookTarget);
    if (Math.abs(camera.fov - fovApplied) > 1e-3) {
      camera.fov = fovApplied;
      camera.updateProjectionMatrix();
    }
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__argusCam = {
        pos: camera.position.toArray(),
        fov: camera.fov,
        fovAuthored: fov.current.value,
      };
    }
  });

  return null;
}
