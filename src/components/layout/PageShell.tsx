import type { ReactNode } from "react";

/** Shared wrapper for the interior (non-landing) pages. */
export function PageShell({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pt-36 pb-24">
      <p className="mono-label text-cyan">{kicker}</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">{title}</h1>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      <div className="mt-16">{children}</div>
    </main>
  );
}
