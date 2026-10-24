"use client";

/**
 * One shared "discovery" response at a time (object descriptions, quips, clues).
 * On phones and tablets these show in a bottom sheet (components/ui/DiscoverySheet)
 * rendered outside the scenes, so no parallax, clipping or stacking can hide them.
 */
import { useSyncExternalStore } from "react";

export type Discovery = {
  /** Identifies the object that opened it (used to highlight it and to toggle). */
  key: string;
  title: string;
  lines: string[];
  /** Small stamp above the text, e.g. "sample". */
  stamp?: string;
  /** The element that opened it, kept visible above the sheet and refocused on close. */
  anchor?: HTMLElement | null;
};

let current: Discovery | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const discovery = {
  show(d: Discovery) {
    current = d;
    emit();
  },
  /** Opens, or closes if the same object’s response is already open. */
  toggle(d: Discovery) {
    if (current?.key === d.key) discovery.hide();
    else discovery.show(d);
  },
  hide() {
    if (!current) return;
    current = null;
    emit();
  },
  get: () => current,
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useDiscovery(): Discovery | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}

/** Screens where responses use the bottom sheet instead of anchored bubbles. */
export const SHEET_QUERY = "(max-width: 899px)";

const mqSubscribe = (cb: () => void) => {
  const mq = window.matchMedia(SHEET_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function useSheetMode(): boolean {
  return useSyncExternalStore(mqSubscribe, () => window.matchMedia(SHEET_QUERY).matches, () => false);
}
