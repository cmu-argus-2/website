import Link from "next/link";
import { finalCta } from "@/content/copy";

export function Finale() {
  return (
    <section data-section="finale" className="relative z-10 flex min-h-svh items-center">
      <div className="mx-auto w-full max-w-6xl px-5 text-center">
        <h2 data-reveal className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          {finalCta.headline}
        </h2>
        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-4">
          {finalCta.buttons.map((btn, i) =>
            btn.href.startsWith("http") ? (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noreferrer"
                className="rounded border hairline px-6 py-3 font-medium text-fg transition-colors hover:border-cyan/50"
              >
                {btn.label}
              </a>
            ) : (
              <Link
                key={btn.label}
                href={btn.href}
                className={
                  i === 0
                    ? "rounded bg-blue px-6 py-3 font-medium text-fg transition-transform hover:scale-[1.03]"
                    : "rounded border hairline px-6 py-3 font-medium text-fg transition-colors hover:border-cyan/50"
                }
              >
                {btn.label}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
