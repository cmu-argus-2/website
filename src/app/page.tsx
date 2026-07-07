import { LandingClient } from "@/components/LandingClient";
import { Hero } from "@/components/sections/Hero";
import { Lost } from "@/components/sections/Lost";
import { Sees } from "@/components/sections/Sees";
import { PipelineSection } from "@/components/sections/PipelineSection";
import { Fusion } from "@/components/sections/Fusion";
import { Validation } from "@/components/sections/Validation";
import { Twins } from "@/components/sections/Twins";
import { Secondary } from "@/components/sections/Secondary";
import { Exploded } from "@/components/sections/Exploded";
import { Built } from "@/components/sections/Built";
import { OpenSourceSection } from "@/components/sections/OpenSourceSection";
import { UpdatesSection } from "@/components/sections/UpdatesSection";
import { Finale } from "@/components/sections/Finale";

export default function Home() {
  return (
    <LandingClient>
      <Hero />
      <Lost />
      <Sees />
      <PipelineSection />
      <Fusion />
      <Validation />
      <Twins />
      <Secondary />
      <Exploded />
      <Built />
      <OpenSourceSection />
      <UpdatesSection />
      <Finale />
    </LandingClient>
  );
}
