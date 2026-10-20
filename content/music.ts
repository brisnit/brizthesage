/**
 * Music content. Everything the Listening Room shows comes from here.
 *
 * Rules of the house:
 *  - Only add real releases, real links and real audio.
 *  - A `null` URL renders as "Link coming soon" (disabled), never a fake link.
 *  - The mini-player only appears when at least one track has an `audioSrc`.
 */

export type StreamingPlatform =
  | "Spotify"
  | "Apple Music"
  | "YouTube Music"
  | "Bandcamp"
  | "SoundCloud"
  | "Tidal"
  | "Amazon Music";

export type StreamingLink = {
  platform: StreamingPlatform;
  url: string | null;
};

export type Track = {
  title: string;
  /** e.g. "3:41" — leave null if unknown. */
  duration: string | null;
  /** Path under /public (e.g. "/audio/track.mp3") or a full URL. Only real, owned audio. */
  audioSrc: string | null;
};

export type Release = {
  id: string;
  title: string;
  /** "Album" | "EP" | "Single" | etc. null when not confirmed. */
  kind: string | null;
  /** ISO date or a year. null when not confirmed. */
  releaseDate: string | null;
  artwork: { src: string; alt: string; width: number; height: number };
  /** Short real description. null shows nothing. */
  description: string | null;
  tracks: Track[];
  links: StreamingLink[];
};

export type Video = {
  title: string;
  /** YouTube video id (the part after watch?v=). */
  youtubeId: string;
};

const comingSoonLinks = (): StreamingLink[] => [
  { platform: "Spotify", url: null },
  { platform: "Apple Music", url: null },
  { platform: "YouTube Music", url: null },
  { platform: "Bandcamp", url: null },
  { platform: "SoundCloud", url: null },
];

/**
 * The first release is "featured" in the Listening Room.
 * "What Up World" is the title lettered on the supplied cover artwork;
 * every other field is unconfirmed and intentionally left empty.
 */
export const releases: Release[] = [
  {
    id: "what-up-world",
    title: "What Up World",
    kind: null,
    releaseDate: null,
    artwork: {
      src: "/art/what-up-world.jpg",
      alt: "What Up World cover: a hooded figure stands on a turquoise mossy world beneath a huge golden moon and pink clouds with faces.",
      width: 1600,
      height: 1600,
    },
    description: null,
    tracks: [],
    links: comingSoonLinks(),
  },
];

/** Artist-level profiles (not tied to a single release). */
export const artistProfiles: StreamingLink[] = comingSoonLinks();

/** Music videos. Empty = the TV and the Listening Room show an honest empty state. */
export const videos: Video[] = [];
