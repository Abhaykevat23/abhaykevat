"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(notify: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

/** Hydration-safe `prefers-reduced-motion` (false on the server, real value after hydration). */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/** Runs `tick` every `ms` while `active` is true. The latest `tick` is always used. */
export function useTicker(tick: () => void, ms: number, active: boolean) {
  const saved = useRef(tick);
  useEffect(() => {
    saved.current = tick;
  });
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
}
