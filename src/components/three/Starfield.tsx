"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** Sparse, static starfield — no animation, per the motion principles. */
export function Starfield({ count = 800 }: { count?: number }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const rng = mulberry32(42);
    for (let i = 0; i < count; i++) {
      // random directions on a big sphere shell
      const u = rng() * 2 - 1;
      const phi = rng() * Math.PI * 2;
      const r = 380 + rng() * 120;
      const s = Math.sqrt(1 - u * u);
      positions[i * 3] = s * Math.cos(phi) * r;
      positions[i * 3 + 1] = u * r;
      positions[i * 3 + 2] = s * Math.sin(phi) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={1.4} sizeAttenuation={false} color="#9fb4cc" transparent opacity={0.65} />
    </points>
  );
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
