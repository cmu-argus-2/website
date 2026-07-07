/**
 * Shared registry between the R3F frame loop and the DOM CalloutLayer.
 * The frame loop projects subsystem anchors to screen space and mutates the
 * registered SVG lines / label elements directly — no React re-renders.
 */

import type { Object3D } from "three";

export interface CalloutRefs {
  container: HTMLElement | null;
  /** the satellite root whose named subsystem nodes get projected */
  sceneRoot: Object3D | null;
  lines: Map<string, SVGPolylineElement>;
  labels: Map<string, HTMLElement>;
  labelRects: Map<string, DOMRect>;
}

export const calloutBus: CalloutRefs = {
  container: null,
  sceneRoot: null,
  lines: new Map(),
  labels: new Map(),
  labelRects: new Map(),
};

export function cacheLabelRects() {
  calloutBus.labelRects.clear();
  for (const [name, el] of calloutBus.labels) {
    calloutBus.labelRects.set(name, el.getBoundingClientRect());
  }
}
