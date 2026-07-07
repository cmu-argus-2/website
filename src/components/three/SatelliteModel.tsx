"use client";

import { forwardRef, Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SatellitePlaceholder } from "./SatellitePlaceholder";
import { SatelliteGLB } from "./SatelliteGLB";
import { EXPLODE_GROUPS, HINGES } from "@/content/subsystems";

/** The CAD-derived GLB is the default; set NEXT_PUBLIC_USE_GLB=0 to fall back. */
const USE_GLB = process.env.NEXT_PUBLIC_USE_GLB !== "0";

/**
 * The single consumer-facing satellite component. Renders the real CAD model
 * (public/models/argus.glb, see tools/cad-pipeline) with the procedural
 * placeholder as its loading fallback.
 */
export const SatelliteModel = forwardRef<THREE.Group, { explodable?: boolean }>(
  function SatelliteModel({ explodable = false }, ref) {
    const inner = useRef<THREE.Group>(null);
    const [ready, setReady] = useState(0);
    const onReady = useCallback(() => setReady((n) => n + 1), []);

    // Record rest positions for the exploded view. The GLB arrives async, so
    // this re-runs when it mounts (`ready` bump) — caching on first mount
    // only would capture the placeholder and never the real model.
    useEffect(() => {
      const root = inner.current;
      if (!root || !explodable) return;
      const missing: string[] = [];
      for (const def of EXPLODE_GROUPS) {
        const node = root.getObjectByName(def.name);
        if (!node) {
          missing.push(def.name);
          continue;
        }
        node.userData.restPosition = node.position.clone();
      }
      if (missing.length && USE_GLB && ready > 0) {
        console.warn(`[argus] model is missing explode group(s): ${missing.join(", ")}`);
      }
    }, [explodable, ready]);

    return (
      <group ref={ref}>
        <group ref={inner} name="satellite-root">
          {USE_GLB ? (
            <Suspense fallback={<SatellitePlaceholder />}>
              <SatelliteGLB onReady={onReady} />
            </Suspense>
          ) : (
            <SatellitePlaceholder />
          )}
        </group>
      </group>
    );
  }
);

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Applies rest + offset * eased(stagger window) to each explode group. */
export function applyExplode(root: THREE.Object3D, explode: number) {
  for (const def of EXPLODE_GROUPS) {
    const node = root.getObjectByName(def.name);
    const rest = node?.userData.restPosition as THREE.Vector3 | undefined;
    if (!node || !rest) continue;
    const [a, b] = def.stagger;
    const t = THREE.MathUtils.clamp((explode - a) / (b - a), 0, 1);
    const k = easeInOutCubic(t);
    node.position.set(
      rest.x + def.offset[0] * k,
      rest.y + def.offset[1] * k,
      rest.z + def.offset[2] * k
    );
  }
}

// ——— deploy rig ————————————————————————————————————————————————————————
// Wing group pivots sit on the real V4-hinge axes (baked by the pipeline);
// axis sign is oriented so +angle folds the wing toward stowed. deploy: 0 =
// stowed against the body, 1 = flight configuration as modeled in the CAD.

const DEPLOY_ORDER = ["deployable_px", "deployable_pz", "deployable_nx", "deployable_nz"];
const axisTmp = new THREE.Vector3();

/** easeOutBack — a touch of torsion-spring overshoot as each wing latches. */
const backOut = (t: number) => {
  const c1 = 1.2;
  return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export function applyDeploy(root: THREE.Object3D, deploy: number) {
  for (let i = 0; i < DEPLOY_ORDER.length; i++) {
    const name = DEPLOY_ORDER[i];
    const hinge = HINGES[name];
    if (!hinge) continue;
    const node = root.getObjectByName(name);
    if (!node) continue;
    const a = 0.08 * i;
    const b = 0.58 + 0.11 * i;
    const t = THREE.MathUtils.clamp((deploy - a) / (b - a), 0, 1);
    const angle = (1 - backOut(t)) * THREE.MathUtils.degToRad(hinge.stowedDeg);
    axisTmp.set(hinge.axis[0], hinge.axis[1], hinge.axis[2]).normalize();
    node.quaternion.setFromAxisAngle(axisTmp, angle);
  }
}
