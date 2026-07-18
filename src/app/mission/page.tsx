import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Mission", alternates: { canonical: "/mission/" } };

export default function MissionPage() {
  return (
    <PageShell
      kicker="Mission"
      title="Visual orbit and attitude determination for small spacecraft"
      intro="Argus is a 1U CubeSat technology demonstration of a low-cost autonomous vision-based orbit determination system. It uses onboard Earth imaging, machine-learning-based landmark extraction, IMU measurements, and batch nonlinear least squares estimation to recover spacecraft orbit and attitude."
    >
      <div className="grid gap-16 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-bold">The lost-in-space problem</h2>
          <p className="mt-4 leading-relaxed text-muted">
            When a small spacecraft deploys, it often has no prior knowledge of its state and must
            recover its orbit relying solely on onboard computing and sensing. Space-rated GNSS
            receivers are bulky, consume 1–2 W, and can cost around $10,000 — while consumer GPS
            modules are legally restricted at orbital speeds and altitudes. Ground-based radar and
            radio ranging can take weeks and still leave position errors of 10–20 kilometers.
            Visual sensing offers a complementary, autonomous path.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">The Argus approach</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Argus replaces expensive tracking hardware with a simple onboard RGB camera weighing
            under 15 grams, using under 5 watts, and costing under $100. An EfficientNet region
            classifier determines which of 16 highly salient MGRS regions the satellite is viewing;
            a YOLOv8s landmark detector then pinpoints ground features to produce bearing
            measurements. A batch nonlinear least squares estimator fuses these with IMU data to
            solve lost-in-space initialization, and an EKF (with a multiplicative variant for
            attitude) keeps the state updated recursively.
          </p>
        </section>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Validation</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          A GNSS receiver flies only as the truth reference. Argus compares its vision-based
          solution against onboard GNSS to evaluate estimation accuracy in orbit — the mission
          targets orbit determination errors under 50 km and attitude determination errors under
          15 degrees.
        </p>
      </section>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <section className="rounded-lg border hairline p-6">
          <p className="mono-label text-cyan">Secondary mission 1</p>
          <h3 className="mt-3 text-xl font-bold">Doppler-based ground OD</h3>
          <p className="mt-3 leading-relaxed text-muted">
            Ground stations receive GMSK signals and study how SNR, bandwidth, and duty cycle
            affect orbit determination precision.
          </p>
        </section>
        <section className="rounded-lg border hairline p-6">
          <p className="mono-label text-cyan">Secondary mission 2</p>
          <h3 className="mt-3 text-xl font-bold">Amateur radio packet repeater</h3>
          <p className="mt-3 leading-relaxed text-muted">
            Argus will support an amateur packet repeater as operational constraints allow.
          </p>
        </section>
      </div>

      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-bold">An educational mission</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Argus is developed in the context of CMU&apos;s Spacecraft Design-Build-Fly graduate-level
          course, in collaboration between the Carnegie Mellon Nanosatellite Lab and the Instituto
          Superior Técnico NanoSatLab. The spacecraft is designed to make spacecraft development
          accessible: Python flight software, COTS-based hardware, and open-source documentation.
        </p>
      </section>
    </PageShell>
  );
}
