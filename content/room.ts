/**
 * Living-room objects and composition.
 *
 * Each object is placed in percentages of the room canvas (x/y = top-left
 * corner, w = width; height follows the drawing's own proportions):
 *   - desktop: one wide room, 16:10 (160 x 100 units). The top-left wall is
 *              kept clear: the intro copy sits there on wide screens.
 *   - phones:  a tall split-level room, 1:3 (100 x 300 units), in three
 *              staggered levels joined by stairs
 * The canvas scrolls with the page, so objects keep a generous size instead
 * of shrinking to fit the screen. Change labels, captions and destinations here.
 */

import type { RelicId } from "./game";

export type RoomDialog = "phone" | "tv" | "computer";

export type RoomAction =
  | { type: "link"; href: string }
  | { type: "dialog"; dialog: RoomDialog }
  | { type: "relic"; relic: RelicId; quip: string }
  | { type: "quip"; lines: string[] };

export type Placement = { x: number; y: number; w: number };

/**
 * Room levels, in % of canvas height: where the wood paneling starts, where
 * the floor starts (furniture stands on this line) and where the level ends.
 * Between levels on phones, a ledge and a short staircase lead down.
 */
export type RoomLevel = { wainscot: number; floor: number; end: number };
export const roomLevels: { desktop: RoomLevel[]; mobile: RoomLevel[] } = {
  desktop: [{ wainscot: 50, floor: 74, end: 100 }],
  mobile: [
    { wainscot: 20, floor: 29.33, end: 33.33 },
    { wainscot: 45, floor: 57.33, end: 61.33 },
    { wainscot: 71.67, floor: 88, end: 100 },
  ],
};

export type RoomDecorId = "window" | "photo" | "shelf" | "hanger" | "books" | "records" | "candles" | "slippers" | "stairs-1" | "stairs-2";

/** Non-interactive set dressing. `mobile: null` hides it on phones (and `desktop: null` on desktop). */
export const roomDecor: { id: RoomDecorId; desktop: Placement | null; mobile: Placement | null }[] = [
  { id: "window", desktop: { x: 44, y: 16, w: 8.75 }, mobile: { x: 42, y: 63.67, w: 14 } },
  { id: "photo", desktop: { x: 67.5, y: 28, w: 5.6 }, mobile: { x: 20, y: 65.33, w: 13 } },
  { id: "shelf", desktop: { x: 87.5, y: 38, w: 10.6 }, mobile: { x: 34, y: 37.33, w: 40 } },
  { id: "hanger", desktop: { x: 57.5, y: 0, w: 3.1 }, mobile: { x: 88, y: 35.33, w: 8 } },
  { id: "books", desktop: { x: 16.6, y: 68.5, w: 3.1 }, mobile: null },
  { id: "records", desktop: { x: 63.4, y: 67.7, w: 2.2 }, mobile: { x: 48, y: 84.4, w: 6 } },
  { id: "candles", desktop: { x: 70, y: 85.6, w: 2.5 }, mobile: { x: 38, y: 84.27, w: 7 } },
  { id: "slippers", desktop: { x: 60, y: 93, w: 3.75 }, mobile: { x: 60, y: 58.67, w: 12 } },
  { id: "stairs-1", desktop: null, mobile: { x: 2, y: 33.67, w: 22 } },
  { id: "stairs-2", desktop: null, mobile: { x: 76, y: 61.67, w: 22 } },
];

export type RoomObjectId =
  | "record-player"
  | "trunk"
  | "bookcase"
  | "phone"
  | "tv"
  | "computer"
  | "clock"
  | "portrait"
  | "sofa"
  | "lamp"
  | "plant";

export type RoomObject = {
  id: RoomObjectId;
  /** Accessible name: what it is and what it does. */
  label: string;
  /** Short caption shown on hover/focus. */
  caption: string;
  action: RoomAction;
  /** Listed in the "Explore the room" directory. */
  inDirectory: boolean;
  desktop: Placement;
  mobile: Placement;
};

