import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = { title: "Design" };

const SPECS: [string, string][] = [
  ["Form factor", "1U CubeSat · CDS Rev 14.1"],
  ["Flight units", "2 identical spacecraft"],
  ["Primary mission", "Visual orbit + attitude determination"],
  ["Compute", "RP2350 OBC + Jetson Orin Nano"],
  ["Payload", "Earth imaging + landmark inference + batch estimator"],
  ["Reference", "Onboard GNSS"],
  ["Software", "Python flight software"],
  ["Comms", "UHF · LoRa @ 435 MHz · GMSK"],
  ["Attitude control", "Magnetorquers + experimental reaction wheel"],
  ["Architecture", "COTS-based · student-built · open source"],
];

const SUBSYSTEMS: [string, string][] = [
  [
    "Structure",
    "Aluminum 1U frame with steel hardware. Deployable boards mount on anodized aluminum hinges; burn wires on the −Z face release the deployables and UHF antenna after deployment.",
  ],
  [
    "Electrical power",
    "Solar panels on every face charge a 2s3p Li-Po pack on the battery board, with a fuel gauge for battery management and per-panel power telemetry.",
  ],
  [
    "OBC / flight computer",
    "An ARM Cortex-M33 based Raspberry Pi RP2350 handles all low-level tasks: scheduling, telemetry, command handling, and safety-critical responsibilities.",
  ],
  [
    "Flight software",
    "Python flight software built on a hardware abstraction layer, a non-preemptive scheduler, a global state machine, and onboard data handling — portable to a simulator for hardware-free development.",
  ],
  [
    "Payload compute",
    "An NVIDIA Jetson Orin Nano interfaces with the cameras, runs the RCNet/LDNet inference models, and executes the batch least squares estimator.",
  ],
  [
    "Cameras",
    "Onboard RGB cameras — under 15 g and $100 each — capture the Earth imagery that feeds the visual OD pipeline.",
  ],
  [
    "ADCS / IMU",
    "Magnetorquers embedded in the solar panel boards provide attitude control; light sensors provide sun vectors; the IMU's inertial measurements fuse with landmark bearings.",
  ],
  [
    "GNSS reference",
    "An off-the-shelf patch antenna and GPS receiver fly for validation only — the truth reference against which visual OD is scored.",
  ],
  [
    "Communications",
    "A UHF radio (LoRa @ 435 MHz) with tape-measure antennas handles telemetry and commands, plus the GMSK Doppler experiment and amateur packet repeater.",
  ],
  [
    "Ground segment",
    "Ground stations in Pittsburgh downlink mission data — stored in a remote database and visualized on a public dashboard — and uplink encrypted commands.",
  ],
];

export default function DesignPage() {
  return (
    <PageShell
      kicker="Design"
      title="One unit. Every subsystem built in-house."
      intro="Argus is built entirely from commercial off-the-shelf components, with chassis and circuit boards designed by the lab. Full subsystem write-ups, photos, and open-source links are coming as the design documentation is released."
    >
      <div className="overflow-hidden rounded-lg border hairline">
        <Image
          src={withBasePath("/images/argus-studio.webp")}
          alt="Argus flight unit in deployed configuration, studio photo"
          width={1792}
          height={1809}
          className="mx-auto max-h-[560px] w-auto"
          priority
        />
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border hairline bg-hairline md:grid-cols-5">
        {SPECS.map(([k, v]) => (
          <div key={k} className="bg-bg p-4">
            <dt className="mono-label text-muted">{k}</dt>
            <dd className="mt-2 text-sm text-fg">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {SUBSYSTEMS.map(([name, body]) => (
          <section key={name} className="border-t hairline pt-6">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="mt-3 leading-relaxed text-muted">{body}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
