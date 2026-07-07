"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { getRenderFlags } from "@/lib/postfxTier";
import { Experience } from "./Experience";
import { Effects } from "./Effects";

/** Fixed full-viewport canvas behind the scrolling DOM. */
export function SceneCanvas() {
  // decided once, pre-context: composer multisampling replaces context MSAA
  // on desktop; mobile (no composer) keeps native antialias
  const [flags] = useState(getRenderFlags);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, flags.dprMax]}
        gl={{
          antialias: !flags.postfx,
          alpha: false,
          powerPreference: "high-performance",
          // ACES (R3F default) + a touch of exposure keeps the white
          // soldermask panels bright without clipping
          toneMappingExposure: 1.1,
        }}
        // near 0.3 (closest approach is ~2 units) buys 3× depth precision at
        // the Earth limb — kills the atmosphere-shell shimmer while scrolling
        camera={{ fov: 40, near: 0.3, far: 800, position: [1.6, 0.5, 2.8] }}
      >
        <color attach="background" args={["#03050a"]} />
        <Suspense fallback={null}>
          <Experience />
          <Effects enabled={flags.postfx} ao={flags.ao} msaa={flags.msaa} />
        </Suspense>
      </Canvas>
    </div>
  );
}
