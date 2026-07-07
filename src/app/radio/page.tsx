import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Radio" };

const PLANNED: [string, string][] = [
  ["Band", "UHF amateur band"],
  ["Frequency", "435 MHz (coordination in progress)"],
  ["Modes", "LoRa telemetry · GMSK experiment · packet repeater"],
  ["Antennas", "Deployable tape-measure UHF, 50 Ω"],
  ["Ground segment", "Pittsburgh ground stations + community receivers"],
];

export default function RadioPage() {
  return (
    <PageShell
      kicker="Radio"
      title="For operators and listeners"
      intro="Argus carries a Doppler orbit-determination experiment on GMSK signals and an amateur packet repeater. Radio operators will find practical operating details here — frequencies, beacon schedule, packet format, and TLEs — once coordination and launch are complete."
    >
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold">Planned signal modes</h2>
        <dl className="mt-6 divide-y divide-hairline overflow-hidden rounded-lg border hairline">
          {PLANNED.map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 gap-1 bg-bg p-4 sm:grid-cols-3">
              <dt className="mono-label text-muted">{k}</dt>
              <dd className="text-sm text-fg sm:col-span-2">{v}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-16 text-2xl font-bold">The Doppler OD experiment</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Ground stations receive GMSK signals from Argus and use Doppler measurements to determine
          its orbit from the ground. The experiment studies how signal characteristics — SNR,
          bandwidth, and duty cycle — affect orbit determination precision. Community reception
          reports will directly contribute to this experiment after launch.
        </p>

        <h2 className="mt-16 text-2xl font-bold">Amateur packet repeater</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Argus will support an amateur radio packet repeater as operational constraints allow.
          Operational details — callsign, beacon format, packet format, repeater schedule, and how
          to submit reception reports — will be published after coordination and approval.
        </p>

        <p className="mono-label mt-16 rounded border border-amber/40 p-4 text-amber">
          Pre-launch: operational details will be published after coordination / approval.
        </p>
      </div>
    </PageShell>
  );
}
