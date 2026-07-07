"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Procedural stylized 1U Argus, modeled on the flight-unit studio photo:
 * white PCB body panels, black anodized corner rails, four deployed solar
 * panels with dark cells, tape-measure UHF antennas, camera aperture, gold
 * GNSS patch. Every subsystem group carries the exact node name from the
 * contract in content/subsystems.ts, so the real CAD GLB is a drop-in swap.
 */

const mat = {
  body: new THREE.MeshStandardMaterial({ color: "#dde2ea", roughness: 0.65, metalness: 0.1 }),
  rail: new THREE.MeshStandardMaterial({ color: "#15181d", roughness: 0.35, metalness: 0.7 }),
  cell: new THREE.MeshStandardMaterial({ color: "#0b1020", roughness: 0.25, metalness: 0.6 }),
  panelBack: new THREE.MeshStandardMaterial({ color: "#e8ecf2", roughness: 0.7, metalness: 0.05 }),
  lens: new THREE.MeshStandardMaterial({ color: "#05070c", roughness: 0.15, metalness: 0.4 }),
  gold: new THREE.MeshStandardMaterial({ color: "#c9a227", roughness: 0.35, metalness: 0.85 }),
  tape: new THREE.MeshStandardMaterial({
    color: "#d9c179",
    roughness: 0.4,
    metalness: 0.6,
    side: THREE.DoubleSide,
  }),
  pcb: new THREE.MeshStandardMaterial({ color: "#2a5c3f", roughness: 0.5, metalness: 0.25 }),
  pcbDark: new THREE.MeshStandardMaterial({ color: "#39445c", roughness: 0.45, metalness: 0.4 }),
  heatsink: new THREE.MeshStandardMaterial({ color: "#6a7382", roughness: 0.35, metalness: 0.85 }),
  battery: new THREE.MeshStandardMaterial({ color: "#4a5468", roughness: 0.55, metalness: 0.35 }),
  chip: new THREE.MeshStandardMaterial({ color: "#14171d", roughness: 0.4, metalness: 0.5 }),
};

function DeployedPanel({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  // hinged at the body edge, lying outward with a slight droop like the photo
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group rotation={[0, 0, -0.14]}>
        <mesh material={mat.panelBack} position={[0.48, 0, 0]}>
          <boxGeometry args={[0.94, 0.018, 0.9]} />
        </mesh>
        <mesh material={mat.cell} position={[0.3, 0.012, 0]}>
          <boxGeometry args={[0.38, 0.006, 0.78]} />
        </mesh>
        <mesh material={mat.cell} position={[0.72, 0.012, 0]}>
          <boxGeometry args={[0.34, 0.006, 0.78]} />
        </mesh>
      </group>
    </group>
  );
}

export function SatellitePlaceholder() {
  const rails = useMemo(
    () =>
      [
        [0.47, 0.47],
        [0.47, -0.47],
        [-0.47, 0.47],
        [-0.47, -0.47],
      ] as const,
    []
  );

  return (
    <group name="argus">
      {/* ——— structure: body shell + rails + body-mounted cells ——— */}
      <group name="structure">
        <mesh material={mat.body}>
          <boxGeometry args={[0.94, 0.98, 0.94]} />
        </mesh>
        {rails.map(([x, z]) => (
          <mesh key={`${x}${z}`} material={mat.rail} position={[x, 0, z]}>
            <boxGeometry args={[0.07, 1.04, 0.07]} />
          </mesh>
        ))}
        {/* body-mounted solar cells on ±X / ±Y side faces */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh material={mat.cell} position={[0.17, 0.05, 0.478]}>
                <boxGeometry args={[0.32, 0.72, 0.012]} />
              </mesh>
              <mesh material={mat.cell} position={[-0.21, 0.05, 0.478]}>
                <boxGeometry args={[0.32, 0.72, 0.012]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ——— deployable solar panels, fanned out from the bottom edges ———
           rotateY maps the local +x arm: -π/2 → +z, +π/2 → -z */}
      <group name="solar_panels">
        <DeployedPanel position={[0.48, -0.46, 0]} rotationY={0} />
        <DeployedPanel position={[0, -0.46, 0.48]} rotationY={-Math.PI / 2} />
        <DeployedPanel position={[-0.48, -0.46, 0]} rotationY={Math.PI} />
        <DeployedPanel position={[0, -0.46, -0.48]} rotationY={Math.PI / 2} />
      </group>

      {/* ——— payload cameras on the +Z face ——— */}
      <group name="cameras">
        <mesh material={mat.lens} position={[0.16, 0.16, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.09, 24]} />
        </mesh>
        <mesh material={mat.rail} position={[0.16, 0.16, 0.475]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.03, 24]} />
        </mesh>
      </group>

      {/* ——— internal stack (revealed by the exploded view) ——— */}
      <group name="jetson_orin_nano" position={[0, 0.16, 0]}>
        <mesh material={mat.heatsink}>
          <boxGeometry args={[0.56, 0.1, 0.56]} />
        </mesh>
        {[-0.2, -0.1, 0, 0.1, 0.2].map((x) => (
          <mesh key={x} material={mat.heatsink} position={[x, 0.07, 0]}>
            <boxGeometry args={[0.025, 0.05, 0.5]} />
          </mesh>
        ))}
      </group>

      <group name="obc_rp2350" position={[0, 0.34, 0]}>
        <mesh material={mat.pcb}>
          <boxGeometry args={[0.62, 0.022, 0.62]} />
        </mesh>
        <mesh material={mat.chip} position={[0.05, 0.02, 0.05]}>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
        </mesh>
      </group>

      <group name="imu" position={[0.22, 0.37, -0.18]}>
        <mesh material={mat.chip}>
          <boxGeometry args={[0.09, 0.04, 0.09]} />
        </mesh>
      </group>

      <group name="gnss_receiver" position={[0.16, 0.51, -0.16]}>
        <mesh material={mat.gold}>
          <boxGeometry args={[0.22, 0.045, 0.22]} />
        </mesh>
      </group>

      <group name="radio" position={[0, -0.06, 0]}>
        <mesh material={mat.pcbDark}>
          <boxGeometry args={[0.62, 0.022, 0.62]} />
        </mesh>
        <mesh material={mat.chip} position={[-0.12, 0.02, 0.1]}>
          <boxGeometry args={[0.18, 0.025, 0.12]} />
        </mesh>
      </group>

      <group name="eps" position={[0, -0.22, 0]}>
        <mesh material={mat.pcb}>
          <boxGeometry args={[0.62, 0.022, 0.62]} />
        </mesh>
      </group>

      <group name="battery" position={[0, -0.38, 0]}>
        <mesh material={mat.battery}>
          <boxGeometry args={[0.5, 0.17, 0.36]} />
        </mesh>
      </group>

      {/* ——— tape-measure UHF antennas, angled up like the photo ——— */}
      <group name="antennas" position={[0, 0.52, 0]}>
        <group position={[0.1, 0, 0.08]} rotation={[0.12, 0, -0.32]}>
          <mesh material={mat.tape} position={[0, 0.45, 0]}>
            <boxGeometry args={[0.022, 0.9, 0.004]} />
          </mesh>
        </group>
        <group position={[-0.14, 0, -0.05]} rotation={[-0.1, 0, 0.45]}>
          <mesh material={mat.tape} position={[0, 0.4, 0]}>
            <boxGeometry args={[0.022, 0.8, 0.004]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
