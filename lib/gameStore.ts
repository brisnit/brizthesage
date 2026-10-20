"use client";

/**
 * Local-only progress for "The House Remembers".
 * Saved in localStorage on this device. Nothing is sent anywhere, which also
 * means nothing here can be trusted for valuable rewards (see content/game.ts).
 */

import { useSyncExternalStore } from "react";
import { relics, solution, type RelicId } from "@/content/game";

const KEY = "bluehouse:game:v1";

export type GameState = {
  /** relic id → ISO timestamp of discovery */
  found: Partial<Record<RelicId, string>>;
  solved: boolean;
  solvedAt: string | null;
  secretCall: boolean;
  /** How many progressive hints have been revealed. */
  hintsShown: number;
};

const EMPTY: GameState = { found: {}, solved: false, solvedAt: null, secretCall: false, hintsShown: 0 };

let cache: GameState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
const discoveryListeners = new Set<(id: RelicId) => void>();

const isRelicId = (v: unknown): v is RelicId => relics.some((r) => r.id === v);

function read(): GameState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const found: GameState["found"] = {};
    for (const [id, at] of Object.entries(parsed.found ?? {})) {
      if (isRelicId(id) && typeof at === "string") found[id] = at;
    }
    return {
      found,
      solved: parsed.solved === true,
      solvedAt: typeof parsed.solvedAt === "string" ? parsed.solvedAt : null,
      secretCall: parsed.secretCall === true,
      hintsShown: typeof parsed.hintsShown === "number" ? Math.max(0, Math.floor(parsed.hintsShown)) : 0,
    };
  } catch {
    return EMPTY;
  }
}

function write(next: GameState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode). The game still works for this visit.
  }
  listeners.forEach((l) => l());
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

function getSnapshot() {
  if (!loaded) {
    cache = read();
    loaded = true;
  }
  return cache;
}

const getServerSnapshot = () => EMPTY;

export function useGame(): GameState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const foundCount = (s: GameState) => relics.filter((r) => s.found[r.id]).length;
export const allFound = (s: GameState) => foundCount(s) === relics.length;

export const game = {
  /** Returns true when the relic was newly discovered. */
  findRelic(id: RelicId): boolean {
    const s = getSnapshot();
    if (s.found[id]) {
      discoveryListeners.forEach((l) => l(id));
      return false;
    }
    write({ ...s, found: { ...s.found, [id]: new Date().toISOString() } });
    discoveryListeners.forEach((l) => l(id));
    return true;
  },
  /** Checks an attempted order. Marks the game solved when correct. */
  attempt(order: RelicId[]): boolean {
    const ok = order.length === solution.length && order.every((id, i) => id === solution[i]);
    if (ok) {
      const s = getSnapshot();
      if (!s.solved) write({ ...s, solved: true, solvedAt: new Date().toISOString() });
    }
    return ok;
  },
  showNextHint(max: number) {
    const s = getSnapshot();
    write({ ...s, hintsShown: Math.min(max, s.hintsShown + 1) });
  },
  recordSecretCall() {
    const s = getSnapshot();
    if (!s.secretCall) write({ ...s, secretCall: true });
  },
  reset() {
    write(EMPTY);
  },
  onDiscovery(cb: (id: RelicId) => void) {
    discoveryListeners.add(cb);
    return () => {
      discoveryListeners.delete(cb);
    };
  },
};
