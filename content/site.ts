/**
 * Site-wide settings and REAL artist facts.
 *
 * Anything in `artist` is presented on the site as fact, so only put true
 * information here. Leave a field as `null` and the UI shows an honest
 * "coming soon" state instead of inventing something.
 */

export const site = {
  name: "BRIZ THE SAGE",
  shortName: "Briz the Sage",
  tagline: "There’s more beneath the surface.",
  description:
    "Step into the blue house. The official home of BRIZ THE SAGE: music, curiosities, and whatever lives under the floor.",
  /** Set this to the deployed domain (used for social previews). */
  url: "https://brizthesage.com",
};

export type SocialLink = {
  label: string;
  /** null = not provided yet; rendered as a disabled "coming soon" item. */
  url: string | null;
};

export const artist = {
  /** Real biography. Leave null until Briz writes one; the Archives show a placeholder. */
  bio: null as string | null,
  /** Booking / contact email. null hides the contact line. */
  contactEmail: null as string | null,
  socials: [
    { label: "Instagram", url: null },
    { label: "TikTok", url: null },
    { label: "YouTube", url: null },
  ] satisfies SocialLink[] as SocialLink[],
};

export const navItems = [
  { href: "/", label: "Home", room: "The Blue House" },
  { href: "/music", label: "Music", room: "The Listening Room" },
  { href: "/merch", label: "Merch", room: "The Curiosity Shop" },
  { href: "/briz-lore", label: "Briz Lore", room: "The Archives" },
] as const;
