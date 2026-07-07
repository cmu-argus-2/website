import Image from "next/image";
import { pipeline } from "@/content/copy";
import { withBasePath } from "@/lib/paths";

/**
 * Landmark box top-left positions (% of the square camera frame). Shared by
 * the boxes (stage 1) and the bearing lines (stage 2) so the lines always
 * hit box centers. Chosen to sit inside the region highlight and to fan out
 * at distinct angles from the ARGUS glyph so no two lines overlap.
 */
const BOX_HALF = 2.3; // h-7 (28px) half-size as % of the ~square frame
const LANDMARKS = [
  { top: 28, left: 46 },
  { top: 44, left: 58 },
  { top: 58, left: 30 },
];

/**
 * Section 4 — pinned. The most important educational animation:
 * left, a stylized camera frame; right, the inference pipeline.
 * Elements with the same data-stage value reveal on the same scroll beat
 * (timeline built in useChoreography).
 */
export function PipelineSection() {
  return (
    <section data-section="pipeline" className="relative z-10">
      <div className="flex h-svh flex-col justify-center">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 md:grid-cols-2 md:items-center md:gap-10">
          {/* ——— left: camera frame. On phones the pinned viewport must also
              hold the heading + 5 stages, so the frame shrinks to a small
              centered square; md+ keeps the original half-width layout. ——— */}
          <div className="relative mx-auto aspect-square w-[min(58vw,30svh)] md:mx-0 md:max-h-[70svh] md:w-full">
            {/* camera frame brackets */}
            <CornerBrackets />
            {/* base frame: the raw Earth image is the backdrop the analysis
                overlays draw on top of — always visible, not a staged reveal */}
            <div className="absolute inset-3 overflow-hidden rounded-sm">
              <Image
                src={withBasePath("/textures/earth/blue-marble-2k.jpg")}
                alt="Stylized Earth frame captured from orbit"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="scale-[2.2] object-cover object-[62%_38%] opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
            </div>
            {/* stage 0: region highlight */}
            <div
              data-stage="0"
              className="absolute left-[18%] top-[22%] h-[46%] w-[52%] rounded-sm border border-cyan/70"
            >
              <span className="mono-label absolute -top-6 left-0 text-cyan">region · RCNet</span>
            </div>
            {/* stage 1: landmark boxes */}
            <div data-stage="1" className="absolute inset-0">
              {LANDMARKS.map((lm, i) => (
                <span
                  key={i}
                  className="absolute h-7 w-7 border border-signal/90"
                  style={{ top: `${lm.top}%`, left: `${lm.left}%` }}
                >
                  <span className="mono-label absolute -bottom-5 left-0 text-[10px] text-signal">
                    L{i + 1}
                  </span>
                </span>
              ))}
            </div>
            {/* stage 2: bearing vectors from the spacecraft glyph to each box
                center. Endpoints derive from the same LANDMARKS values so the
                lines always land in the boxes; BOX_HALF is the box's half-size
                as a % of the square container (h-7 = 28px ≈ 4.6%). */}
            <svg data-stage="2" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <circle cx="88" cy="10" r="1.6" fill="#f4f7fb" />
              <text x="80" y="6" fill="#8b93a1" fontSize="3" fontFamily="var(--font-mono)">
                ARGUS
              </text>
              {LANDMARKS.map((lm, i) => (
                <line
                  key={i}
                  x1="88"
                  y1="10"
                  x2={lm.left + BOX_HALF}
                  y2={lm.top + BOX_HALF}
                  stroke="#58d7ff"
                  strokeWidth="0.35"
                  strokeDasharray="1.6 1"
                />
              ))}
            </svg>
            <p className="mono-label absolute -bottom-8 left-3 hidden text-muted md:block">
              {pipeline.caption}
            </p>
          </div>

          {/* ——— right: the pipeline ——— */}
          <div>
            <h2 data-reveal className="text-2xl font-bold md:text-4xl">
              {pipeline.headline}
            </h2>
            <p data-reveal className="mt-2 max-w-md text-sm leading-relaxed text-muted md:mt-4 md:text-base">
              {pipeline.body}
            </p>
            <ol className="mt-4 flex flex-col gap-0 md:mt-10">
              {pipeline.stages.map((stage, i) => (
                <li key={stage.id} data-stage={i} className="relative flex gap-4 pb-3 md:pb-6">
                  {i < pipeline.stages.length - 1 && (
                    <span className="absolute left-[11px] top-7 h-full w-px bg-hairline" />
                  )}
                  <span
                    className={`mono-label mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      i === pipeline.stages.length - 1
                        ? "border-cyan text-cyan"
                        : "hairline text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-fg md:text-base">{stage.label}</p>
                    <p className="mt-0.5 text-xs text-muted md:text-sm">{stage.blurb}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerBrackets() {
  const cls = "absolute h-6 w-6 border-fg/60";
  return (
    <>
      <span className={`${cls} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${cls} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${cls} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${cls} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}
