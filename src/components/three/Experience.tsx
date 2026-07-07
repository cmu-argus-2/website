"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { damp, dampQ } from "maath/easing";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { calloutBus } from "@/lib/calloutBus";
import { CALLOUTS } from "@/content/subsystems";
import { CameraRig } from "./CameraRig";
import { Lights } from "./Lights";
import { Starfield } from "./Starfield";
import { Earth } from "./Earth";
import { SatelliteModel, applyExplode, applyDeploy } from "./SatelliteModel";
import { UncertaintyCloud } from "./UncertaintyCloud";
import { LostArcs } from "./LostArcs";
import { ViewFrustum } from "./ViewFrustum";
import { OrbitLines } from "./OrbitLines";

// attitude settles faster than the camera (4.5s in CameraRig): the slew
// toward Earth must clearly lead the frustum reveal in the "sees" section
const SAT_SMOOTH = 1.8;
const TWO_PI = Math.PI * 2;
// idle yaw accumulates wall-clock time, so without a reset the pose at any
// scroll position depends on how long the page has been open. When the
// choreography stops the spin (idleSpin → 0 in sees/exploded), home the yaw
// to the nearest full turn so those sections always see the canonical pose.
const IDLE_EPS = 0.05;
const YAW_HOME_SMOOTH = 0.8; // seconds — settles within one section entry

export function Experience() {
  const size = useThree((s) => s.size);

  const primary = useRef<THREE.Group>(null); // choreographed orientation
  const primaryIdle = useRef<THREE.Group>(null); // idle yaw on top
  const twin = useRef<THREE.Group>(null);
  // one-time deployment intro: clock starts once the GLB wings are in the
  // graph; negative start = a beat of "stowed" before the first wing releases
  const deployClock = useRef(-0.9);

  const tmp = useMemo(
    () => ({
      euler: new THREE.Euler(),
      quat: new THREE.Quaternion(),
      world: new THREE.Vector3(),
      idleYaw: 0,
    }),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const s = scrollState;

    // — satellite orientation: damped toward the choreographed euler target
    if (primary.current) {
      tmp.euler.set(s.satEuler[0], s.satEuler[1], s.satEuler[2]);
      tmp.quat.setFromEuler(tmp.euler);
      dampQ(primary.current.quaternion, tmp.quat, SAT_SMOOTH, dt);
      // twins split along X with slight depth/height offset
      primary.current.position.set(-1.9 * s.split, -0.25 * s.split, 0.5 * s.split);
    }
    if (primaryIdle.current) {
      if (s.idleSpin > IDLE_EPS) {
        tmp.idleYaw += delta * 0.06 * s.idleSpin;
      } else {
        const home = Math.round(tmp.idleYaw / TWO_PI) * TWO_PI; // ≤ π correction
        damp(tmp, "idleYaw", home, YAW_HOME_SMOOTH, dt);
      }
      primaryIdle.current.rotation.y = tmp.idleYaw;
      applyExplode(primaryIdle.current, s.explode);
      if (primaryIdle.current.getObjectByName("deployable_px")) {
        deployClock.current += dt;
        const intro = THREE.MathUtils.clamp(deployClock.current / 2.6, 0, 1);
        applyDeploy(primaryIdle.current, Math.min(intro, s.deploy));
      }
    }
    if (twin.current) {
      twin.current.visible = s.split > 0.01;
      // clearly apart, the twin on a farther arc (depth does the size change)
      twin.current.position.set(2.3 * s.split, 0.5 * s.split, -2.6 * s.split);
      const twinScale = 1 - 0.08 * s.split;
      twin.current.scale.setScalar(twinScale);
      twin.current.quaternion.copy(primary.current!.quaternion);
      twin.current.rotation.y += tmp.idleYaw + 0.5 * s.split; // same idle phase — clearly twins
    }

    // — project subsystem anchors for the exploded-view callout layer
    projectCallouts(state.camera, size, tmp.world);
  });

  return (
    <>
      <CameraRig />
      <Lights />
      <StudioEnvironment />
      <Starfield />
      <Earth />

      <group ref={primary}>
        <group
          ref={(g) => {
            primaryIdle.current = g;
            calloutBus.sceneRoot = g;
          }}
          name="primary-root"
        >
          <SatelliteModelInner />
        </group>
        <UncertaintyCloud />
        <LostArcs />
      </group>

      <group ref={twin} visible={false}>
        <SatelliteModel />
      </group>

      {/* world-space: rigid to the body via the camera anchor, but its
          footprint lives on the Earth sphere */}
      <ViewFrustum />
      <OrbitLines />
    </>
  );
}

