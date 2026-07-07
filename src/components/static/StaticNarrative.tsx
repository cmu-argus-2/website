import Image from "next/image";
import Link from "next/link";
import {
  hero,
  lostInSpace,
  payloadSees,
  pipeline,
  fusion,
  validation,
  twins,
} from "@/content/copy";
import { Secondary } from "@/components/sections/Secondary";
import { Built } from "@/components/sections/Built";
import { OpenSourceSection } from "@/components/sections/OpenSourceSection";
import { UpdatesSection } from "@/components/sections/UpdatesSection";
import { Finale } from "@/components/sections/Finale";
import { CALLOUTS } from "@/content/subsystems";
import { withBasePath } from "@/lib/paths";

/**
 * The prefers-reduced-motion version of the landing page: the same mission
 * story as a designed static narrative — real photography instead of the
 * 3D film, no WebGL, no scroll-driven animation.
 */
export function StaticNarrative() {
  return (
    <main className="relative bg-bg">
      {/* hero — the real spacecraft */}
      <section className="relative flex min-h-screen flex-col justify-end">
        <Image
          src={withBasePath("/images/argus-studio.webp")}
          alt="Argus flight unit, deployed configuration"
          fill
          priority
          className="object-cover object-center opacity-70"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16">
          <p className="mono-label text-cyan">Argus · CMU × IST · Transporter-17</p>
          <h1 className="mt-5 max-w-4xl text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.98]">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{hero.detail}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={hero.ctaPrimary.href} className="rounded bg-blue px-6 py-3 font-medium text-fg">
              {hero.ctaPrimary.label}
            </Link>
            <Link href={hero.ctaSecondary.href} className="rounded border hairline px-6 py-3 font-medium text-fg">
              {hero.ctaSecondary.label}
            </Link>
          </div>
          <ul className="mt-12 flex flex-wrap gap-3 border-t hairline pt-6">
            {hero.chips.map((chip) => (
              <li key={chip} className="mono-label rounded border hairline px-3 py-1.5 text-muted">
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* the story, stacked */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="mono-label text-muted">The problem</p>
            <h2 className="mt-4 text-3xl font-bold">Lost in space</h2>
            <p className="mt-5 leading-relaxed text-muted">{lostInSpace.problem}</p>
            <p className="mt-5 text-xl font-medium text-fg">{lostInSpace.punchline}</p>
          </div>
          <div>
            <p className="mono-label text-cyan">The payload</p>
            <h2 className="mt-4 text-3xl font-bold">{payloadSees.headline}</h2>
            <p className="mt-5 leading-relaxed text-muted">{payloadSees.body}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {payloadSees.microLabels.map((label) => (
                <li key={label} className="mono-label rounded border hairline px-3 py-2">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 border-t hairline pt-16">
          <h2 className="text-3xl font-bold">{pipeline.headline}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{pipeline.body}</p>
          <ol className="mt-8 flex flex-wrap items-center gap-3">
            {pipeline.stages.map((stage, i) => (
              <li key={stage.id} className="flex items-center gap-3">
                <span className="mono-label rounded border hairline px-3 py-2">{stage.label}</span>
                {i < pipeline.stages.length - 1 && <span className="text-cyan">→</span>}
              </li>
            ))}
          </ol>
          <p className="mono-label mt-4 text-muted">{pipeline.caption}</p>
        </div>

        <div className="mt-24 grid gap-16 border-t hairline pt-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">{fusion.headline}</h2>
            <p className="mt-4 leading-relaxed text-muted">{fusion.body}</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{validation.headline}</h2>
            <p className="mt-4 leading-relaxed text-muted">{validation.body}</p>
          </div>
        </div>

        <div className="mt-24 border-t hairline pt-16">
          <h2 className="text-3xl font-bold">{twins.headline}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{twins.body}</p>
        </div>

        {/* exploded view stands in as the annotated bench photo */}
        <div className="mt-24 border-t hairline pt-16">
          <h2 className="text-3xl font-bold">Inside Argus</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
            <Image
              src={withBasePath("/images/updates/vibe-test-opened-on-bench.webp")}
              alt="Argus opened on the bench, subsystems visible"
              width={1280}
              height={960}
              className="rounded-lg border hairline"
            />
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CALLOUTS.map((s) => (
                <div key={s.name}>
                  <dt className="mono-label text-fg">{s.label}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted">{s.blurb}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Secondary />
      <Built />
      <OpenSourceSection />
      <UpdatesSection />
      <Finale />
    </main>
  );
}
