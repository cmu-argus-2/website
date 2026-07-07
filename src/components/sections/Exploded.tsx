import { exploded } from "@/content/copy";

/**
 * Section 9 — pinned. The scroll scrubs scrollState.explode 0→1 while the
 * CalloutLayer (fixed overlay, driven from the frame loop) draws the leader
 * lines and labels. This section itself only carries the heading.
 */
export function Exploded() {
  return (
    <section data-section="exploded" className="relative z-10">
      <div className="flex h-svh flex-col justify-between pb-24 pt-16 md:py-16">
        <div className="mx-auto w-full max-w-6xl px-5 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">{exploded.headline}</h2>
        </div>
        {/* extra bottom padding on mobile keeps this clear of the chip row */}
        <p className="mono-label mx-auto animate-pulse text-muted">{exploded.body} ↓</p>
      </div>
    </section>
  );
}
