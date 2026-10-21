/**
 * Lore of the blue house.
 *
 * Two different kinds of text live here. Keep them separate:
 *   - `fiction: true`  → world-building about the house. Presented as story.
 *   - `fiction: false` → real facts about Briz. Only fill these with true info.
 *
 * Items marked `sample: true` are editable placeholders and show a small
 * "sample" stamp on the site until replaced (none right now).
 */

export type LoreFragment = {
  id: string;
  title: string;
  body: string;
  fiction: boolean;
  sample?: boolean;
};

/** Fragments of house lore: used by SageNet (the old computer) and the Archives. */
export const fragments: LoreFragment[] = [
  // True facts about Briz.
  {
    id: "socal",
    title: "From Southern California",
    body: "Briz the Sage makes music from Southern California. The blue house gets its weather from somewhere else.",
    fiction: false,
  },
  {
    id: "sound",
    title: "Follow the sound",
    body: "Briz’s music explores chill lo-fi, ambient, and alternative electronic sounds. There’s room to wander between them.",
    fiction: false,
  },
  // House fiction.
  {
    id: "house",
    title: "On the house",
    body: "The house was blue before it was a house. Nobody painted it. It just decided.",
    fiction: true,
  },
  {
    id: "companion",
    title: "On Baboo Baboo",
    body: "Baboo Baboo is terrible at hide-and-seek. He keeps tapping along.",
    fiction: true,
  },
  {
    id: "moon",
    title: "On the moon",
    body: "The moon parks behind the house every night. It likes the acoustics.",
    fiction: true,
  },
  {
    id: "floor",
    title: "On the floor",
    body: "If the floorboards hum, the room below is listening back.",
    fiction: true,
  },
  {
    id: "clouds",
    title: "On the clouds",
    body: "The clouds grew faces after years of being mistaken for other things.",
    fiction: true,
  },
  {
    id: "roots",
    title: "On the roots",
    body: "The roots keep everything connected. They also keep things nobody asked them to keep.",
    fiction: true,
  },
  {
    id: "records",
    title: "On the records",
    body: "Some records belong upstairs. Some insist on being buried. Both should be handled by the edges.",
    fiction: true,
  },
];

/** The house companion: the turquoise skeleton from Briz’s portrait. */
export const companion = {
  name: "Baboo Baboo",
  username: "baboo_baboo",
  intro: "Baboo Baboo lives here. Nobody remembers inviting him, but everyone notices when he’s out.",
};

/** Copy for the Archives page (/briz-lore). */
export const archivesCopy = {
  kicker: "Briz Lore",
  title: "The Archives",
  intro: "Everything the house remembers, filed badly by Baboo Baboo.",
  realTitle: "Real biography",
  realKicker: "Facts only",
  portraitCaption: "Briz and Baboo Baboo. He heard there would be music.",
  exhibitsTitle: "Exhibits",
  exhibitsNote: "House lore. Captions are fiction; the pictures are details of Briz’s artwork.",
  companionTitle: "The house companion",
  fieldNotesTitle: "Field notes",
  fieldNotesNote: "A couple of true things about Briz, and the rest is house lore.",
};

export type Exhibit = {
  id: string;
  title: string;
  /** Fictional caption (house lore). */
  caption: string;
  catalogue: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const exhibits: Exhibit[] = [
  {
    id: "companion",
    title: "The Roommate",
    catalogue: "No. 001 · Bone, mostly",
    caption: "Baboo Baboo insists this is his good side. We have stopped debating it.",
    image: {
      src: "/art/skeleton-companion.jpg",
      alt: "Detail from Briz’s artist portrait: Baboo Baboo, a turquoise cartoon skeleton, grinning in a dark forest.",
      width: 423,
      height: 900,
    },
  },
  {
    id: "door",
    title: "The Front Door",
    catalogue: "No. 014 · Ochre, crooked",
    caption: "Usually opens inward. Tuesdays require some flexibility.",
    image: {
      src: "/art/house-door-detail.jpg",
      alt: "Detail from the What Up World cover: an ornate golden doorway set into a turquoise wall.",
      width: 900,
      height: 810,
    },
  },
  {
    id: "cloud",
    title: "A Cloud, Watching",
    catalogue: "No. 027 · Vapour, opinionated",
    caption: "It came for one song. That was several years ago.",
    image: {
      src: "/art/cloud-face-detail.jpg",
      alt: "Detail from the What Up World cover: a pink cloud with a sly face.",
      width: 677,
      height: 800,
    },
  },
  {
    id: "hood",
    title: "Portrait of the Resident",
    catalogue: "No. 033 · Hood up",
    caption: "The frame hangs crooked. Briz appears comfortable with the arrangement.",
    image: {
      src: "/art/briz-hood.jpg",
      alt: "Close crop of Briz the Sage’s artist portrait: wearing a hood, looking calmly ahead.",
      width: 640,
      height: 640,
    },
  },
];

/**
 * The Lost & Found cabinet on the Archives page: an accessible way to find
 * every relic without replaying the homepage. Drawers with a `relic` hold it.
 */
export type Drawer = {
  id: string;
  label: string;
  /** Shown when opened (for drawers without a relic, or after the relic is taken). */
  note: string;
  relic?: "moon" | "key" | "record";
};

export const drawers: Drawer[] = [
  { id: "socks", label: "Single socks", note: "One sock. No promising leads." },
  { id: "sky", label: "Night sky odds & ends", note: "Something you thought you’d lost. Give it a minute.", relic: "moon" },
  { id: "buttons", label: "Buttons, unsorted", note: "A button from a coat nobody remembers owning." },
  { id: "clocks", label: "Clock repairs", note: "A small silence. Please close gently.", relic: "key" },
  { id: "letters", label: "Unsent letters", note: "An unsent letter addressed to “When you’re ready.”" },
  // A plain note, not a relic: relics always arrive with their art and a “Relic found” message.
  { id: "spare-keys", label: "Spare keys", note: "A spare key labeled “probably.”" },
  { id: "dug", label: "Things dug up", note: "An apology. Still folded.", relic: "record" },
  { id: "receipts", label: "Receipts", note: "A receipt for three dollars. Interesting." },
  { id: "weather", label: "Bottled weather", note: "Thursday’s weather, bottled badly." },
];

export const cabinetCopy = {
  title: "The Lost & Found cabinet",
  intro: "Can’t visit the house right now? Baboo Baboo keeps duplicates of everything. Open the drawers.",
};
