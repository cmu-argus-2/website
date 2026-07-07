/**
 * The satellite model contract, in two halves:
 *
 * - EXPLODE_GROUPS: the 18 physical assemblies in the CAD-derived GLB
 *   (public/models/argus.glb) that move apart in the exploded view, like an
 *   engineering exploded drawing. Directions/pivots come from the generated
 *   manifest (argus-model.json, written by tools/cad-pipeline).
 *
 * - CALLOUTS: the 11 subsystem labels. Each anchors to an `anchor_*` empty
 *   baked into the GLB at the real component's position (the RP2350 die, the
 *   IMU package, the GNSS patch…), so labels track hardware, not groups.
 *
 * The procedural placeholder (fallback while the GLB loads) exposes the old
 * 11 node names; explode/callout lookups simply skip nodes they can't find.
 */

import manifest from "./argus-model.json";

export type SubsystemName =
  | "structure"
  | "solar_panels"
  | "cameras"
  | "jetson_orin_nano"
  | "obc_rp2350"
  | "imu"
  | "gnss_receiver"
  | "radio"
  | "antennas"
  | "eps"
  | "battery";

export interface ExplodeGroupDef {
  name: string;
  /** Direction * distance the group travels at explode = 1 */
  offset: [number, number, number];
  /** Window of the global explode factor in which this group moves */
  stagger: [number, number];
}

export interface CalloutDef {
  name: SubsystemName;
  /** GLB anchor node the label + leader line track */
  anchor: string;
  /** Window of the explode factor in which the label fades in */
  stagger: [number, number];
  label: string;
  blurb: string;
  side: "left" | "right";
}

type GroupInfo = { pivot: number[]; center: number[]; size: number[] };
const GROUPS = manifest.groups as Record<string, GroupInfo>;

const radialXZ = (name: string, dist: number): [number, number, number] => {
  const c = GROUPS[name]?.center ?? [1, 0, 0];
  const len = Math.hypot(c[0], c[2]) || 1;
  return [(c[0] / len) * dist, 0, (c[2] / len) * dist];
};
const vertical = (name: string, dist: number): [number, number, number] => {
  const c = GROUPS[name]?.center ?? [0, 1, 0];
  return [0, Math.sign(c[1] || 1) * dist, 0];
};

/** Board stack spreads along Y keeping its real order (manifest is bottom→top). */
const STACK: string[] = manifest.stackBottomToTop;
const stackOffset = (name: string): [number, number, number] => {
  const i = STACK.indexOf(name);
  const centered = i - (STACK.length - 1) / 2;
  return [0, centered * 0.46, 0];
};
const add = (
  a: [number, number, number],
  b: [number, number, number]
): [number, number, number] => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const SIDE_PANELS = ["side_panel_px", "side_panel_nx", "side_panel_pz", "side_panel_nz"];
const DEPLOYABLES = ["deployable_px", "deployable_nx", "deployable_pz", "deployable_nz"];

export const EXPLODE_GROUPS: ExplodeGroupDef[] = [
  { name: "structure", offset: [0, 0, 0], stagger: [0, 1] },
  ...SIDE_PANELS.map((name, i): ExplodeGroupDef => ({
    name,
    offset: radialXZ(name, 1.0),
    stagger: [0.04 + i * 0.03, 0.4 + i * 0.03],
  })),
  // NOTE: CAD "Z+"/"Z-" flip when the model is turned upright — direction is
  // measured from the manifest, not assumed from the name.
  { name: "top_panel", offset: vertical("top_panel", 0.75), stagger: [0.16, 0.52] },
  { name: "bottom_panel", offset: vertical("bottom_panel", 0.85), stagger: [0.18, 0.54] },
  { name: "antennas", offset: vertical("antennas", 0.75), stagger: [0.24, 0.6] },
  ...DEPLOYABLES.map((name, i): ExplodeGroupDef => ({
    name,
    offset: add(radialXZ(name, 1.2), [0, -0.18, 0]),
    stagger: [0.2 + i * 0.03, 0.56 + i * 0.03],
  })),
  ...STACK.map((name, i): ExplodeGroupDef => ({
    name,
    offset: stackOffset(name),
    stagger: [0.34 + i * 0.04, 0.7 + i * 0.04],
  })),
  { name: "cameras", offset: add(stackOffset("board_camerahub"), [0, 0.34, 0]), stagger: [0.5, 0.85] },
  { name: "batteries", offset: add(stackOffset("board_battery"), [0.55, 0.28, 0]), stagger: [0.58, 0.94] },
];

/**
 * Column order matters: within each side, entries are listed top→bottom to
 * match the projected anchor heights at full explode (computed from the
 * manifest), so leader lines stay near-horizontal and don't cross.
 */
export const CALLOUTS: CalloutDef[] = [
  // — left column, top → bottom
  {
    name: "cameras",
    anchor: "anchor_cameras",
    stagger: [0.52, 0.86],
    label: "Payload cameras",
    blurb: "Capture Earth imagery for landmark-based OD.",
    side: "left",
  },
  {
    name: "structure",
    anchor: "anchor_structure",
    stagger: [0.05, 0.45],
    label: "Structure",
    blurb: "1U aluminum frame and rails, CDS Rev 14.1 compliant.",
    side: "left",
  },
  {
    name: "obc_rp2350",
    anchor: "anchor_obc",
    stagger: [0.36, 0.74],
    label: "RP2350 OBC",
    blurb: "Handles low-level spacecraft tasks and core flight software.",
    side: "left",
  },
  {
    name: "imu",
    anchor: "anchor_imu",
    stagger: [0.4, 0.76],
    label: "IMU",
    blurb: "Inertial measurements fused with landmark bearings.",
    side: "left",
  },
  {
    name: "eps",
    anchor: "anchor_eps",
    stagger: [0.56, 0.9],
    label: "EPS",
    blurb: "Distributes power across the spacecraft.",
    side: "left",
  },
  // — right column, top → bottom
  {
    name: "antennas",
    anchor: "anchor_antennas",
    stagger: [0.24, 0.6],
    label: "Antennas",
    blurb: "Tape-measure UHF antennas for spacecraft communications.",
    side: "right",
  },
  {
    name: "gnss_receiver",
    anchor: "anchor_gnss",
    stagger: [0.18, 0.54],
    label: "GNSS reference",
    blurb: "Flies only as the truth reference for validation.",
    side: "right",
  },
  {
    name: "jetson_orin_nano",
    anchor: "anchor_jetson",
    stagger: [0.48, 0.82],
    label: "Jetson Orin Nano",
    blurb: "Runs inference and batch estimation.",
    side: "right",
  },
  {
    name: "radio",
    anchor: "anchor_radio",
    stagger: [0.44, 0.8],
    label: "Radio system",
    blurb: "Telemetry, commands, GMSK experiments, amateur operations.",
    side: "right",
  },
  {
    name: "solar_panels",
    anchor: "anchor_solar",
    stagger: [0.2, 0.58],
    label: "Solar panels",
    blurb: "Deployable panels generate power and host magnetorquers.",
    side: "right",
  },
  {
    name: "battery",
    anchor: "anchor_battery",
    stagger: [0.6, 0.94],
    label: "Battery",
    blurb: "2s3p 18650 pack with onboard fuel gauge.",
    side: "right",
  },
];

/** Deploy rig: wing groups + their hinge axes (group-local, from the CAD). */
export const HINGES = manifest.hinges as Record<
  string,
  { axis: number[]; stowedDeg: number }
>;
