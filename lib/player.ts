"use client";

/**
 * The Listening Room player.
 *
 * One store, two possible sources, never both at once:
 *  - "audio":   a single shared <audio> element, for tracks with owned audio (`audioSrc`).
 *  - "spotify": one Spotify embed, controlled through Spotify's iFrame API
 *               (https://developer.spotify.com/documentation/embeds/references/iframe-api),
 *               for tracks with a `spotifyId`.
 *
 * All UI state (playing, paused, position, duration…) comes from the source's own
 * playback events, so the turntable only spins when music is actually playing.
 * Nothing loads or plays until the visitor presses play.
 */

import { useSyncExternalStore } from "react";
import { catalog, type CatalogTrack } from "@/content/music";
import { setSoundOn } from "./settings";
import { stopAmbient } from "./audio";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "error";
type Source = "audio" | "spotify";

export type PlayerState = {
  currentId: string;
  status: PlayerStatus;
  /** Milliseconds, as last reported by the source. */
  position: number;
  /** Milliseconds, as reported by the source (Spotify reports the preview length when not signed in). */
  duration: number;
  /** performance.now() of the last position report, for smooth interpolation while playing. */
  reportedAt: number;
  buffering: boolean;
  /** Spotify is playing a short preview rather than the full song. */
  preview: boolean;
  /** Play was requested but the browser hasn't let the embed start (e.g. some mobile browsers). */
  needsTap: boolean;
  error: string | null;
  source: Source | null;
};

export const playableTracks = catalog.filter((t) => t.audioSrc || t.spotifyId);
const firstId = playableTracks[0]?.id ?? catalog[0]?.id ?? "";

let state: PlayerState = {
  currentId: firstId,
  status: "idle",
  position: 0,
  duration: 0,
  reportedAt: 0,
  buffering: false,
  preview: false,
  needsTap: false,
  error: null,
  source: null,
};
const listeners = new Set<() => void>();
const set = (patch: Partial<PlayerState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getState = () => state;

export function usePlayer(): PlayerState {
  return useSyncExternalStore(subscribe, getState, getState);
}

export const trackById = (id: string) => catalog.find((t) => t.id === id);
export const currentTrack = () => trackById(state.currentId)!;
const sourceFor = (t: CatalogTrack): Source | null => (t.audioSrc ? "audio" : t.spotifyId ? "spotify" : null);
const parseDuration = (d: string | null) => {
  if (!d) return 0;
  const [m, s] = d.split(":").map(Number);
  return (m * 60 + s) * 1000;
};

/** Quiet the optional room tone so it never plays over the music. */
function hushRoomTone() {
  setSoundOn(false);
  stopAmbient();
}

/* ------------------------------------------------------------------ */
/* Owned audio: one shared <audio> element                             */
/* ------------------------------------------------------------------ */

let audioEl: HTMLAudioElement | null = null;

function audio() {
  if (audioEl) return audioEl;
  const el = new Audio();
  el.preload = "none";
  const report = () => set({ position: el.currentTime * 1000, duration: (el.duration || 0) * 1000, reportedAt: performance.now() });
  el.addEventListener("playing", () => {
    if (state.source !== "audio") return;
    set({ status: "playing", buffering: false, needsTap: false, error: null });
    report();
  });
  el.addEventListener("pause", () => {
    if (state.source !== "audio" || el.ended) return;
    set({ status: "paused" });
    report();
  });
  el.addEventListener("waiting", () => state.source === "audio" && set({ buffering: true }));
  el.addEventListener("timeupdate", () => state.source === "audio" && report());
  el.addEventListener("durationchange", () => state.source === "audio" && report());
  el.addEventListener("ended", () => state.source === "audio" && onEnded());
  el.addEventListener("error", () => {
    if (state.source !== "audio") return;
    set({ status: "error", error: "This song’s audio file couldn’t be played." });
  });
  audioEl = el;
  return el;
}

/* ------------------------------------------------------------------ */
/* Spotify embed, via the official iFrame API                          */
/* ------------------------------------------------------------------ */

type SpotifyUpdate = { isPaused: boolean; isBuffering: boolean; duration: number; position: number; playingURI?: string };
type SpotifyController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  addListener: (event: string, cb: (e: { data: SpotifyUpdate }) => void) => void;
};
type SpotifyIFrameAPI = {
  createController: (el: HTMLElement, opts: { uri: string; width: string; height: number }, cb: (c: SpotifyController) => void) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

let spotifyHost: HTMLElement | null = null;
let controller: SpotifyController | null = null;
let controllerPromise: Promise<SpotifyController> | null = null;
/** The track the Spotify embed currently has loaded. */
let loadedUri: string | null = null;
/** Start playing as soon as the embed reports it's ready. */
let playWhenReady = false;
let endedFor: string | null = null;
let tapTimer: number | undefined;

/** The Player component registers the element the embed should live in. */
export function attachSpotifyHost(el: HTMLElement | null) {
  spotifyHost = el;
}

function loadSpotify(firstUri: string): Promise<SpotifyController> {
  if (controllerPromise) return controllerPromise;
  controllerPromise = new Promise<SpotifyController>((resolve, reject) => {
    const host = spotifyHost;
    if (!host) return reject(new Error("no host"));
    // The API replaces the element it's given, so hand it a child, not a React-managed node.
    const mount = document.createElement("div");
    host.replaceChildren(mount);
    const timeout = window.setTimeout(() => reject(new Error("timeout")), 15000);
    window.onSpotifyIframeApiReady = (api) => {
      api.createController(mount, { uri: firstUri, width: "100%", height: 80 }, (c) => {
        window.clearTimeout(timeout);
        c.addListener("ready", () => {
          if (playWhenReady) {
            playWhenReady = false;
            c.play();
          }
        });
        c.addListener("playback_update", (e) => onSpotifyUpdate(e.data));
        resolve(c);
      });
    };
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("blocked"));
    };
    document.body.appendChild(script);
  });
  controllerPromise.catch(() => {
    controllerPromise = null;
    set({
      status: "error",
      error: "The player couldn’t load here (a content blocker may be stopping it). The streaming links below still work.",
    });
  });
  return controllerPromise;
}

