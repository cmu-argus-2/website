import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { REPOS } from "@/content/repos";

export const metadata: Metadata = { title: "Open Source" };

const statusColor: Record<string, string> = {
  Public: "border-signal/50 text-signal",
  "Coming soon": "border-amber/50 text-amber",
  "In review": "border-cyan/50 text-cyan",
};

export default function OpenSourcePage() {
  return (
    <PageShell
      kicker="Open Source"
      title="An open-source spacecraft, from hardware to orbit."
      intro="Argus is not only a mission but an educational reference architecture for future student spacecraft teams. Design files, schematics, PCB layouts, CAD, software, testing procedures, integration notes, operations notes, and lessons learned will all be released."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPOS.map((repo) => {
          const card = (
            <div className="flex h-full flex-col rounded-lg border hairline p-6 transition-colors hover:border-cyan/40">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-bold">{repo.name}</h2>
                <span
                  className={`mono-label whitespace-nowrap rounded border px-2 py-0.5 ${statusColor[repo.status]}`}
                >
                  {repo.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{repo.description}</p>
              {repo.license && <p className="mono-label mt-4 text-muted/70">{repo.license}</p>}
            </div>
          );
          return repo.href ? (
            <a key={repo.name} href={repo.href} target="_blank" rel="noreferrer">
              {card}
            </a>
          ) : (
            <div key={repo.name}>{card}</div>
          );
        })}
      </div>
    </PageShell>
  );
}
