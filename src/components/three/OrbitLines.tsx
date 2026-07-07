"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

const SEGMENTS = 160;
const ORBIT_RADIUS = 68;

/**
 * Section 6: two orbit traces around Earth — a thin gray GNSS reference and
 * a brighter cyan Argus visual estimate that converges onto it as you scroll.
 * The satellite (at the scene origin) sits on the reference orbit.
 */
export function OrbitLines() {
  const group = useRef<THREE.Group>(null);
  const estGeo = useRef<THREE.BufferGeometry>(null);
  const refMat = useRef<THREE.LineBasicMaterial>(null);
  const estMat = useRef<THREE.LineBasicMaterial>(null);
  const dot = useRef<THREE.Mesh>(null);

  const { refPoints, estBase } = useMemo(() => {
    // plane basis chosen so the orbit passes through the scene origin when
    // Earth sits at (0, -ORBIT_RADIUS, 0)
    const u = new THREE.Vector3(0, 1, 0);
    const v = new THREE.Vector3(Math.sin(0.5), 0, Math.cos(0.5));
    const ref = new Float32Array((SEGMENTS + 1) * 3);
    const est = new Float32Array((SEGMENTS + 1) * 3);
    const p = new THREE.Vector3();
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = (i / SEGMENTS) * Math.PI * 2;
      p.copy(u)
        .multiplyScalar(Math.cos(t) * ORBIT_RADIUS)
        .addScaledVector(v, Math.sin(t) * ORBIT_RADIUS);
      ref.set([p.x, p.y, p.z], i * 3);
      // the "uncertain" estimate: radial wobble + out-of-plane error
      const wobble = 1 + 0.09 * Math.sin(3 * t + 1.2) + 0.05 * Math.sin(7 * t);
      const outOfPlane = 7 * Math.sin(2 * t + 0.6);
      const n = new THREE.Vector3().crossVectors(u, v).normalize();
      const q = p.clone().multiplyScalar(wobble).addScaledVector(n, outOfPlane);
      est.set([q.x, q.y, q.z], i * 3);
    }
    return { refPoints: ref, estBase: est };
  }, []);

  const refGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(refPoints, 3));
    return geo;
  }, [refPoints]);

  const estGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(estBase.slice(), 3));
    return geo;
  }, [estBase]);

  useFrame(() => {
    if (!group.current) return;
    const k = scrollState.orbitLines;
    group.current.visible = k > 0.01;
    if (k <= 0.01) return;

    group.current.position.set(...scrollState.earthPos);
    if (refMat.current) refMat.current.opacity = k * 0.4;
    if (estMat.current) estMat.current.opacity = k * 0.95;

    // lerp the estimate toward the reference as `converge` rises
    const c = scrollState.converge;
    const attr = (estGeo.current ?? estGeometry).getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      const j = i * 3;
      attr.setXYZ(
        i,
        THREE.MathUtils.lerp(estBase[j], refPoints[j], c),
        THREE.MathUtils.lerp(estBase[j + 1], refPoints[j + 1], c),
        THREE.MathUtils.lerp(estBase[j + 2], refPoints[j + 2], c)
      );
    }
    attr.needsUpdate = true;

    // the satellite reads as a bright dot on the orbit at this camera distance;
    // it sits at the world origin = -earthPos relative to this group
    if (dot.current) {
      dot.current.position.set(
        -scrollState.earthPos[0],
        -scrollState.earthPos[1],
        -scrollState.earthPos[2]
      );
      (dot.current.material as THREE.MeshBasicMaterial).opacity = k;
    }
  });

  return (
    <group ref={group} visible={false}>
      <primitive
        object={new THREE.Line(refGeometry, new THREE.LineBasicMaterial({ color: "#8b93a1", transparent: true, opacity: 0 }))}
        ref={(line: THREE.Line | null) => {
          if (line) refMat.current = line.material as THREE.LineBasicMaterial;
        }}
      />
      <primitive
        object={new THREE.Line(estGeometry, new THREE.LineBasicMaterial({ color: "#58d7ff", transparent: true, opacity: 0 }))}
        ref={(line: THREE.Line | null) => {
          if (line) {
            estMat.current = line.material as THREE.LineBasicMaterial;
            estGeo.current = line.geometry as THREE.BufferGeometry;
          }
        }}
      />
      {/* the spacecraft as a bright dot on its orbit */}
      <mesh ref={dot}>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshBasicMaterial color="#f4f7fb" transparent opacity={0} />
      </mesh>
    </group>
  );
}
