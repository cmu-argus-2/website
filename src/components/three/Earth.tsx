"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { withBasePath } from "@/lib/paths";

export const EARTH_RADIUS = 60;

const atmosphereShader = {
  uniforms: {
    uColorA: { value: new THREE.Color("#58d7ff") },
    uColorB: { value: new THREE.Color("#143bff") },
    uIntensity: { value: 0.35 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uIntensity;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      // BackSide shell: rim glow strongest at the limb
      float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 3.5);
      vec3 color = mix(uColorB, uColorA, fresnel);
      gl_FragColor = vec4(color, fresnel * uIntensity);
    }
  `,
};

export function Earth() {
  const group = useRef<THREE.Group>(null);
  const sphere = useRef<THREE.Mesh>(null);

  const textureUrl = useMemo(() => {
    const small = typeof window !== "undefined" && window.innerWidth < 768;
    return withBasePath(`/textures/earth/blue-marble-${small ? "2k" : "4k"}.jpg`);
  }, []);

  const map = useTexture(textureUrl);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  useFrame((_, delta) => {
    if (!group.current || !sphere.current) return;
    group.current.position.set(...scrollState.earthPos);
    sphere.current.rotation.y += delta * 0.008; // barely-perceptible axial rotation
  });

  return (
    <group ref={group}>
      <mesh ref={sphere} rotation={[0, 2.4, 0.1]}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 64]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0} />
      </mesh>
      <mesh scale={1.02}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 48]} />
        <shaderMaterial
          args={[atmosphereShader]}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