/** primary satellite with the explode contract active */
function SatelliteModelInner() {
  return <SatelliteModel explodable />;
}

/**
 * Procedural studio environment (no HDR download): a large soft key, a cool
 * fill and a cyan Earth-side kicker. This is what makes the satin aluminum,
 * fasteners and solar-cell glass of the real CAD materials read as metal.
 */
function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.2} position={[4, 4, 5]} rotation-y={0.6} scale={[7, 4, 1]} color="#f4f7fb" />
      <Lightformer intensity={0.7} position={[-6, 2, -4]} rotation-y={-1.2} scale={[6, 3, 1]} color="#8b93a1" />
      <Lightformer intensity={0.9} position={[1, -5, -2]} rotation-x={1.4} scale={[9, 4, 1]} color="#2a6b8f" />
      <Lightformer intensity={0.5} position={[0, 1, -7]} scale={[10, 6, 1]} color="#0c1522" />
    </Environment>
  );
}

const anchorPos = new THREE.Vector3();

function projectCallouts(
  camera: THREE.Camera,
  size: { width: number; height: number },
  world: THREE.Vector3
) {
  const container = calloutBus.container;
  if (!container) return;
  const explode = scrollState.explode;
  if (explode < 0.02) {
    if (container.style.opacity !== "0") {
      container.style.opacity = "0";
      // hidden also kills pointer events — the mobile chip row is
      // pointer-events-auto (swipeable) and must not block touches
      // on the rest of the page while invisible
      container.style.visibility = "hidden";
    }
    return;
  }
  container.style.opacity = "1";
  container.style.visibility = "visible";

  const root = calloutBus.sceneRoot;
  if (!root) return;

  for (const def of CALLOUTS) {
    const line = calloutBus.lines.get(def.name);
    const label = calloutBus.labels.get(def.name);
    if (!line || !label) continue;

    const [a, b] = def.stagger;
    const local = THREE.MathUtils.clamp((explode - a) / Math.max(b - a, 0.001), 0, 1);
    const opacity = THREE.MathUtils.clamp((local - 0.7) / 0.3, 0, 1);
    label.style.opacity = String(opacity);
    line.style.opacity = String(opacity * 0.7);
    const mobileChip = calloutBus.labels.get(`${def.name}:m`);
    if (mobileChip) mobileChip.style.opacity = String(opacity);
    if (opacity <= 0.01) continue;

    // labels track anchor empties baked at the real component positions
    const node = root.getObjectByName(def.anchor);
    if (!node) continue;
    node.getWorldPosition(world);
    anchorPos.copy(world).project(camera);
    const x = ((anchorPos.x + 1) / 2) * size.width;
    const y = ((1 - anchorPos.y) / 2) * size.height;

    const rect = calloutBus.labelRects.get(def.name);
    if (!rect || rect.width === 0) {
      // hidden label (mobile layout) — no leader line
      line.style.opacity = "0";
      continue;
    }
    const lx = def.side === "left" ? rect.right + 8 : rect.left - 8;
    const ly = rect.top + rect.height / 2;
    const elbowX = def.side === "left" ? lx + (x - lx) * 0.35 : lx + (x - lx) * 0.35;
    line.setAttribute("points", `${x},${y} ${elbowX},${ly} ${lx},${ly}`);
  }
}
