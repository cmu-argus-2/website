"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

const shader = {
  uniforms: {
    uOpacity: { value: 0 },
    uTime: { value: 0 },
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
    uniform float uOpacity;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.0);
      float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
      gl_FragColor = vec4(vec3(0.35, 0.84, 1.0), fresnel * uOpacity * pulse);
    }
  `,
};

/** Translucent "state estimate" shell around the satellite — section 2. */
export function UncertaintyCloud() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!mesh.current || !material.current) return;
    const c = scrollState.cloud;
    mesh.current.visible = c > 0.01;
    material.current.uniforms.uOpacity.value = c * 0.28;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    const s = 1.15 + 0.35 * c;
    mesh.current.scale.setScalar(s);
  });

  return (
    <mesh ref={mesh} visible={false}>
      <icosahedronGeometry args={[1, 3]} />
      <shaderMaterial
        ref={material}
        args={[shader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
