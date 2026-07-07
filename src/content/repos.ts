export type RepoStatus = "Public" | "Coming soon" | "In review";

export interface Repo {
  name: string;
  description: string;
  status: RepoStatus;
  href?: string;
  license?: string;
}

export const GITHUB_ORG = "https://github.com/cmu-argus-2";

export const REPOS: Repo[] = [
  {
    name: "FSW · Mainboard",
    description: "Python flight software running on the RP2350 mainboard: scheduler, state machine, OBDH, telemetry.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/FSW-mainboard",
  },
  {
    name: "FSW · Payload",
    description: "Flight software for the Jetson Orin Nano payload computer: cameras, inference, estimation.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/FSW-Payload",
  },
  {
    name: "Vision Payload",
    description: "ML training for the vision pipeline: RCNet region classifier and LDNet landmark detector.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/Vision_Payload",
  },
  {
    name: "GNC Simulation",
    description: "Guidance, navigation, and control simulation for orbit and attitude estimation development.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/GNC-Simulation",
  },
  {
    name: "Avionics · Mainboard",
    description: "KiCad design files for the mainboard: MCU, sensors, power monitoring, radio.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/Avionics-Mainboard",
  },
  {
    name: "Avionics · Deployables",
    description: "Electronics for the deployable solar panels and antenna release system.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/Avionics-Deployables",
  },
  {
    name: "Mechanical CAD",
    description: "Full spacecraft CAD: 1U chassis, rails, hinges, deployables, and integration fixtures.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/Mechanical-CAD",
  },
  {
    name: "Ground Station · Backend",
    description: "Ground segment backend: passes, downlink processing, telemetry database.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/GSW-backend",
  },
  {
    name: "Ground Station · Frontend",
    description: "Operations dashboard for mission data visualization and monitoring.",
    status: "Public",
    href: "https://github.com/cmu-argus-2/GSW-frontend",
  },
];
