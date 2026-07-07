"use client";

import { useEffect } from "react";
import { Clone, useGLTF } from "@react-three/drei";
import { withBasePath } from "@/lib/paths";

const MODEL_URL = withBasePath("/models/argus.glb");

/**
 * The real spacecraft: CAD-derived, meshopt-compressed GLB produced by
 * tools/cad-pipeline (18 named explode groups + anchor_* callout empties,
 * hinge-pivoted deployable wings). drei's useGLTF wires the meshopt decoder.
 *
 * <Clone> gives each consumer its own node graph (primary + twin) while
 * sharing geometry and materials on the GPU.
 */
export function SatelliteGLB({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  useEffect(() => onReady?.(), [onReady, scene]);
  return <Clone object={scene} />;
}

useGLTF.preload(MODEL_URL);
