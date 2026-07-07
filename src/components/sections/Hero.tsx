import { hero } from "@/content/copy";

export function Hero() {
  return (
    <section
      data-section="hero"
      className="relative z-10 flex min-h-svh flex-col justify-end"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pb-24">
        <h1 className="max-w-4xl text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.98]">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          {hero.detail}
        </p>
      </div>
    </section>
  );
}
