/**
 * The rotary phone conversation. A tiny branching script.
 * A line is either something the voice says (a string) or a narration beat.
 * `next: null` hangs up. After the "advice" line, the phone adds riddles for
 * relics the visitor hasn’t found yet (from content/game.ts), so its hints
 * always match the real puzzle.
 */

export type PhoneLine = string | { narration: string };

export type PhoneNode = {
  lines: PhoneLine[];
  options: { label: string; next: string | null }[];
};

const options = [
  { label: "Who is this?", next: "who" },
  { label: "What’s downstairs?", next: "downstairs" },
  { label: "Is Baboo Baboo here?", next: "baboo" },
  { label: "Any advice?", next: "advice" },
  { label: "Hang up", next: null },
];
const without = (id: string) => options.filter((o) => o.next !== id);

export const phoneScript: Record<string, PhoneNode> = {
  start: {
    lines: [{ narration: "The phone rings once. You are fairly sure you picked it up first." }, "Oh, good. You found the house."],
    options,
  },
  who: { lines: ["I’m downstairs."], options: without("who") },
  downstairs: { lines: ["Depends how far you go."], options: without("downstairs") },
  baboo: { lines: ["Listen for the tapping. He thinks he’s being quiet."], options: without("baboo") },
  advice: { lines: ["Listen first. Open a few drawers. And leave the porch light on."], options: without("advice") },
};

export const phoneCopy = {
  title: "The rotary phone",
  hangUp: "A soft click. Somewhere below you, another phone starts ringing.",
  dialPrompt: "Or dial a number",
  missingIntro: "Oh, and the house is missing a few things:",
  wrongNumber: ["Brrrr… nobody picks up.", "A dial tone that sounds a little like laughing.", "“Wrong house.” Click."],
  allFound: "You have all three relics. Lay them out in the Archives. Then call me back.",
};
