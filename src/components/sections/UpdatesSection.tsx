import Image from "next/image";
import Link from "next/link";
import { latestUpdates } from "@/content/copy";
import { UPDATES } from "@/content/updates";
import { withBasePath } from "@/lib/paths";

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function UpdatesSection() {
  return (
    <section data-section="updates" className="relative z-10 min-h-svh">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <div data-reveal className="flex items-end justify-between">
          <div>
            <p className="mono-label text-cyan">Updates</p>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">{latestUpdates.headline}</h2>
          </div>
          <Link href={latestUpdates.cta.href} className="mono-label text-muted hover:text-fg">
            {latestUpdates.cta.label} →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {UPDATES.slice(0, 3).map((u) => (
            <Link
              key={u.slug}
              href={`/updates/#${u.slug}`}
              data-reveal
              className="group overflow-hidden rounded-lg border hairline transition-colors hover:border-cyan/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={withBasePath(`/images/updates/${u.cover}`)}
                  alt={u.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span className="mono-label rounded border border-cyan/40 px-2 py-0.5 text-[10px] text-cyan">
                    {u.category}
                  </span>
                  <time dateTime={u.date} className="mono-label text-[10px] text-muted">
                    {formatDate(u.date)}
                  </time>
                </div>
                <h3 className="mt-3 font-bold leading-snug">{u.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{u.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
