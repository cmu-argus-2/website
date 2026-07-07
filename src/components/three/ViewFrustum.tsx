"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { calloutBus } from "@/lib/calloutBus";
import { EARTH_RADIUS } from "./Earth";

/**
 * The imaging frustum, rigid to the spacecraft body. Its apex sits on the
 * real payload camera cluster (the anchor_cameras empty baked into the GLB)
 * and it points along the camera boresight — where the satellite looks, the
 * cone looks. It only lights up while the boresight actually intersects the
 * Earth disc, its length is the true ray-sphere distance so the far plane
 * lands on the surface, and a glowing footprint frame marks the imaged area.
 */

// The payload cameras look out of the body's -Z face (inferred from the
// "sees" attitude — the manifest itself says payload axis TBD). Flip this
// constant if the cone ever exits the wrong face.
const BORESIGHT = new THREE.Vector3(0, 0, -1);
const Q_BORESIGHT = new THREE.Quaternion().setFromUnitVectors(
  new THREE.Vector3(0, 0, 1),
  BORESIGHT
);
const HALF_ANGLE = THREE.MathUtils.degToRad(10); // per-side imaging half-angle
const FOOTPRINT_LIFT = 0.3; // above the surface, inside the atmosphere shell
// soft width (in cos space) of the fade at the Earth limb — the cone eases
// in as the boresight crosses onto the disc instead of popping
const LIMB_FEATHER = 0.12;

// frame temps — no per-frame allocation
const apexW = new THREE.Vector3();
const qW = new THREE.Quaternion();
const boresightW = new THREE.Vector3();
const earthW = new THREE.Vector3();
const toEarth = new THREE.Vector3();
const hitP = new THREE.Vector3();
const normalW = new THREE.Vector3();
const tangentX = new THREE.Vector3();
const tangentY = new THREE.Vector3();
const basis = new THREE.Matrix4();

