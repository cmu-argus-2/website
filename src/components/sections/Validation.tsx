import { validation } from "@/content/copy";

export function Validation() {
  return (
    <section data-section="validation" className="relative z-10 min-h-[200svh]">
      <div className="mx-auto flex min-h-svh max-w-6xl items-start px-5 pt-40">
        <div data-reveal className="max-w-xl">
          <p className="mono-label text-signal">Validation</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">{validation.headline}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{validation.body}</p>
        </div>
      </div>
      <div className="mx-auto flex min-h-svh max-w-6xl items-end justify-between px-5 pb-24">
        <ul data-reveal className="flex flex-col gap-3">
          <li className="flex items-center gap-3">
            <span className="h-px w-10 bg-muted" />
            <span className="mono-label text-muted">{validation.legendReference}</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="h-0.5 w-10 bg-cyan" />
            <span className="mono-label text-cyan">{validation.legendEstimate}</span>
          </li>
        </ul>
        <p data-reveal className="mono-label rounded border border-signal/40 px-3 py-2 text-signal">
          residual ↓ converging
        </p>
      </div>
    </section>
  );
}
