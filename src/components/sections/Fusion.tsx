import { fusion } from "@/content/copy";

/**
 * Section 5 — the estimator. The satellite sits center-frame behind this
 * copy-only overlay; the 3D scene carries the visual.
 */
export function Fusion() {
  return (
    <section data-section="fusion" className="relative z-10 min-h-[150svh]">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5">
        <div data-reveal className="max-w-xl">
          <p className="mono-label text-cyan">Sensor fusion</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">{fusion.headline}</h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{fusion.body}</p>
        </div>
      </div>
    </section>
  );
}