function onSpotifyUpdate(d: SpotifyUpdate) {
  if (state.source !== "spotify") return;
  const track = currentTrack();
  // Ignore stale reports from a previously loaded track.
  if (d.playingURI && track.spotifyId && d.playingURI !== `spotify:track:${track.spotifyId}`) return;
  const full = parseDuration(track.duration);
  const patch: Partial<PlayerState> = {
    position: d.position,
    duration: d.duration,
    reportedAt: performance.now(),
    buffering: d.isBuffering,
    preview: d.duration > 0 && full > 0 && d.duration < full - 5000,
  };
  if (d.duration > 0 && d.position >= d.duration - 250) {
    set(patch);
    if (endedFor !== state.currentId) {
      endedFor = state.currentId;
      onEnded();
    }
    return;
  }
  if (!d.isPaused) {
    endedFor = null;
    window.clearTimeout(tapTimer);
    patch.status = "playing";
    patch.needsTap = false;
    patch.error = null;
  } else if (state.status === "playing") {
    patch.status = "paused";
  }
  set(patch);
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

function onEnded() {
  const i = playableTracks.findIndex((t) => t.id === state.currentId);
  const next = playableTracks[i + 1];
  if (next) select(next.id);
  else set({ status: "ended", position: 0 });
}

function watchForBlockedStart() {
  window.clearTimeout(tapTimer);
  tapTimer = window.setTimeout(() => {
    if (state.status === "loading") set({ needsTap: true });
  }, 5000);
}

/** Load a track and play it. Only ever called from a visitor’s action (or a track ending). */
export function select(id: string) {
  const track = trackById(id);
  if (!track) return;
  const source = sourceFor(track);
  if (!source) return;
  hushRoomTone();

  // Never two sources at once.
  if (source !== "audio" && audioEl && !audioEl.paused) audioEl.pause();
  if (source !== "spotify" && controller && state.source === "spotify") controller.pause();

  endedFor = null;
  set({ currentId: id, source, status: "loading", position: 0, duration: parseDuration(track.duration), reportedAt: performance.now(), needsTap: false, error: null, buffering: true, preview: false });

  if (source === "audio") {
    const el = audio();
    el.src = track.audioSrc!;
    void el.play().catch(() => state.currentId === id && set({ status: "paused", buffering: false }));
    return;
  }

  const uri = `spotify:track:${track.spotifyId}`;
  watchForBlockedStart();
  if (controller) {
    if (loadedUri === uri) {
      restartSpotify(true);
    } else {
      playWhenReady = true;
      loadedUri = uri;
      controller.loadUri(uri);
    }
    return;
  }
  playWhenReady = true;
  loadedUri = uri;
  loadSpotify(uri).then((c) => {
    controller = c;
  });
}

export function play() {
  if (state.status === "idle" || state.status === "ended" || state.status === "error") return select(state.currentId);
  // Never actually started (e.g. paused while loading): start it properly.
  if (state.source === "spotify" && (!controller || state.position === 0)) return select(state.currentId);
  hushRoomTone();
  if (state.source === "audio") void audio().play();
  else controller?.resume();
}

export function pause() {
  playWhenReady = false;
  window.clearTimeout(tapTimer);
  if (state.source === "audio") audioEl?.pause();
  else controller?.pause();
  // A pause while still loading cancels the start; there’s no playback event to wait for.
  if (state.status === "loading") set({ status: "paused", buffering: false, needsTap: false });
}

export function toggle() {
  if (state.status === "playing" || (state.status === "loading" && !state.needsTap)) pause();
  else play();
}

/** Spotify’s seek ignores anything under one second, so “back to the start” reloads the track. */
function restartSpotify(playAfter: boolean) {
  if (!controller || !loadedUri) return;
  playWhenReady = playAfter;
  endedFor = null;
  controller.loadUri(loadedUri);
  if (!playAfter) set({ status: "paused" });
}

export function seek(ms: number) {
  if (state.status === "idle" || state.status === "error") return;
  const clamped = Math.max(0, Math.min(ms, state.duration || ms));
  if (state.source === "audio" && audioEl) audioEl.currentTime = clamped / 1000;
  else if (clamped < 1000) restartSpotify(state.status === "playing" || state.status === "loading");
  else controller?.seek(clamped / 1000);
  set({ position: clamped, reportedAt: performance.now() });
}

export function next() {
  const i = playableTracks.findIndex((t) => t.id === state.currentId);
  const n = playableTracks[(i + 1) % playableTracks.length];
  if (n) select(n.id);
}

/** Restart the song if it’s a few seconds in; otherwise go to the previous one. */
export function previous() {
  if (state.status !== "idle" && livePosition() > 3000) return seek(0);
  const i = playableTracks.findIndex((t) => t.id === state.currentId);
  const p = playableTracks[(i - 1 + playableTracks.length) % playableTracks.length];
  if (p) select(p.id);
}

/** Current position, interpolated between the source’s (roughly once a second) reports. */
export function livePosition(s: PlayerState = state) {
  if (s.status !== "playing" || s.buffering) return s.position;
  return Math.min(s.duration || Infinity, s.position + (performance.now() - s.reportedAt));
}

export const isActive = (s: PlayerState) => s.status === "playing" || s.status === "paused" || s.status === "loading";
