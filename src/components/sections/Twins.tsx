import { twins } from "@/content/copy";

export function Twins() {
  return (
    <section data-section="twins" className="relative z-10 min-h-[150svh]">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-5 pb-24">
        <div data-reveal className="max-w-2xl">
          <p className="mono-label text-cyan">The fleet</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">{twins.headline}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{twins.body}</p>
        </div>
      </div>
    </section>
  );
}
