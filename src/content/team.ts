export type TeamSection = "Faculty Advisors" | "Mission Lead" | "PhD" | "Student";

export interface Member {
  name: string;
  role: string; // short line shown under the name
  section: TeamSection;
  /** Filename under /public/images/team/. */
  image: string;
  alt: string;
  /** optional profile link (LinkedIn / personal site) */
  url?: string;
}

/** Render order, top-down by hierarchy. */
export const SECTIONS: TeamSection[] = ["Faculty Advisors", "Mission Lead", "PhD", "Student"];

export const TEAM: Member[] = [
  {
    name: "Brandon Lucia",
    role: "Professor / PI",
    section: "Faculty Advisors",
    image: "brandon-lucia.webp",
    alt: "Brandon Lucia",
  },
  {
    name: "Zac Manchester",
    role: "Professor / PI",
    section: "Faculty Advisors",
    image: "zac-manchester.webp",
    alt: "Zac Manchester",
  },
  {
    name: "João Paulo Monteiro",
    role: "Professor / PI",
    section: "Faculty Advisors",
    image: "joao-paulo-monteiro.webp",
    alt: "João Paulo Monteiro",
  },
  {
    name: "Neil Khera",
    role: "Avionics",
    section: "Mission Lead",
    image: "neil.webp",
    alt: "Neil Khera",
    url: "https://www.linkedin.com/in/neilkhera/",
  },
  {
    name: "Chase Dunaway",
    role: "Guidance, Navigation & Control · Payload · Flight Software",
    section: "PhD",
    image: "chase.webp",
    alt: "Chase Dunaway",
    url: "https://www.linkedin.com/in/chase-dunaway-bb91612a8/",
  },
  {
    name: "Pedro Cachim",
    role: "Guidance, Navigation & Control · Payload · Flight Software",
    section: "PhD",
    image: "pedro-cachim.webp",
    alt: "Pedro Cachim",
    url: "https://www.linkedin.com/in/pedro-rocha-cachim/",
  },
  {
    name: "Saksham Bhutani",
    role: "Flight Software · Communications",
    section: "Student",
    image: "saksham.webp",
    alt: "Saksham Bhutani",
    url: "https://sakshambhutani.xyz",
  },
  {
    name: "José Maria Anca Mateus",
    role: "Flight Software · Communications",
    section: "Student",
    image: "jose-maria-anca-mateus.webp",
    alt: "José Maria Anca Mateus",
  },
  {
    name: "Tabish Shaik",
    role: "Payload",
    section: "Student",
    image: "tabish-shaik.webp",
    alt: "Tabish Shaik",
  },
  {
    name: "Sophia Zhao",
    role: "Flight Software · Payload",
    section: "Student",
    image: "sophia-zhao.webp",
    alt: "Sophia Zhao",
    url: "https://www.linkedin.com/in/sophizhao/",
  },
];
