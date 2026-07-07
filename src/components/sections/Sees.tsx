import { payloadSees } from "@/content/copy";

export function Sees() {
  return (
    <section data-section="sees" className="relative z-10 min-h-[200svh]">
      <div className="mx-auto flex min-h-svh max-w-6xl items-center px-5">
        <div data-reveal className="max-w-xl">
          <p className="mono-label text-cyan">The payload</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">{payloadSees.headline}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{payloadSees.body}</p>
        </div>
      </div>
      <div className="mx-auto flex min-h-svh max-w-6xl items-end px-5 pb-32">
        <ul data-reveal className="flex flex-wrap gap-3">
          {payloadSees.microLabels.map((label, i) => (
            <li key={label} className="mono-label flex items-center gap-2 rounded border hairline px-3 py-2 text-fg">
              <span className="text-cyan">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
