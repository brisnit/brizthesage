/**
 * Lore of the blue house.
 *
 * Two different kinds of text live here. Keep them separate:
 *   - `fiction: true`  → world-building about the house. Presented as story.
 *   - `fiction: false` → real facts about Briz. Only fill these with true info.
 *
 * Items marked `sample: true` are editable placeholders and show a small
 * "sample" stamp on the site until replaced.
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
  {
    id: "house",
    title: "On the house",
    body: "The house was blue before it was a house. Nobody painted it. It just decided.",
    fiction: true,
  },
  {
    id: "companion",
    title: "On the companion",
    body: "The skeleton is not scary. He is the house’s roommate, and he is extremely bad at hide-and-seek.",
    fiction: true,
  },
  {
    id: "moon",
    title: "On the moon",
    body: "The big moon parks behind the house every night. It likes the acoustics.",
    fiction: true,
  },
  {
    id: "floor",
    title: "On the floor",
    body: "If the floorboards hum, it means the room below is listening back.",
    fiction: true,
  },
  {
    id: "clouds",
    title: "On the clouds",
    body: "The clouds have faces because they were tired of being looked at without looking back.",
    fiction: true,
  },
  {
    id: "real-1",
    title: "A true thing about Briz",
    body: "Sample lore — Briz will replace this with a real fact. Edit content/lore.ts.",
    fiction: false,
    sample: true,
  },
];

/** Copy for the Archives page (/briz-lore). */
export const archivesCopy = {
  kicker: "Briz Lore",
  title: "The Archives",
  intro: "Everything the house remembers, filed badly by a skeleton.",
  realTitle: "Real biography",
  realKicker: "Facts only",
  realPlaceholder: "Briz hasn’t filed this yet. A real biography will live here.",
  portraitCaption: "Briz the Sage, photographed in the woods with a friend.",
  exhibitsTitle: "Exhibits",
  exhibitsNote: "House lore. Captions are fiction; the pictures are details of Briz’s artwork.",
  fieldNotesTitle: "Field notes",
  fieldNotesNote: "Mostly fiction. Anything stamped “sample” is waiting for a real fact.",
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
    caption: "Photographed mid-wave. He insists this is his good side.",
    image: {
      src: "/art/skeleton-companion.jpg",
      alt: "Detail from Briz’s portrait: a turquoise cartoon skeleton grinning in a dark forest.",
      width: 423,
      height: 900,
    },
  },
  {
    id: "door",
    title: "The Front Door",
    catalogue: "No. 014 · Ochre, crooked",
    caption: "Never locked. Occasionally shy. Opens inward and, on Tuesdays, downward.",
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
    caption: "This cloud has been staring at the house for as long as anyone remembers. It won’t say why.",
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
    caption: "Hangs crooked in the living room. Straightening it does not help.",
    image: {
      src: "/art/briz-hood.jpg",
      alt: "Close crop of Briz the Sage’s portrait: wearing a hood, looking calmly at the camera.",
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
  { id: "socks", label: "Single socks", note: "Forty-one left socks. The right ones are in a different house." },
  { id: "sky", label: "Night sky odds & ends", note: "A few loose stars and a note: “back in five — the moon”.", relic: "moon" },
  { id: "buttons", label: "Buttons, unsorted", note: "Mostly buttons. One of them is a mint. Don’t check which." },
  { id: "clocks", label: "Clock repairs", note: "A pendulum, a cog, and a receipt for “one (1) extra hour”.", relic: "key" },
  { id: "letters", label: "Unsent letters", note: "“Dear moon, please stop parking on the lawn.”" },
  { id: "teeth", label: "Spare teeth (skeleton’s)", note: "Labelled “EMERGENCY SMILE”." },
  { id: "dug", label: "Things dug up", note: "Soil, a teacup, and a very small tiny-door doorknob.", relic: "record" },
  { id: "tapes", label: "Unlabelled tapes", note: "Every tape just says “the good one”." },
  { id: "weather", label: "Bottled weather", note: "A jar of fog. Do not open indoors." },
];

export const cabinetCopy = {
  title: "The Lost & Found cabinet",
  intro: "Can’t visit the house right now? The skeleton keeps duplicates of everything. Open the drawers.",
};
