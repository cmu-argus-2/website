"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

function makeArc(radius: number, tiltX: number, tiltZ: number) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const t = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  geo.rotateX(tiltX);
  geo.rotateZ(tiltZ);
  return geo;
}

/** Dashed orbit arcs that appear, then break apart — the "lost" metaphor of section 2. */
export function LostArcs() {
  const group = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const arcs = [
      { geo: makeArc(2.3, 1.25, 0.2), color: "#58d7ff" },
      { geo: makeArc(2.9, 1.05, -0.5), color: "#8b93a1" },
    ];
    return arcs.map((arc) => {
      const line = new THREE.Line(
        arc.geo,
        new THREE.LineDashedMaterial({
          color: arc.color,
          transparent: true,
          opacity: 0,
          dashSize: 0.35,
          gapSize: 0.12,
        })
      );
      line.computeLineDistances();
      return line;
    });
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const { arcs: vis, arcBreak } = scrollState;
    group.current.visible = vis > 0.01;
    for (const line of lines) {
      const m = line.material as THREE.LineDashedMaterial;
      m.opacity = vis * 0.5;
      m.dashSize = 0.35 - arcBreak * 0.28;
      m.gapSize = 0.12 + arcBreak * 0.9;
    }
  });

  return (
    <group ref={group} visible={false}>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}
