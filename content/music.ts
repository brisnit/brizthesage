/**
 * Music content. Everything the Listening Room shows comes from here.
 *
 * Rules of the house:
 *  - Only add real releases, real links and real audio.
 *  - Only list platforms that have a real URL. Missing services stay hidden.
 *  - The Listening Room player plays a track from its `audioSrc` (owned audio)
 *    if set, otherwise through Spotify's embed using `spotifyId`. Tracks with
 *    neither are listed with their streaming links only.
 */

export type StreamingPlatform =
  | "Spotify"
  | "Apple Music"
  | "YouTube Music"
  | "Bandcamp"
  | "SoundCloud"
  | "TIDAL"
  | "Amazon Music";

export type StreamingLink = {
  platform: StreamingPlatform;
  url: string;
};

export type Track = {
  title: string;
  /** e.g. "3:41" — leave null if unknown. */
  duration: string | null;
  /**
   * Owned audio: a path under /public (e.g. "/audio/track.mp3") or a full URL.
   * When set, the Listening Room plays this file directly (full song, for everyone).
   */
  audioSrc: string | null;
  /** The recording's Spotify track id (open.spotify.com/track/<id>). Played via Spotify's embed. */
  spotifyId: string | null;
  /** Credit for this recording, when it differs from the release credit. */
  credits?: string;
};

export type Release = {
  id: string;
  title: string;
  /** "Album" | "EP" | "Single" | etc. null when not confirmed. */
  kind: string | null;
  /** ISO date (YYYY-MM-DD) or a year. null when not confirmed. */
  releaseDate: string | null;
  /** Artist credit exactly as the official listing shows it. */
  credits: string;
  /** Briz's role when it isn't his own release, e.g. "Featuring Briz the Sage". */
  role?: string;
  artwork: { src: string; alt: string; width: number; height: number };
  /** Short intro copy. null shows nothing. */
  description: string | null;
  tracks: Track[];
  /** Only real, verified links. */
  links: StreamingLink[];
};

export type Video = {
  title: string;
  /** YouTube video id (the part after watch?v=). */
  youtubeId: string;
};

/**
 * The first release is "featured" in the Listening Room.
 * Every fact below was checked against the official Apple Music and Spotify
 * listings (October 2026). Album durations are as listed on Apple Music;
 * single durations and every Spotify track id were checked on Spotify.
 */
