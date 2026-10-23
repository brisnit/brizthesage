/**
 * "The Open Ear" — the hidden trail to Briz the Sage's sanctuary.
 *
 * Everything a visitor needs is inside the site; difficulty comes from noticing
 * and connecting details. The trail is gated in order (a step only counts once
 * the previous one is done), so each clue has exactly one answer.
 *
 *   0 → 1  Living room: look at the crooked portrait twice. Its eyes slide
 *          toward the old computer.
 *   1 → 2  The computer’s SageNet guestbook: Baboo Baboo left his record
 *          “where the house keeps its weather” → Archives › Lost & Found ›
 *          “Bottled weather”: “The moon remembers the first sound.”
 *   2 → 3  Homepage: the small carved crater on the big moon. Its inscription
 *          points to “the little wooden box that spins small black moons”.
 *   3 → 4  Living room: a paper tag appears under the record player:
 *          turn out the lamp and look at the wallpaper.
 *   4 → 5  With the lamp off, a doorway glows in the wallpaper. Open it.
 *
 * This file is fiction (house lore). It’s an Easter egg, not a security boundary.
 */

export const HUNT_PATH = "/open-ear";

export const huntCopy = {
  portrait: {
    /** The portrait’s caption once the first step is found. */
    caption: "Even a painted face has somewhere it would rather be.",
    /** First look: an ordinary reaction, with a nudge to look again. */
    firstLook: "The portrait pretends it wasn’t staring. You get the feeling you should look again.",
    /** Second look: the clue, in words as well as motion (for keyboard, screen-reader and reduced-motion visitors). */
    reveal:
      "Its painted eyes slide toward the old computer, linger there, and slide back. The caption under the frame has changed: “Even a painted face has somewhere it would rather be.”",
  },
  /** Replaces Baboo Baboo’s line in the SageNet guestbook (an existing note). */
  guestbook: "who moved my record. i left it where the house keeps its weather. you know which one.",
  weather: {
    reveal: "Inside the fog: Baboo Baboo’s missing record, with a paper tag tied to it.",
    tag: "The moon remembers the first sound.",
  },
  moon: {
    label: "A small carved crater on the moon",
    title: "A crater on the moon",
    sealed: "A small crater, worn smooth. Something is carved inside it, too faint to read. Maybe the moon is waiting for the right question.",
    inscription: [
      "Carved in the crater, in very old, very round handwriting:",
      "“I heard the first sound in this house. It came from the little wooden box that spins small black moons. Look underneath it.”",
    ],
  },
  recordTag: {
    label: "A paper tag tucked under the record player",
    title: "Under the record player",
    lines: [
      "Taped underneath, in Baboo Baboo’s handwriting:",
      "“The house has one door it only shows in the dark. Turn out the lamp, then look for it in the wallpaper.”",
    ],
  },
  door: {
    label: "A doorway outlined in the wallpaper: step through",
    appears: "With the lamp off, a doorway glows faintly in the wallpaper.",
    threshold: "Welcome, pilgrim.",
  },
  /** Understated way back for visitors who already found it (site footer). */
  returnLabel: "Return to the hidden Sage",
};

/**
 * Baboo Baboo’s hints, by how far along the visitor is. Each request reveals
 * the next line for the current step (saved), from cryptic to a plain next action.
 */
export const huntHints: string[][] = [
  [
    "Baboo Baboo grabs the receiver. “Oh, you’re looking for HIM. Everyone is. Start small: the paintings in this house get bored.”",
    "“The crooked one in the living room. Don’t just glance at it. Paintings need a second look.”",
    "“Select the crooked portrait in the living room twice, then read what happens.”",
  ],
  [
    "“The portrait was looking at something with a screen.”",
    "“The old computer has a guestbook. I signed it. Read what I wrote.”",
    "“My note says the record is where the house keeps its weather: open the ‘Bottled weather’ drawer in the Lost & Found cabinet in the Archives (Briz Lore).”",
  ],
  [
    "“The moon is old. It remembers things. You’ve seen it from outside.”",
    "“Go back outside, to the very start. The big moon has a little crater with something carved in it.”",
    "“On the homepage, select the small carved crater on the big moon, just below the title.”",
  ],
  [
    "“Black moons spin on a little wooden box. You know the one.”",
    "“It’s the record player. Look under it, not on it.”",
    "“In the living room, select the paper tag tucked under the record player.”",
  ],
  [
    "“Some doors are shy. They like the dark.”",
    "“The lamp. Click.”",
    "“Turn off the living-room lamp, then select the doorway that glows in the wallpaper.”",
  ],
  ["“You already found him. There’s a tiny gold ear at the very bottom of every page. It’s yours.”"],
];