export function ViewFrustum() {
  const root = useRef<THREE.Group>(null);
  const cone = useRef<THREE.Group>(null);
  const footprint = useRef<THREE.Group>(null);
  const faceMat = useRef<THREE.MeshBasicMaterial>(null);
  const edgeMat = useRef<THREE.LineBasicMaterial>(null);
  const frameMat = useRef<THREE.MeshBasicMaterial>(null);
  const fillMat = useRef<THREE.MeshBasicMaterial>(null);

  const { faces, edges, frame, glowColor } = useMemo(() => {
    // unit-length square pyramid: apex at the origin, far quad at z = 1.
    // Scaling the group by the hit distance keeps the geometry exact.
    const s = Math.tan(HALF_ANGLE);
    const f = [
      [-s, -s, 1],
      [s, -s, 1],
      [s, s, 1],
      [-s, s, 1],
    ];
    const verts: number[] = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      verts.push(0, 0, 0, ...f[i], ...f[j]);
    }
    const facesGeo = new THREE.BufferGeometry();
    facesGeo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));

    const edgeVerts: number[] = [];
    for (let i = 0; i < 4; i++) {
      edgeVerts.push(0, 0, 0, ...f[i]);
    }
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      edgeVerts.push(...f[i], ...f[j]);
    }
    const edgesGeo = new THREE.BufferGeometry();
    edgesGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgeVerts, 3));

    // unit square frame (outer half-size 1, inner 0.94) — a mesh, not a
    // LineLoop, so it has real width and can cross the bloom threshold
    const o = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    const inn = o.map(([x, y]) => [x * 0.94, y * 0.94]);
    const frameVerts: number[] = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      frameVerts.push(
        o[i][0], o[i][1], 0, o[j][0], o[j][1], 0, inn[j][0], inn[j][1], 0,
        o[i][0], o[i][1], 0, inn[j][0], inn[j][1], 0, inn[i][0], inn[i][1], 0
      );
    }
    const frameGeo = new THREE.BufferGeometry();
    frameGeo.setAttribute("position", new THREE.Float32BufferAttribute(frameVerts, 3));

    // >1 luminance so the frame blooms on desktop (threshold 1.35)
    const glow = new THREE.Color("#58d7ff").multiplyScalar(2.5);
    return { faces: facesGeo, edges: edgesGeo, frame: frameGeo, glowColor: glow };
  }, []);

  useFrame(() => {
    if (
      !root.current ||
      !cone.current ||
      !footprint.current ||
      !faceMat.current ||
      !edgeMat.current ||
      !frameMat.current ||
      !fillMat.current
    )
      return;

    const k0 = scrollState.frustum;
    const anchor = calloutBus.sceneRoot?.getObjectByName("anchor_cameras");
    if (k0 <= 0.01 || !anchor) {
      root.current.visible = false;
      return;
    }

    anchor.getWorldPosition(apexW);
    anchor.getWorldQuaternion(qW);
    boresightW.copy(BORESIGHT).applyQuaternion(qW);
    earthW.set(...scrollState.earthPos);
    toEarth.copy(earthW).sub(apexW);

    const dist = toEarth.length();
    const tca = toEarth.dot(boresightW); // apex→Earth-center along boresight
    const d2 = dist * dist - tca * tca; // squared miss distance from center
    const r2 = EARTH_RADIUS * EARTH_RADIUS;
    if (tca <= 0 || d2 > r2) {
      // boresight misses the disc — the alignment gate below is already ~0
      // at this boundary, so hiding here never pops
      root.current.visible = false;
      return;
    }

    // fade with boresight-Earth alignment: 0 at the limb, 1 well inside
    const dCos = tca / dist;
    const limbCos = Math.sqrt(Math.max(dist * dist - r2, 0)) / dist;
    const kAlign = THREE.MathUtils.smoothstep(
      dCos,
      limbCos,
      Math.min(limbCos + LIMB_FEATHER, 0.999)
    );
    const k = k0 * kAlign;
    root.current.visible = k > 0.005;
    if (!root.current.visible) return;

    faceMat.current.opacity = k * 0.1;
    edgeMat.current.opacity = k * 0.55;
    frameMat.current.opacity = k * 0.9;
    fillMat.current.opacity = k * 0.05;

    // cone: apex on the cameras, oriented with the body, far plane on the
    // surface (with a subtle reach-the-ground grow as the section completes)
    const t = tca - Math.sqrt(r2 - d2);
    cone.current.position.copy(apexW);
    cone.current.quaternion.copy(qW).multiply(Q_BORESIGHT);
    cone.current.scale.setScalar(t * THREE.MathUtils.lerp(0.75, 1, k0));

    // footprint: tangent to the sphere at the boresight hit point, corners
    // rotationally aligned with the cone's square cross-section
    hitP.copy(apexW).addScaledVector(boresightW, t);
    normalW.copy(hitP).sub(earthW).normalize();
    footprint.current.position.copy(hitP).addScaledVector(normalW, FOOTPRINT_LIFT);
    tangentX.set(1, 0, 0).applyQuaternion(cone.current.quaternion);
    tangentX.addScaledVector(normalW, -tangentX.dot(normalW));
    if (tangentX.lengthSq() < 1e-6) {
      tangentX.set(0, 1, 0).applyQuaternion(cone.current.quaternion);
      tangentX.addScaledVector(normalW, -tangentX.dot(normalW));
    }
    tangentX.normalize();
    tangentY.crossVectors(normalW, tangentX);
    basis.makeBasis(tangentX, tangentY, normalW);
    footprint.current.quaternion.setFromRotationMatrix(basis);
    footprint.current.scale.setScalar(Math.tan(HALF_ANGLE) * t);
  });

  return (
    <group ref={root} visible={false}>
      <group ref={cone}>
        <mesh geometry={faces}>
          <meshBasicMaterial
            ref={faceMat}
            color="#58d7ff"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial ref={edgeMat} color="#58d7ff" transparent opacity={0} />
        </lineSegments>
      </group>
      <group ref={footprint}>
        <mesh geometry={frame}>
          <meshBasicMaterial
            ref={frameMat}
            color={glowColor}
            toneMapped={false}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial
            ref={fillMat}
            color="#58d7ff"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}
