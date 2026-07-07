/**
 * Every landing-page string lives here — single editing point for copy.
 * Source: DESIGN.md §3 + §12, MISSION.md, 1-pager.md.
 */

export const site = {
  name: "ARGUS",
  title: "Argus — A CubeSat mission to demonstrate visual orbit and attitude determination",
  description:
    "Argus is a student-built, open-source CubeSat mission that teaches small spacecraft to find themselves by looking at Earth. Built by Carnegie Mellon and Instituto Superior Técnico.",
  github: "https://github.com/cmu-argus-2",
};

export const hero = {
  headline: "A spacecraft that finds itself.",
  sub: "A CubeSat mission to demonstrate visual orbit and attitude determination.",
  detail:
    "Two identical open-source CubeSats built by students at Carnegie Mellon and Instituto Superior Técnico, designed to tackle the lost-in-space problem for small spacecraft.",
  ctaPrimary: { label: "Explore the Mission", href: "/mission/" },
  ctaSecondary: { label: "View Open Source Repos", href: "/open-source/" },
  ctaTertiary: { label: "Follow Build Updates", href: "/updates/" },
  chips: ["2 flight units", "1U CubeSat", "Vision-based OD", "Open source spacecraft"],
};

export const lostInSpace = {
  problem:
    "Small spacecraft often depend on GNSS or ground tracking to know where they are. But GNSS adds cost, power, and integration complexity, while ground tracking depends on external infrastructure and operations.",
  punchline:
    "Argus asks a different question: what if a CubeSat could recover its orbit and attitude by looking at Earth?",
};

export const payloadSees = {
  headline: "Argus captures Earth images onboard.",
  body: "The spacecraft uses visual observations of Earth to generate landmark bearing measurements.",
  microLabels: ["Earth image", "Region classification", "Landmark detection", "Bearing measurement"],
};

export const pipeline = {
  headline: "The payload turns images into geometry.",
  body: "A region classifier narrows down where the spacecraft is looking. A landmark detector finds visual features. Those detections become bearing measurements that can be used for orbit and attitude estimation.",
  caption: "RCNet → LDNet → Landmark bearings",
  stages: [
    { id: "image", label: "Earth image", blurb: "Raw frame captured onboard" },
    { id: "region", label: "Region classification", blurb: "RCNet narrows the view to a salient region" },
    { id: "landmarks", label: "Landmark detection", blurb: "LDNet pinpoints ground features" },
    { id: "bearings", label: "Bearing vectors", blurb: "Detections become spacecraft-to-landmark bearings" },
    { id: "packet", label: "Measurement packet", blurb: "Geometry ready for the estimator" },
  ],
};

export const fusion = {
  headline: "Argus combines what it sees with what it feels.",
  body: "Landmark bearings from onboard images are fused with inertial measurements through a batch nonlinear least squares estimator to recover orbit and attitude.",
  inputs: ["Landmark bearings", "IMU measurements", "State history"],
  estimator: "Batch nonlinear least squares estimator",
  outputs: ["Orbit estimate", "Attitude estimate", "Residuals"],
};

export const validation = {
  headline: "A GNSS receiver flies only as the truth reference.",
  body: "Argus compares its vision-based solution against onboard GNSS to evaluate estimation accuracy in orbit.",
  legendReference: "GNSS reference",
  legendEstimate: "Argus visual estimate",
};

export const twins = {
  headline: "Two identical Arguses. One open mission architecture.",
  body: "Flying two spacecraft gives the mission more opportunities for data collection, validation, operations practice, and community engagement.",
};

export const secondary = {
  headline: "Two more experiments ride along.",
  cards: [
    {
      title: "Doppler-based ground OD",
      body: "Ground stations receive GMSK signals and study how SNR, bandwidth, and duty cycle affect orbit determination precision.",
    },
    {
      title: "Amateur radio packet repeater",
      body: "Argus will support an amateur packet repeater as operational constraints allow.",
    },
  ],
};

export const exploded = {
  headline: "Every gram engineered in-house.",
  body: "Scroll to open the spacecraft.",
};

export const builtInHouse = {
  headline: "Built in-house, end to end.",
  body: "Electronics, flight software, payload, communications, integration, and operations are developed by the Argus team using commercial off-the-shelf components wherever possible.",
};

export const openSource = {
  headline: "Every subsystem. Every lesson. Open.",
  body: "Argus is designed as an open-source spacecraft mission so future student teams can learn from the full stack: hardware, software, payload, operations, and failures.",
};

export const latestUpdates = {
  headline: "Mission log",
  cta: { label: "All updates", href: "/updates/" },
};

export const finalCta = {
  headline: "Follow Argus from lab bench to low Earth orbit.",
  buttons: [
    { label: "Read Updates", href: "/updates/" },
    { label: "Explore the Design", href: "/design/" },
    { label: "Follow on Instagram", href: "https://www.instagram.com/cmuspacecraft/" },
  ],
};

export const nav = [
  { label: "Mission", href: "/mission/" },
  { label: "Design", href: "/design/" },
  { label: "Updates", href: "/updates/" },
  { label: "Open Source", href: "/open-source/" },
  { label: "Team", href: "/team/" },
];

export const footer = {
  line: "Argus is a joint mission of the CMU Nanosatellite Lab and the Instituto Superior Técnico NanoSatLab.",
  links: [
    { label: "CMU Nanosatellite Lab", href: "https://www.cs.cmu.edu" },
    { label: "IST NanoSatLab", href: "https://nanosatlab.tecnico.ulisboa.pt" },
    { label: "Open Source", href: "/open-source/" },
    { label: "GitHub", href: "https://github.com/cmu-argus-2" },
  ],
};
