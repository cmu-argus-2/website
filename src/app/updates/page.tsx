import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { UPDATES } from "@/content/updates";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = { title: "Updates", alternates: { canonical: "/updates/" } };

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function UpdatesPage() {
  return (
    <PageShell
      kicker="Updates"
      title="Mission log"
      intro="The build, test, integration, and flight history of Argus-1 and Argus-2 — from lab bench to low Earth orbit."
    >
      <div className="flex flex-col gap-20">
        {UPDATES.map((u) => (
          <article key={u.slug} id={u.slug} className="border-t hairline pt-10">
            <div className="flex flex-wrap items-center gap-4">
              <span className="mono-label rounded border border-cyan/40 px-2.5 py-1 text-cyan">
                {u.category}
              </span>
              <time dateTime={u.date} className="mono-label text-muted">
                {formatDate(u.date)}
              </time>
            </div>
            <h2 className="mt-4 text-2xl font-bold md:text-3xl">{u.title}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{u.summary}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {u.photos.map((p) => (
                <Image
                  key={p}
                  src={withBasePath(`/images/updates/${p}`)}
                  alt={u.title}
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg border hairline object-cover"
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
