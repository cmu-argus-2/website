"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

const KEY_COOL = new THREE.Color("#f4f7fb");
const KEY_WARM = new THREE.Color("#ffe4c4");

export function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!key.current) return;
    key.current.color.lerpColors(KEY_COOL, KEY_WARM, scrollState.warm * 0.7);
    key.current.intensity = 1.7 + scrollState.warm * 0.7;
  });

  // intensities assume the StudioEnvironment IBL carries the metal
  // reflections — direct lights only shape, they don't flood
  return (
    <>
      <ambientLight intensity={0.07} />
      <directionalLight ref={key} position={[4, 3, 5]} intensity={1.7} />
      {/* cool rim from the Earth side */}
      <directionalLight position={[2, -4, -3]} intensity={0.55} color="#58d7ff" />
      <directionalLight position={[-5, 1, -2]} intensity={0.25} color="#8b93a1" />
    </>
  );
}
