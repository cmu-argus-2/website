"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean | undefined {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean | undefined {
  return undefined;
}

/**
 * Returns `undefined` until mounted (SSR renders the motion layout for SEO),
 * then the user's actual prefers-reduced-motion setting.
 */
export function usePrefersReducedMotion(): boolean | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
