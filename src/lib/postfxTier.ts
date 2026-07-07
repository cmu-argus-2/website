/**
 * Render tier + runtime A/B flags, decided once before the GL context is
 * created (SceneCanvas needs them for context antialiasing/dpr, Effects for
 * the composer, useChoreography for Lenis).
 *
 * Query-param overrides for live diagnosis of the desktop black-box flicker:
 *   ?postfx=0  — no EffectComposer at all (context MSAA comes back)
 *   ?ao=1      — re-enable N8AO (off by default: its half-res depth-aware
 *                upsampling is the prime suspect for black blocks over the
 *                Earth/satellites on macOS Chrome+Safari; mobile never runs
 *                it and never flickers)
 *   ?dpr=1     — cap canvas pixel ratio at 1
 *   ?smooth=0  — disable Lenis smooth scrolling
 */
export interface RenderFlags {
  postfx: boolean;
  ao: boolean;
  msaa: number;
  dprMax: number;
  smooth: boolean;
}

export function getRenderFlags(): RenderFlags {
  if (typeof window === "undefined") {
    return { postfx: false, ao: false, msaa: 0, dprMax: 1.5, smooth: true };
  }
  const q = new URLSearchParams(window.location.search);
  const desktop =
    window.matchMedia("(pointer: fine)").matches &&
    window.innerWidth >= 1024 &&
    process.env.NEXT_PUBLIC_POSTFX !== "0";
  const postfx = q.get("postfx") === "1" ? true : q.get("postfx") === "0" ? false : desktop;
  const msaaParam = Number(q.get("msaa"));
  return {
    postfx,
    ao: postfx && q.get("ao") === "1",
    msaa: Number.isFinite(msaaParam) && q.get("msaa") !== null ? msaaParam : 0,
    dprMax: q.get("dpr") === "1" ? 1 : 1.5,
    smooth: q.get("smooth") !== "0",
  };
}

/** Kept for existing callers: whether the composer pass runs this session. */
export function getPostfxEnabled(): boolean {
  return getRenderFlags().postfx;
}
