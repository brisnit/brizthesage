"use client";

/**
 * Visitor settings: motion preference and sound.
 *
 * Motion: "auto" follows the OS (prefers-reduced-motion), "simple" forces the
 * simplified experience, "full" opts back in to animation. The effective value
 * is mirrored to <html data-motion="reduced|full"> (an inline script in the
 * root layout applies it before first paint to avoid a flash).
 *
 * Sound is always off at page load and starts only after a click.
 */

import { useSyncExternalStore } from "react";
import { MOTION_KEY } from "./motionBoot";

export type MotionPref = "auto" | "simple" | "full";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

let motionPref: MotionPref | null = null;
let soundOn = false;

function readPref(): MotionPref {
  try {
    const v = window.localStorage.getItem(MOTION_KEY);
    if (v === "simple" || v === "full") return v;
  } catch {}
  return "auto";
}

const osReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function isReducedMotion(): boolean {
  if (motionPref === null) motionPref = readPref();
  return motionPref === "simple" || (motionPref === "auto" && osReduced());
}

function applyToDocument() {
  document.documentElement.dataset.motion = isReducedMotion() ? "reduced" : "full";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => {
    applyToDocument();
    emit();
  };
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onChange);
  };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, isReducedMotion, () => false);
}

export function setReducedMotion(reduced: boolean) {
  // If the choice matches the OS, go back to following the OS.
  const next: MotionPref = reduced === osReduced() ? "auto" : reduced ? "simple" : "full";
  motionPref = next;
  try {
    if (next === "auto") window.localStorage.removeItem(MOTION_KEY);
    else window.localStorage.setItem(MOTION_KEY, next);
  } catch {}
  applyToDocument();
  emit();
}

export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, () => soundOn, () => false);
}

export function setSoundOn(on: boolean) {
  soundOn = on;
  emit();
}

export const getSoundOn = () => soundOn;
