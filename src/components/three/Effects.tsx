"use client";

import { Bloom, EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";

/**
 * Desktop-only cinematic pass. Bloom lets only true highlights glow
 * (threshold ≥ 1 — nothing in the UI palette blooms, just sun glints and the
 * imaging footprint), SMAA supplies antialiasing as a plain shader pass.
 *
 * The composer's MSAA path (`multisampling`) is OFF by default: its
 * renderbuffer resolve intermittently presents near-fully-black frames over
 * the scene (reproduced headlessly: 7/44 stress frames black with MSAA 4,
 * 0/44 without the composer). N8AO is also off by default. A/B knobs:
 * ?msaa=4, ?ao=1, ?postfx=0.
 * `enabled` comes from SceneCanvas so the context AA choice stays in sync.
 */
export function Effects({ enabled, ao, msaa }: { enabled: boolean; ao: boolean; msaa: number }) {
  if (!enabled) return null;
  if (ao) {
    return (
      <EffectComposer multisampling={msaa}>
        <N8AO halfRes quality="performance" intensity={1.1} aoRadius={0.35} distanceFalloff={0.6} />
        <Bloom mipmapBlur intensity={0.3} luminanceThreshold={1.35} luminanceSmoothing={0.4} levels={7} />
        <SMAA />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={msaa}>
      {/* threshold well above 1 + a soft knee: the Earth limb hovers around
          luminance 1.0 while scrolling and would otherwise pop the halo */}
      <Bloom mipmapBlur intensity={0.3} luminanceThreshold={1.35} luminanceSmoothing={0.4} levels={7} />
      <SMAA />
    </EffectComposer>
  );
}
