import { secondary } from "@/content/copy";

export function Secondary() {
  return (
    <section data-section="secondary" className="relative z-10 min-h-svh">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 py-24">
        <h2 data-reveal className="text-3xl font-bold md:text-4xl">
          {secondary.headline}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div data-reveal className="rounded-lg border hairline bg-bg/80 p-8">
            <DopplerGlyph />
            <h3 className="mt-6 text-xl font-bold">{secondary.cards[0].title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{secondary.cards[0].body}</p>
          </div>
          <div data-reveal className="rounded-lg border hairline bg-bg/80 p-8">
            <RepeaterGlyph />
            <h3 className="mt-6 text-xl font-bold">{secondary.cards[1].title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{secondary.cards[1].body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DopplerGlyph() {
  return (
    <svg viewBox="0 0 200 80" className="h-20 w-full" aria-hidden>
      {/* ground station */}
      <line x1="24" y1="70" x2="24" y2="50" stroke="#8b93a1" strokeWidth="2" />
      <path d="M14 50 L34 50 L24 38 Z" fill="none" stroke="#8b93a1" strokeWidth="2" />
      {/* signal arcs */}
      {[14, 24, 34].map((r) => (
        <path
          key={r}
          d={`M ${24 + r * 0.5} ${38 - r * 0.6} A ${r} ${r} 0 0 1 ${24 + r} ${38 - r * 0.15}`}
          fill="none"
          stroke="#58d7ff"
          strokeWidth="1"
          opacity={0.7 - r * 0.012}
        />
      ))}
      {/* satellite */}
      <rect x="160" y="14" width="12" height="12" fill="none" stroke="#f4f7fb" strokeWidth="1.5" />
      <line x1="154" y1="20" x2="146" y2="20" stroke="#f4f7fb" strokeWidth="1.5" />
      <line x1="178" y1="20" x2="186" y2="20" stroke="#f4f7fb" strokeWidth="1.5" />
      {/* frequency-shift trace */}
      <path
        d="M60 66 C 90 66, 100 30, 118 30 C 136 30, 146 60, 196 62"
        fill="none"
        stroke="#34d399"
        strokeWidth="1.4"
      />
      <text x="60" y="78" fill="#8b93a1" fontSize="7" fontFamily="var(--font-mono)">
        DOPPLER SHIFT · GMSK
      </text>
    </svg>
  );
}

function RepeaterGlyph() {
  return (
    <svg viewBox="0 0 200 80" className="h-20 w-full" aria-hidden>
      {/* Earth horizon */}
      <path d="M0 78 Q 100 58 200 78" fill="none" stroke="#8b93a1" strokeWidth="1.5" />
      {/* satellite */}
      <rect x="94" y="10" width="12" height="12" fill="none" stroke="#f4f7fb" strokeWidth="1.5" />
      {/* packet paths up and down */}
      <path d="M30 70 L 94 20" fill="none" stroke="#58d7ff" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M106 20 L 170 70" fill="none" stroke="#58d7ff" strokeWidth="1" strokeDasharray="4 4" />
      {/* packets */}
      <circle cx="52" cy="53" r="3" fill="#58d7ff">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="148" cy="53" r="3" fill="#34d399">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="30" y="78" fill="#8b93a1" fontSize="7" fontFamily="var(--font-mono)">
        UPLINK
      </text>
      <text x="150" y="78" fill="#8b93a1" fontSize="7" fontFamily="var(--font-mono)">
        DOWNLINK
      </text>
    </svg>
  );
}
