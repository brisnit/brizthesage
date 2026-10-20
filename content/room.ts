/**
 * Living-room objects. Each object is placed on the room stage in percentages
 * (x/y = top-left corner, w = width) of a 16:10 stage on desktop and a 10:16
 * stage on phones. Change labels, captions and destinations here.
 */

import type { RelicId } from "./game";

export type RoomDialog = "phone" | "tv" | "computer";

export type RoomAction =
  | { type: "link"; href: string }
  | { type: "dialog"; dialog: RoomDialog }
  | { type: "relic"; relic: RelicId; quip: string }
  | { type: "quip"; lines: string[] };

export type Placement = { x: number; y: number; w: number };

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
    caption: "A book is glowing. Rude not to look.",
    action: { type: "link", href: "/briz-lore" },
    inDirectory: true,
    desktop: { x: 2.5, y: 24, w: 15 },
    mobile: { x: 2, y: 14, w: 30 },
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
    desktop: { x: 28, y: 20, w: 9 },
    mobile: { x: 37, y: 10, w: 22 },
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
    desktop: { x: 20, y: 22, w: 5 },
    mobile: { x: 86, y: 8, w: 11 },
  },
  {
    id: "lamp",
    label: "Amber floor lamp: switch it on or off",
    caption: "Click. Click.",
    action: { type: "quip", lines: ["Click.", "Click.", "It flickers like it has an opinion."] },
    inDirectory: false,
    desktop: { x: 38, y: 30, w: 6 },
    mobile: { x: 88, y: 24, w: 11 },
  },
  {
    id: "sofa",
    label: "A worn velvet sofa",
    caption: "Make yourself strange.",
    action: {
      type: "quip",
      lines: ["You find 41 cents and a guitar pick.", "The cushion sighs.", "Make yourself strange."],
    },
    inDirectory: false,
    desktop: { x: 30, y: 47, w: 28 },
    mobile: { x: 22, y: 50, w: 56 },
  },
  {
    id: "tv",
    label: "CRT television: watch videos",
    caption: "Static, mostly. Lean in anyway.",
    action: { type: "dialog", dialog: "tv" },
    inDirectory: true,
    desktop: { x: 61, y: 40, w: 13 },
    mobile: { x: 61, y: 27, w: 27 },
  },
  {
    id: "record-player",
    label: "Record player: go to the Listening Room",
    caption: "Drop the needle. Go to the music.",
    action: { type: "link", href: "/music" },
    inDirectory: true,
    desktop: { x: 75, y: 42, w: 12.5 },
    mobile: { x: 3, y: 66, w: 30 },
  },
  {
    id: "phone",
    label: "Rotary telephone: pick up the receiver",
    caption: "The phone probably isn’t for you.",
    action: { type: "dialog", dialog: "phone" },
    inDirectory: true,
    desktop: { x: 20, y: 51, w: 7 },
    mobile: { x: 4, y: 51, w: 15 },
  },
  {
    id: "computer",
    label: "Old beige computer: log on to SageNet",
    caption: "56k of pure mystery.",
    action: { type: "dialog", dialog: "computer" },
    inDirectory: true,
    desktop: { x: 88, y: 40, w: 11 },
    mobile: { x: 34, y: 26, w: 25 },
  },
  {
    id: "trunk",
    label: "A mysterious trunk: go to the Curiosity Shop (merch)",
    caption: "Rattles when nobody touches it. Merch inside.",
    action: { type: "link", href: "/merch" },
    inDirectory: true,
    desktop: { x: 82, y: 71, w: 13 },
    mobile: { x: 64, y: 68, w: 32 },
  },
  {
    id: "plant",
    label: "A suspicious houseplant",
    caption: "It moved. Plants don’t move.",
    action: { type: "quip", lines: ["The plant waves back.", "It’s thriving on bass frequencies.", "Rustle."] },
    inDirectory: false,
    desktop: { x: 57, y: 48, w: 5.5 },
    mobile: { x: 82, y: 48, w: 13 },
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
