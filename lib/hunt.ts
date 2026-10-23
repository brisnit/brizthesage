"use client";

/**
 * Progress on the hidden trail to the Sage (content/hunt.ts).
 * Saved in this browser only, under its own key: completely separate from the
 * relic game (lib/gameStore.ts), so neither can break or reset the other.
 */

import { useSyncExternalStore } from "react";
import { huntHints } from "@/content/hunt";

const KEY = "bluehouse:sage-hunt:v1";
export const FINAL_STEP = 5;

export type HuntState = {
  /** How many steps of the trail are done (0–5). 5 = the sanctuary is open. */
  stage: number;
  /** How many hints have been revealed for each step. */
  hints: number[];
  unlockedAt: string | null;
};

const EMPTY: HuntState = { stage: 0, hints: [0, 0, 0, 0, 0, 0], unlockedAt: null };

let cache: HuntState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): HuntState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<HuntState>;
    const stage = Number.isInteger(p.stage) ? Math.min(FINAL_STEP, Math.max(0, p.stage!)) : 0;
    const hints = EMPTY.hints.map((_, i) => (Array.isArray(p.hints) && Number.isInteger(p.hints[i]) ? Math.max(0, p.hints[i]) : 0));
    return { stage, hints, unlockedAt: typeof p.unlockedAt === "string" ? p.unlockedAt : null };
  } catch {
    return EMPTY;
  }
}

function write(next: HuntState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode): progress lasts for this visit only.
  }
  listeners.forEach((l) => l());
}

function getSnapshot() {
  if (!loaded) {
    cache = read();
    loaded = true;
  }
  return cache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerSnapshot = () => EMPTY;

export function useHunt(): HuntState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Has the visitor’s browser finished loading saved progress? (false during server render) */
export function useHuntReady(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export const hunt = {
  /** Mark step `step` (1–5) as found. Only counts if the previous step is done. Returns true if this was new. */
  reach(step: number): boolean {
    const s = getSnapshot();
    if (s.stage !== step - 1) return false;
    write({ ...s, stage: step, unlockedAt: step === FINAL_STEP ? new Date().toISOString() : s.unlockedAt });
    return true;
  },
  /** Reveal the next hint for the current step; returns the hint lines revealed so far (most recent last). */
  nextHint(): string[] {
    const s = getSnapshot();
    const ladder = huntHints[s.stage] ?? [];
    const shown = Math.min(ladder.length, (s.hints[s.stage] ?? 0) + 1);
    const hints = s.hints.slice();
    hints[s.stage] = shown;
    write({ ...s, hints });
    return ladder.slice(0, shown);
  },
  reset() {
    write(EMPTY);
  },
};