export const releases: Release[] = [
  {
    id: "what-up-world",
    title: "What Up World",
    kind: "Album",
    releaseDate: "2023-10-05",
    credits: "Briz the Sage",
    artwork: {
      src: "/art/what-up-world.jpg",
      alt: "What Up World cover: a hooded figure stands on a turquoise mossy world beneath a huge golden moon and pink clouds with faces.",
      width: 1600,
      height: 1600,
    },
    description: "Step into What Up World. Let your mind wander. See what follows you home.",
    tracks: [
      { title: "This is Life", duration: "1:50", audioSrc: null, spotifyId: "4Vu1gdwZO2cfBrioHdr818" },
      { title: "Ambient Flight Module", duration: "2:56", audioSrc: null, spotifyId: "5CGiW9Qre9XqkUuEavVt5B" },
      { title: "The Alchemist", duration: "2:42", audioSrc: null, spotifyId: "2rwG1CwEakxOfGByC8mrbM" },
      { title: "Kept Secrets", duration: "2:31", audioSrc: null, spotifyId: "3zPJGJnxsgFjfRevEpyRLD" },
      { title: "Forbidden Fruits", duration: "2:10", audioSrc: null, spotifyId: "4lZSJhVxDFBxNHEcnD5oJ1" },
      { title: "Between the Moon and Mars", duration: "3:40", audioSrc: null, spotifyId: "7GlUZWA96G2euB4RJQDFg7" },
      { title: "Boys Home", duration: "1:48", audioSrc: null, spotifyId: "4gAcTRcmbtNuLfgOdCsMGt" },
      { title: "Professional", duration: "3:05", audioSrc: null, spotifyId: "6dD9W7XIIujaeSxsz5bRAy" },
    ],
    links: [
      { platform: "Spotify", url: "https://open.spotify.com/album/2Re9xKIHoLSe0NSVig6d5U" },
      { platform: "Apple Music", url: "https://music.apple.com/us/album/what-up-world/1710648427" },
    ],
  },
  {
    id: "be-love",
    title: "Be Love",
    kind: "Single",
    releaseDate: "2025-05-29",
    // Spotify credits Briz the Sage and Celmer; Apple Music lists Briz the Sage only.
    credits: "Briz the Sage, Celmer",
    artwork: { src: "/art/releases/be-love.jpg", alt: "Be Love single cover", width: 600, height: 600 },
    description: null,
    tracks: [{ title: "Be Love", duration: "3:46", audioSrc: null, spotifyId: "1W16xwyXZ1x2VfKDhw9lmF" }],
    links: [
      { platform: "Spotify", url: "https://open.spotify.com/album/1dxurGA8rbOvru9EAudhrF" },
      { platform: "Apple Music", url: "https://music.apple.com/us/album/be-love-single/1815467343" },
    ],
  },
  {
    id: "fame",
    title: "Fame",
    kind: "Single",
    releaseDate: "2025-05-27",
    credits: "Silk Panther, Briz the Sage, Andres Salomon",
    artwork: { src: "/art/releases/fame.jpg", alt: "Fame single cover", width: 600, height: 600 },
    description: null,
    tracks: [{ title: "Fame", duration: "2:22", audioSrc: null, spotifyId: "4xY9MDxww9ZAgYMLjrX0tm" }],
    links: [
      { platform: "Spotify", url: "https://open.spotify.com/album/0dbcBn1CU3gRirxjJYNCGj" },
      { platform: "Apple Music", url: "https://music.apple.com/us/album/fame-single/1812229985" },
    ],
  },
  {
    id: "trap-so-good",
    title: "Trap So Good",
    kind: "Single",
    releaseDate: "2024-11-10",
    credits: "Silk Panther, Briz the Sage, Andres Salomon",
    artwork: { src: "/art/releases/trap-so-good.jpg", alt: "Trap So Good single cover", width: 600, height: 600 },
    description: null,
    tracks: [{ title: "Trap So Good", duration: "2:34", audioSrc: null, spotifyId: "3DSIUjngkpFpE0plo4kHwC" }],
    links: [{ platform: "Spotify", url: "https://open.spotify.com/album/0WsmLhJ02pJVk2Q819tjfC" }],
  },
  {
    id: "carte-blanche",
    title: "Carte Blanche",
    kind: "Single",
    releaseDate: "2024-05-01",
    credits: "Silk Panther, Briz the Sage, Andres Salomon, Omar Lopez",
    artwork: { src: "/art/releases/carte-blanche.jpg", alt: "Carte Blanche single cover", width: 600, height: 600 },
    description: null,
    tracks: [{ title: "Carte Blanche", duration: "2:53", audioSrc: null, spotifyId: "2QzBzxzJLrSDgcEXn6yDjL" }],
    links: [
      { platform: "Spotify", url: "https://open.spotify.com/album/25evVhJgU56a9nS9wDqsK2" },
      { platform: "Apple Music", url: "https://music.apple.com/us/album/carte-blanche-single/1742815281" },
    ],
  },
  {
    id: "little-valentine",
    title: "Little Valentine",
    kind: "Single",
    releaseDate: "2024-02-12",
    credits: "Silk Panther, Briz the Sage, Andres Salomon, Omar Lopez",
    artwork: { src: "/art/releases/little-valentine.jpg", alt: "Little Valentine single cover", width: 600, height: 600 },
    description: null,
    tracks: [{ title: "Little Valentine", duration: "2:26", audioSrc: null, spotifyId: "5ufPhZ0BHcGBNpNxEoshTx" }],
    links: [{ platform: "Spotify", url: "https://open.spotify.com/album/5eljOguAJMt77L2Cd1v76Z" }],
  },
  {
    id: "fly-higher",
    title: "Fly Higher",
    kind: "Single",
    releaseDate: "2023-12-04",
    credits: "Andres Salomon",
    role: "Featuring Briz the Sage",
    artwork: { src: "/art/releases/fly-higher.jpg", alt: "Fly Higher single cover", width: 600, height: 600 },
    description: null,
    tracks: [{ title: "Fly Higher", duration: "3:32", audioSrc: null, spotifyId: "6ty8wxB3rapnxRhwmqWrkU", credits: "Andres Salomon feat. Briz the Sage" }],
    links: [
      { platform: "Spotify", url: "https://open.spotify.com/album/2ZB5wzxKsJ8sB7VEoxVXDd" },
      { platform: "Apple Music", url: "https://music.apple.com/us/album/fly-higher-feat-briz-the-sage-single/1715761445" },
    ],
  },
];

/** Artist-level profiles. Only verified links. */
export const artistProfiles: StreamingLink[] = [
  { platform: "Spotify", url: "https://open.spotify.com/artist/0mWrr8KIF1WVSt4VtU2N1L" },
  { platform: "Apple Music", url: "https://music.apple.com/us/artist/briz-the-sage/1710579290" },
  { platform: "TIDAL", url: "https://tidal.com/artist/42629137" },
];

/** Music videos. Empty = the TV and the Listening Room show an honest empty state. */
export const videos: Video[] = [];

/** Listening Room copy. */
export const musicCopy = {
  kicker: "Sage World",
  title: "The Listening Room",
  lede: "Pick a record. Stay a while.",
  featuredKicker: "Now on the turntable",
  aboutKicker: "About the record",
  queueTitle: "On the shelf",
  profilesTitle: "Follow the sound",
  crateTitle: "The record crate",
  moreSlotTitle: "There’s more on the shelf.",
  moreSlotNote: "We’ll get to it.",
  tvTitle: "The television",
  tvEmpty: "The television is between transmissions.",
};

/** One recording in the Listening Room queue. */
export type CatalogTrack = Track & {
  /** Stable id: `${releaseId}:${index}`. */
  id: string;
  release: Release;
  /** Credit shown for this recording. */
  artist: string;
  group: "album" | "singles";
};

/**
 * Every recording on the site, once each, in shelf order: the albums first,
 * then singles & collaborations (newest first, as in `releases`).
 */
export const catalog: CatalogTrack[] = releases.flatMap((release) =>
  release.tracks.map((t, i) => ({
    ...t,
    id: `${release.id}:${i}`,
    release,
    artist: t.credits ?? (release.role ? `${release.credits} feat. Briz the Sage` : release.credits),
    group: release.kind === "Album" ? ("album" as const) : ("singles" as const),
  })),
);

export const queueFilters = [
  { id: "all", label: "All songs" },
  { id: "album", label: "What Up World" },
  { id: "singles", label: "Singles & collaborations" },
] as const;
