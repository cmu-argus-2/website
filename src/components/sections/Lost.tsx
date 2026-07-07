import { lostInSpace } from "@/content/copy";

export function Lost() {
  return (
    <section data-section="lost" className="relative z-10 min-h-[200svh]">
      <div className="mx-auto flex min-h-svh max-w-6xl items-center px-5">
        <div data-reveal className="max-w-xl rounded-lg bg-bg/80 p-6">
          <p className="mono-label text-muted">The problem</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">Lost in space</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{lostInSpace.problem}</p>
        </div>
      </div>
      <div className="mx-auto flex min-h-svh max-w-6xl items-center justify-end px-5">
        <p
          data-reveal
          className="max-w-xl rounded-lg bg-bg/80 p-6 text-2xl font-medium leading-snug text-fg md:text-3xl"
        >
          {lostInSpace.punchline}
        </p>
      </div>
    </section>
  );
}
