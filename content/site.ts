/**
 * Site-wide settings and REAL artist facts.
 *
 * Briz the Sage is the artist. Sage World is the place visitors explore.
 * Anything in `artist` is presented on the site as fact, so only put true
 * information here. Leave a field empty and the site simply hides it.
 */

export const site = {
  /** The artist name, used in the logo, browser title, footer and sharing. */
  name: "Briz the Sage",
  world: "Sage World",
  title: "Briz the Sage — Welcome to Sage World",
  description:
    "Step inside the blue house. Discover music, curious objects, and a few things nobody remembers putting there.",
  /**
   * The final domain is not confirmed yet. Set it (e.g. "https://example.com")
   * once it is, so link previews use absolute URLs.
   */
  url: null as string | null,
};

export type SocialLink = { label: string; url: string };

export const artist = {
  /** Real biography, one string per paragraph. */
  bio: [
    "Briz the Sage is a Southern California music artist exploring chill lo-fi, ambient soundscapes, and alternative electronic music. His music makes room for drifting thoughts, quiet discoveries, and wherever your imagination takes you.",
    "Sage World brings that spirit into a place you can explore—a strange blue house full of sound, curious characters, and little mysteries. Come inside, find something to listen to, and stay as long as you like.",
  ],
  /** Short biography for smaller placements (footer, Listening Room). */
  shortBio:
    "Briz the Sage creates chill lo-fi, ambient, and alternative electronic music from Southern California. Music for wandering a little further into your imagination.",
  /** Public contact or booking email. null keeps it hidden. */
  contactEmail: null as string | null,
  /** Social profiles. Only add real, confirmed URLs; nothing shows until then. */
  socials: [] as SocialLink[],
};

export const navItems = [
  { href: "/", label: "Home", room: "The Blue House" },
  { href: "/music", label: "Music", room: "The Listening Room" },
  { href: "/merch", label: "Merch", room: "The Curiosity Shop" },
  { href: "/briz-lore", label: "Briz Lore", room: "The Archives" },
] as const;
