/**
 * Copy and discoveries for the homepage journey, "What’s down inside the blue house?"
 * Change any text here without touching the animation code in components/home.
 *
 * Underground tidbits are house FICTION unless commented as a true fact.
 * `sample: true` marks a placeholder and shows a small "sample" stamp.
 */

export const outsideCopy = {
  /** Shown when a visitor opens the mailbox by the path. */
  postcard: "You found the house. Now go inside.",
  /** Hero lettering, one line each. `small` lines are drawn small and handwritten. */
  title: [{ text: "Welcome to", small: true }, { text: "Sage" }, { text: "World." }] as { text: string; small?: boolean }[],
  line: "A little music. A little mystery. A lot beneath the surface.",
  /** Primary invitation (scrolls into the house). */
  cta: "Come on in.",
  /** Small scroll cue. */
  scrollCue: "Follow the sound.",
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
  /** Shown before the rug slides aside. */
  nextHint: "It wasn’t glowing yesterday.",
};

export const rugCopy = {
  line: "Every house keeps something underneath.",
  hatchCaption: "Mind the first step. And the next several.",
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
    tidbit: "Still warm. Baboo Baboo says he doesn’t drink tea.",
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
    // A true fact (not house fiction).
    tidbit: "Briz’s music explores chill lo-fi, ambient, and alternative electronic sounds. There’s room to wander between them.",
  },
  {
    id: "lantern",
    kind: "artifact",
    label: "A lantern that never ran out",
    tidbit: "Left here by someone who expected to come back.",
  },
  {
    id: "mushrooms",
    kind: "artifact",
    label: "A patch of humming mushrooms",
    tidbit: "They found the harmony before anyone found the room.",
  },
  {
    id: "creature-2",
    kind: "creature",
    label: "Two eyes in the dark",
    tidbit: "“Baboo Baboo owes me three dollars.”",
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
  "someone saved you a seat",
  "leave room for the strange",
];

export const sanctuaryCopy = {
  kicker: "The listening chamber",
  title: "Something good is buried here.",
  line: "You came all this way. Put a record on.",
  music: "Enter the Listening Room",
  lore: "Open the Archives",
  up: "A little fresh air?",
};