export const roomObjects: RoomObject[] = [
  {
    id: "bookcase",
    label: "Bookcase with a glowing book: go to Briz Lore",
    caption: "A few things the house remembers.",
    action: { type: "link", href: "/briz-lore" },
    inDirectory: true,
    desktop: { x: 2.5, y: 31.6, w: 13.75 },
    mobile: { x: 4, y: 6.23, w: 36 },
  },
  {
    id: "portrait",
    label: "A crooked portrait",
    caption: "It was looking at you a second ago.",
    action: {
      type: "quip",
      lines: ["The portrait pretends it wasn’t staring.", "“Nice shoes.”", "It winks. Portraits shouldn’t wink."],
    },
    inDirectory: false,
    desktop: { x: 34, y: 18, w: 8.1 },
    mobile: { x: 58, y: 0.33, w: 24 },
  },
  {
    id: "clock",
    label: "An odd clock with a swinging pendulum",
    caption: "It has never once told the right time.",
    action: {
      type: "relic",
      relic: "key",
      quip: "The pendulum swings wide… and something brass falls out.",
    },
    inDirectory: false,
    desktop: { x: 18.1, y: 30, w: 4.4 },
    mobile: { x: 43, y: 1.67, w: 12 },
  },
  {
    id: "lamp",
    label: "Amber floor lamp: switch it on or off",
    caption: "Click. Click.",
    action: { type: "quip", lines: ["Click.", "Click.", "It flickers like it has an opinion."] },
    inDirectory: false,
    desktop: { x: 26.25, y: 42.7, w: 5 },
    mobile: { x: 43, y: 13.7, w: 12 },
  },
  {
    id: "sofa",
    label: "A worn velvet sofa",
    caption: "Someone saved you a seat.",
    action: {
      type: "quip",
      lines: ["Someone saved you a seat.", "You find 41 cents and a guitar pick.", "The cushion sighs."],
    },
    inDirectory: false,
    desktop: { x: 32.5, y: 70, w: 25 },
    mobile: { x: 22, y: 47.33, w: 60 },
  },
  {
    id: "tv",
    label: "CRT television: watch videos",
    caption: "Adjust the antenna. Lower your expectations.",
    action: { type: "dialog", dialog: "tv" },
    inDirectory: true,
    desktop: { x: 65, y: 50.8, w: 10.6 },
    mobile: { x: 62, y: 72.53, w: 34 },
  },
  {
    id: "record-player",
    label: "Record player: go to the Listening Room",
    caption: "Something worth turning over.",
    action: { type: "link", href: "/music" },
    inDirectory: true,
    desktop: { x: 77.5, y: 52.2, w: 10 },
    mobile: { x: 4, y: 73.47, w: 32 },
  },
  {
    id: "phone",
    label: "Rotary telephone: pick up the receiver",
    caption: "The phone probably isn’t for you.",
    action: { type: "dialog", dialog: "phone" },
    inDirectory: true,
    desktop: { x: 19.5, y: 76.2, w: 6.25 },
    mobile: { x: 3, y: 48.33, w: 17 },
  },
  {
    id: "computer",
    label: "Old beige computer: log on to SageNet",
    caption: "You have one new mystery.",
    action: { type: "dialog", dialog: "computer" },
    inDirectory: true,
    desktop: { x: 89.4, y: 53, w: 8.75 },
    mobile: { x: 57, y: 11.33, w: 36 },
  },
  {
    id: "trunk",
    label: "A mysterious trunk: go to the Curiosity Shop (merch)",
    caption: "Try something strange on.",
    action: { type: "link", href: "/merch" },
    inDirectory: true,
    desktop: { x: 76.25, y: 81.3, w: 11.25 },
    mobile: { x: 30, y: 89.33, w: 40 },
  },
  {
    id: "plant",
    label: "A suspicious houseplant",
    caption: "It moved. Plants don’t move.",
    action: { type: "quip", lines: ["The plant waves back.", "It’s thriving on bass frequencies.", "Rustle."] },
    inDirectory: false,
    desktop: { x: 58.75, y: 72.5, w: 4.4 },
    mobile: { x: 84, y: 46.5, w: 13 },
  },
];

/** Directory order and short descriptions for the "Explore the room" list. */
export const directoryBlurbs: Partial<Record<RoomObjectId, string>> = {
  "record-player": "Music · The Listening Room",
  trunk: "Merch · The Curiosity Shop",
  bookcase: "Briz Lore · The Archives",
  phone: "A short, odd phone call",
  tv: "Videos",
  computer: "SageNet · lore fragments",
};
