import Link from "next/link";
import { openSource } from "@/content/copy";
import { REPOS } from "@/content/repos";

export function OpenSourceSection() {
  return (
    <section data-section="opensource" className="relative z-10 min-h-svh">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <div data-reveal className="max-w-2xl">
          <p className="mono-label text-cyan">Open source</p>
          <h2 className="mt-4 text-3xl font-bold md:text-5xl">{openSource.headline}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{openSource.body}</p>
        </div>

        {/* mobile: the full grid is a long scroll on a phone — one summary
            card links to the dedicated open-source page instead */}
        <Link
          href="/open-source"
          className="mt-10 block rounded-lg border hairline bg-bg/85 p-6 transition-colors hover:border-cyan/40 sm:hidden"
        >
          <div className="flex items-center gap-2">
            <RepoIcon />
            <p className="mono-label text-fg">{REPOS.length} repositories</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Flight software, ground segment, hardware and more — the whole
            stack, in the open.
          </p>
          <p className="mono-label mt-4 text-[10px] text-cyan">Explore all repositories →</p>
        </Link>

        <div className="mt-14 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {REPOS.map((repo) => (
            <a
              key={repo.name}
              href={repo.href}
              target="_blank"
              rel="noreferrer"
              data-reveal
              className="block rounded-lg border hairline bg-bg/85 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40"
            >
              <div className="flex items-center gap-2">
                <RepoIcon />
                <p className="mono-label text-fg">{repo.name}</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">{repo.description}</p>
              <p
                className={`mono-label mt-4 text-[10px] ${
                  repo.status === "Public" ? "text-signal" : "text-amber"
                }`}
              >
                {repo.status}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepoIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-muted" aria-hidden>
      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
    </svg>
  );
}
