export type UpdateCategory =
  | "Design"
  | "Hardware"
  | "Flight Software"
  | "Payload"
  | "Testing"
  | "Integration"
  | "Launch"
  | "Operations"
  | "Open Source"
  | "Radio";

export interface Update {
  slug: string;
  date: string; // ISO
  category: UpdateCategory;
  title: string;
  summary: string;
  /** Filenames under /public/images/updates/. */
  photos: string[];
  cover: string;
}

export const UPDATES: Update[] = [
  {
    slug: "full-system-testing-campaign",
    date: "2026-05-10",
    category: "Testing",
    title: "Full-system testing campaign",
    summary:
      "Both spacecraft ran through power characterization and full functional testing, including attitude-control runs inside a Helmholtz cage.",
    photos: ["testing-campaign-helmholtz.webp", "testing-campaign-power-testing.webp"],
    cover: "testing-campaign-helmholtz.webp",
  },
  {
    slug: "prelaunch-vibration-test",
    date: "2026-04-06",
    category: "Testing",
    title: "Pre-launch vibration testing in the deployer pod",
    summary:
      "Argus completed vibration testing in its deployer pod, verifying the stowed configuration survives launch loads before final integration.",
    photos: [
      "vibe-test-satellite-in-pod.webp",
      "vibe-test-satellite-in-pod-away.webp",
      "vibe-test-opened-on-bench.webp",
    ],
    cover: "vibe-test-satellite-in-pod.webp",
  },
];
