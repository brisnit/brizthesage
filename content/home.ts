/**
 * Copy and discoveries for the homepage journey, "What’s down inside the blue house?"
 * Change any text here without touching the animation code in components/home.
 *
 * Underground tidbits are house FICTION unless marked `sample: true`, which
 * means "placeholder for a real Briz fact": they show a small "sample" stamp.
 */

export const outsideCopy = {
  kicker: "You found the house.",
  title: ["BRIZ", "THE", "SAGE"],
  line: "There’s more beneath the surface.",
  cta: "Scroll into the blue house",
  listen: "Listen",
};

export const approachCopy = {
  whispers: ["Mind the moss.", "Somebody left the light on."],
  doorLine: "Come in. Wipe your feet. Or don’t.",
};

export const roomCopy = {
  kicker: "The living room",
  title: "Make yourself strange.",
  hint: "Things that glow do things.",
  directoryTitle: "Explore the room",
  directoryNote: "Same doors, fewer cobwebs.",
  nextHint: "Something is glowing under the rug.",
};

export const rugCopy = {
  line: "Every house keeps something underneath.",
  /** Shown on the hatch button in simplified mode. */
  hatchLabel: "Open the hatch",
};

export type UndergroundFind = {
  id: string;
  kind: "door" | "artifact" | "creature";
  /** Accessible name for the button. */
  label: string;
  /** Revealed on interaction. */
  tidbit: string;
  sample?: boolean;
};

export const undergroundCopy = {
  depthMarkers: ["2 ft down", "9 ft down", "Deeper than the plumbing", "Nobody measured this far"],
  intro: "Down here, things keep a little light for themselves.",
};

/** Clickable discoveries under the house (positions are set in the scene component). */
export const undergroundFinds: UndergroundFind[] = [
  {
    id: "door-1",
    kind: "door",
    label: "A tiny door in the roots",
    tidbit: "Closed for rehearsal. Please knock in 4/4.",
  },
  {
    id: "teacup",
    kind: "artifact",
    label: "A buried teacup",
    tidbit: "Still warm. Nobody knows whose it is. Nobody is asking.",
  },
  {
    id: "creature-1",
    kind: "creature",
    label: "Something peeking from a tunnel",
    tidbit: "“Don’t mind me. I’m just the bassline.”",
  },
  {
    id: "door-2",
    kind: "door",
    label: "A tiny door with a mail slot",
    tidbit: "Sample lore — a real fact about Briz goes here. Edit content/home.ts.",
    sample: true,
  },
  {
    id: "lantern",
    kind: "artifact",
    label: "A lantern that never ran out",
    tidbit: "The mushrooms down here hum. Nobody remembers tuning them.",
  },
  {
    id: "creature-2",
    kind: "creature",
    label: "Two eyes in the dark",
    tidbit: "“The skeleton owes me three dollars.”",
  },
];

/**
 * Floating paper scraps. These are house world-building, NOT song lyrics.
 * When real lyric lines are approved, replace them here.
 */
export const scraps: string[] = [
  "keep the porch light on",
  "the moon is listening",
  "turn it over, side B",
  "dig a little deeper",
];

export const sanctuaryCopy = {
  kicker: "The listening chamber",
  title: "Something good is buried here.",
  line: "You came all this way. Put a record on.",
  music: "Enter the Listening Room",
  lore: "Open the Archives",
  up: "Float back up",
};