/* ------------------------------------------------------------------ */
/* The sanctuary                                                       */
/* ------------------------------------------------------------------ */

export const sanctumCopy = {
  kicker: "The Open Ear",
  title: "Welcome, pilgrim.",
  intro:
    "You found the secret sanctuary of Briz the Sage: music, smoke, jewels, strange wisdom, and one very good dog. Everything here is house lore.",
  sealed: {
    title: "A door with no handle.",
    line: "Whatever is behind it isn’t ready for you yet. The house usually knows best.",
    back: "Back to the blue house",
  },
  throneTitle: "The Throne of Unnecessary Grandeur",
  throneNote:
    "Briz the Sage, keeper of the house, cosmic musician, wizard of moderate volume. Oliver is beside him, as always.",
  oliverCaption: "Oliver has heard all of this before. He still believes in you.",
  reset: "Forget the way here",
  resetConfirm: "Forget the trail? You’ll have to find the door again.",
  resetDone: "Forgotten. The door has politely closed behind you.",
};

export const askCopy = {
  title: "Ask the Sage",
  label: "An imaginative AI version of Briz the Sage.",
  disclaimer:
    "Answers come from an AI character, not the real Briz. Its musings are fiction; facts about his music come from this site. Nothing you type is saved by this site.",
  greeting: [
    "You found me. Oliver thought you might.",
    "What have you brought with you: a question, a worry, or something wonderfully strange?",
  ],
  suggestions: [
    "What is briz-izm?",
    "How do I find my creative spark?",
    "What should I listen to tonight?",
    "Why does Baboo Baboo owe everyone three dollars?",
    "What does Oliver know?",
  ],
  maxLength: 500,
  demoTitle: "House tales",
  demoNote:
    "The Sage’s live voice isn’t connected here yet, so these are a few house tales written in advance. Pick a question to hear one.",
};

/** Authored answers for the demo mode (no AI provider configured). Fiction, plus real music facts from the site. */
export const houseTales: Record<string, string> = {
  "What is briz-izm?":
    "Briz-izm is less a belief and more a habit of listening. Follow the sound. Leave room for the strange. Make the thing before you judge it. Rest, because rest is part of the rhythm. And when in doubt, assume Oliver is right. It is all written, slightly crookedly, in the Book of Briz-izm on the lectern.",
  "How do I find my creative spark?":
    "Sparks are shy. They don’t come when called; they come when you’re already moving. Make something small and a little bad tonight. Hum into your phone, draw the lamp, write one sentence. The house is full of half-finished things and it’s the happiest house I know.",
  "What should I listen to tonight?":
    "If the night is long, put on What Up World, my 2023 album: eight songs, about twenty minutes. Start with “Between the Moon and Mars” if you’re looking out a window, or “This is Life” if you’re starting over. The Listening Room upstairs has a turntable that will play it for you.",
  "Why does Baboo Baboo owe everyone three dollars?":
    "Nobody remembers lending it. Everybody remembers being owed it. That’s how you know it’s a real debt. My advice: never ask for it back. The day he pays, the house will lose a great mystery and gain only three dollars.",
  "What does Oliver know?":
    "Everything important and nothing complicated. Where the warm spots are. When it’s time to stop working. Which visitors are kind. He has heard every speech I’ve made from this throne and he still wags. I take that as the highest review available.",
};

/* ------------------------------------------------------------------ */
/* The Book of Briz-izm                                                */
/* ------------------------------------------------------------------ */

export type BookPage = {
  n: string;
  principle: string;
  gloss: string;
  /** A small optional discovery in the margin. */
  margin: { label: string; note: string };
  /** Which hidden doodle to reveal on this page. */
  doodle: "ear" | "moon" | "hands" | "door" | "rest" | "oliver";
};

