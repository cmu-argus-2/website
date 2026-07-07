import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { TEAM, SECTIONS, type Member } from "@/content/team";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = { title: "Team" };

function MemberCard({ member }: { member: Member }) {
  const photo = (
    <Image
      src={withBasePath(`/images/team/${member.image}`)}
      alt={member.alt}
      width={512}
      height={512}
      loading="lazy"
      className="aspect-square w-full rounded-lg border hairline object-cover"
    />
  );
  const label = (
    <>
      <p className="mt-3 font-medium text-fg">{member.name}</p>
      <p className="mt-1 text-sm text-muted">{member.role}</p>
    </>
  );

  if (member.url) {
    return (
      <a
        href={member.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col transition-opacity hover:opacity-90"
      >
        {photo}
        {label}
      </a>
    );
  }
  return (
    <div className="flex flex-col">
      {photo}
      {label}
    </div>
  );
}

export default function TeamPage() {
  return (
    <PageShell kicker="Team" title="Built by students.">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold">The lab</h2>
        <p className="mt-4 leading-relaxed text-muted">
          The Carnegie Mellon NanoSatellite Lab, led by Principal Investigators Zac Manchester and
          Brandon Lucia, is pioneering low-cost satellites that bring edge computing and AI/ML
          capabilities into space. Each semester, students in CMU&apos;s Spacecraft Design-Build-Fly
          graduate course contribute to the spacecraft&apos;s iterative design-build-test cycle —
          organized into subsystem teams spanning Mechanical, Communications, Avionics, and Flight
          Software/Payload — with a dedicated multidisciplinary team of undergraduate, masters, and
          PhD students and research staff continuing the work year-round.
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-16">
        {SECTIONS.map((section) => {
          const people = TEAM.filter((m) => m.section === section);
          if (people.length === 0) return null;
          return (
            <section key={section}>
              <h2 className="mono-label text-cyan">{section}</h2>
              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {people.map((m) => (
                  <MemberCard key={m.name} member={m} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
