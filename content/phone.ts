/**
 * The rotary phone conversation. A tiny branching script.
 * `next: null` hangs up. The special node "clues" is filled in at runtime
 * with riddles for relics the visitor hasn’t found yet.
 */

export type PhoneNode = {
  lines: string[];
  options: { label: string; next: string | null }[];
};

export const phoneScript: Record<string, PhoneNode> = {
  start: {
    lines: ["…hello?", "Oh. Hm. The phone probably isn’t for you."],
    options: [
      { label: "Who is this?", next: "who" },
      { label: "Is anyone home?", next: "home" },
      { label: "Any advice?", next: "clues" },
      { label: "Hang up", next: null },
    ],
  },
  who: {
    lines: ["The house. I pick up when it gets quiet.", "Don’t tell the skeleton. He thinks he’s the receptionist."],
    options: [
      { label: "Is anyone home?", next: "home" },
      { label: "Any advice?", next: "clues" },
      { label: "Hang up", next: null },
    ],
  },
  home: {
    lines: ["Someone’s always home. Mostly underneath.", "Keep scrolling. The rug is not as flat as it looks."],
    options: [
      { label: "Who is this?", next: "who" },
      { label: "Any advice?", next: "clues" },
      { label: "Hang up", next: null },
    ],
  },
  clues: {
    lines: [],
    options: [
      { label: "Who is this?", next: "who" },
      { label: "Hang up", next: null },
    ],
  },
};

export const phoneCopy = {
  title: "The rotary phone",
  dialPrompt: "Or dial a number",
  wrongNumber: ["Brrrr… nobody picks up.", "A dial tone that sounds a little like laughing.", "“Wrong house.” Click."],
  allFound: "You have all three relics. Lay them out in the Archives. Then call me back.",
};