export const bookPages: BookPage[] = [
  {
    n: "I",
    principle: "Follow the sound.",
    gloss: "When you don’t know where to go, go toward whatever is humming.",
    margin: { label: "A note in the margin", note: "(Baboo Baboo has added: “unless it’s the fridge”.)" },
    doodle: "ear",
  },
  {
    n: "II",
    principle: "Leave room for the strange.",
    gloss: "Every good song has one note that shouldn’t work. Keep it.",
    margin: { label: "A pressed flower", note: "Pressed between these pages: a flower that grew under the house, in the dark, out of spite." },
    doodle: "moon",
  },
  {
    n: "III",
    principle: "Make something before you judge it.",
    gloss: "A rough draft can’t be wrong. It can only be early.",
    margin: { label: "A coffee ring", note: "A coffee ring, perfectly round. The Sage insists it was intentional. Oliver disagrees." },
    doodle: "hands",
  },
  {
    n: "IV",
    principle: "Be kind to whoever finds the door after you.",
    gloss: "Leave the light on. Leave a hint. Leave the good chair.",
    margin: { label: "A list of names", note: "A list of every pilgrim who found the door. It’s blank. The Sage says it’s ‘very exclusive’." },
    doodle: "door",
  },
  {
    n: "V",
    principle: "Rest is part of the rhythm.",
    gloss: "The silence between beats is still music. Sit in it sometimes.",
    margin: { label: "A tiny snore", note: "Someone has written ‘zzz’ very small in the corner. The handwriting is suspiciously paw-shaped." },
    doodle: "rest",
  },
  {
    n: "VI",
    principle: "Oliver is probably right.",
    gloss: "If the dog is relaxed, the situation is fine. Adjust accordingly.",
    margin: { label: "A paw print", note: "A single paw print in gold ink. Every copy of the book has one. Nobody has seen him do it." },
    doodle: "oliver",
  },
];

/* ------------------------------------------------------------------ */
/* Cabinet of curious artifacts                                        */
/* ------------------------------------------------------------------ */

export const artifacts: { id: string; name: string; note: string; art: "staff" | "jar" | "bills" | "fork" | "ball" | "map" | "bell" | "jewel" }[] = [
  { id: "staff", name: "The Staff of Moderate Volume", note: "It can summon thunder, but only at a neighbourly level.", art: "staff" },
  { id: "jar", name: "A Jar of Unfinished Melodies", note: "Open it and you hear the first four bars of something great. Close it before it gets embarrassed.", art: "jar" },
  { id: "bills", name: "The First Three Dollars (disputed)", note: "Baboo Baboo says these are his. Baboo Baboo says everything is his.", art: "bills" },
  { id: "fork", name: "A Tuning Fork That Only Plays Kindness", note: "Strike it and it hums a note that makes people apologize for things they didn’t do.", art: "fork" },
  { id: "ball", name: "Oliver’s Spare Ball", note: "Kept under glass for emergencies. There have been many emergencies.", art: "ball" },
  { id: "map", name: "A Map of the House (incomplete, on purpose)", note: "The blank parts are for rooms that haven’t been imagined yet.", art: "map" },
  { id: "bell", name: "The Pilgrim’s Bell", note: "It rings once for every visitor who finds the door. It is very quiet. It is ringing now.", art: "bell" },
  { id: "jewel", name: "A Jewel That Glows When Someone Hums", note: "Try it. Nobody’s watching. (Oliver is watching.)", art: "jewel" },
];

export const oliverActions: { id: string; label: string; caption: string }[] = [
  { id: "pat", label: "Pat Oliver", caption: "One ear flicks. The tail approves." },
  { id: "biscuit", label: "Offer a biscuit", caption: "Accepted with great dignity, then immediately with no dignity at all." },
  { id: "ask", label: "Ask Oliver for advice", caption: "He looks at you, then at the warm spot by the throne. Rest is part of the rhythm." },
];

/* ------------------------------------------------------------------ */
/* The Pilgrim’s keepsake                                              */
/* ------------------------------------------------------------------ */

export const keepsakeCopy = {
  title: "The Pilgrim’s Keepsake",
  intro: "Pledge yourself to briz-izm, if you like. Your name stays in this browser.",
  heading: "THE ORDER OF THE OPEN EAR",
  body: ["Let it be known that", "{name}", "found the hidden Sage,", "followed the sound,", "and pledged to leave room for the strange."],
  closing: ["Witnessed by Briz the Sage.", "Approved by Oliver.", "Filed incorrectly by Baboo Baboo."],
  defaultName: "A Curious Pilgrim",
  skip: "No thanks, just looking",
};
