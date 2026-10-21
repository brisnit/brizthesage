/**
 * "THE HOUSE REMEMBERS" — game content and rules.
 *
 * All game text lives here so it can be rewritten without touching logic.
 * The puzzle logic (components/game, lib/gameStore) reads:
 *   - relics[].id         stable ids (don't rename after launch: saved progress uses them)
 *   - solution            the correct activation order
 *   - secretNumber        what to dial on the rotary phone for the bonus secret
 *
 * The solution must be inferable from the three `clue` lines. If you change
 * the order, rewrite the clues so they still point to it.
 */

export type RelicId = "moon" | "key" | "record";

export type Relic = {
  id: RelicId;
  name: string;
  /** Where it hides in the homepage (shown after finding, and as a hint on Briz Lore). */
  whereHome: string;
  /** Short riddle shown on Briz Lore before the relic is found. */
  riddle: string;
  /** Revealed on discovery. Describes the object, including its number. */
  description: string;
  /** Revealed on discovery. Together, the three clues define the order. */
  clue: string;
  /** The number the relic carries (used by the phone secret). */
  number: string;
};

export const relics: Relic[] = [
  {
    id: "moon",
    name: "The Small Moon",
    whereHome: "Outside, drifting near the big moon.",
    riddle: "The big moon has a little sibling who never stays still.",
    description: "A tiny brass moon, warm as a teacup. “III” is scratched into the back.",
    clue: "The moon always comes up last.",
    number: "3",
  },
  {
    id: "key",
    name: "The Seven-Tooth Key",
    whereHome: "In the living room, behind the odd clock’s pendulum.",
    riddle: "Ask the clock what time it is. Ask nicely.",
    description: "A brass key with exactly seven teeth. It hums when held near doors.",
    clue: "Nothing in this house plays until something is unlocked.",
    number: "7",
  },
  {
    id: "record",
    name: "The Buried 45",
    whereHome: "Under the house, pressed into the soil among the old records.",
    riddle: "Deep in the dirt, one record still spins.",
    description: "A 45 that keeps turning on its own, with no player anywhere near it.",
    clue: "The record plays in the middle of the night: after the door, before the moon.",
    number: "45",
  },
];

/** Correct activation order. Derived from the clues above. */
export const solution: RelicId[] = ["key", "record", "moon"];

/** Progressive hints for the final puzzle, gentlest first. */
export const hints: string[] = [
  "Read all three clues side by side. Each one talks about a place in line.",
  "Something has to be unlocked before anything can play.",
  "Key first. The record goes in the middle. The moon comes up last.",
];

export const puzzleCopy = {
  title: "The House Remembers",
  intro:
    "The house has misplaced three things. Baboo Baboo remembers seeing them. His account changes slightly each time.",
  /** Shown once at least one relic has been found. */
  progress: "The house remembers a little more.",
  savedNote: "Your progress is saved in this browser, on this device only.",
  hintInvite: "Need a nudge?",
  wrong: "Not quite. The house hums politely and waits.",
  missing: "The house is still missing something. Find all three relics first.",
  solved: "There you are.",
  solvedLines: ["The house knew you’d find them.", "Baboo Baboo says he helped."],
};

/** Text drawn on the personalised Explorer Card. */
export const explorerCardCopy = {
  title: "SAGE WORLD",
  subtitle: "EXPLORER",
  /** Used when the visitor leaves the name blank. */
  defaultName: "A Curious Visitor",
  lines: ["Found the door.", "Followed the sound.", "Remembered the way back."],
  /** Button that saves the card and the wallpapers. */
  collect: "Collect your keepsakes.",
};

/**
 * Bonus secret: dial this on the living-room rotary phone.
 * Built from the relic numbers, in solution order: key (7) · record (45) · moon (3).
 */
export const secretNumber = solution
  .map((id) => relics.find((r) => r.id === id)!.number)
  .join("");

export const secretCall = {
  hintOnPhone: "Every relic carries a number. Dial them in the order the house wakes up.",
  lines: [
    "…oh. You actually figured it out.",
    "The house says thanks for visiting the basement.",
    "Your Explorer Card now carries the Night Line stamp. Check the Archives.",
  ],
};

/**
 * THE REWARD
 * ----------
 * IMPORTANT: this game runs entirely in the visitor’s browser. Anyone can read
 * these URLs in the page source. Never put anything here that must stay
 * secret, be limited, or be redeemed once (paid tracks, limited coupons…).
 * Those need server-side validation (e.g. an API route that checks a signed
 * token and records redemption) — see README "Replacing the reward".
 *
 * Swap the active reward by changing `reward` to another variant.
 */
export type Reward =
  | {
      kind: "download";
      title: string;
      description: string;
      files: { label: string; href: string; filename: string; note: string }[];
      /** Show the in-browser personalised Explorer Card generator. */
      explorerCard: boolean;
    }
  | {
      kind: "track";
      title: string;
      description: string;
      /** A public, non-sensitive preview URL only. */
      audioSrc: string;
      downloadHref: string | null;
    }
  | {
      kind: "discount";
      title: string;
      description: string;
      /** Public code only — anyone can see it. Use for open promos, not limited ones. */
      code: string;
      shopUrl: string;
    };

export const reward: Reward = {
  kind: "download",
  title: "Take a little of the house with you.",
  description:
    "Two original Sage World wallpapers, plus an Explorer Card with your name on it.",
  files: [
    {
      label: "Phone wallpaper",
      href: "/rewards/blue-house-wallpaper-phone.png",
      filename: "blue-house-wallpaper-phone.png",
      note: "1290 × 2796 PNG",
    },
    {
      label: "Desktop wallpaper",
      href: "/rewards/blue-house-wallpaper-desktop.png",
      filename: "blue-house-wallpaper-desktop.png",
      note: "2560 × 1600 PNG",
    },
  ],
  explorerCard: true,
};
