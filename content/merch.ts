/**
 * The Curiosity Shop.
 *
 * Every product below is a DESIGN PREVIEW (`status: "preview"`).
 * Set aside for now (art still exists in components/merch/MerchArt.tsx):
 * vinyl, cassette, blueprint print, candle.
 * Nothing is for sale yet: no prices are charged, no inventory exists.
 *
 * To go live with a product:
 *  1. Replace the copy/art with the real item.
 *  2. Set `status: "available"` and `price`.
 *  3. Set `checkoutUrl` to the real product page (Shopify, Bandcamp, Big Cartel, ...).
 * The shop renders a "Buy" link only when both `status === "available"` and `checkoutUrl` are set.
 */

export type MerchCategory = "apparel" | "prints" | "music" | "oddities";

export const merchCategories: { id: MerchCategory; label: string; blurb: string }[] = [
  { id: "apparel", label: "Apparel", blurb: "Things to wear into strange weather." },
  { id: "prints", label: "Prints", blurb: "Wall things. Some of them watch back." },
  { id: "music", label: "Music & Physical", blurb: "Round things that make sound." },
  { id: "oddities", label: "Oddities", blurb: "Small objects with unclear purposes." },
];

/** Which built-in illustration to draw for the product (see components/merch art). */
export type MerchArt =
  | "hoodie"
  | "tee"
  | "print-cover"
  | "print-house"
  | "vinyl"
  | "cassette"
  | "pin-moon"
  | "candle";

export type MerchItem = {
  id: string;
  name: string;
  category: MerchCategory;
  status: "preview" | "coming-soon" | "available";
  /** Display price, e.g. "$35". null until real. */
  price: string | null;
  tagline: string;
  description: string;
  details: string[];
  art: MerchArt;
  /** Optional real product photo; when set it replaces the illustration. */
  image?: { src: string; alt: string; width: number; height: number };
  /** External checkout / product page. Only used when status is "available". */
  checkoutUrl: string | null;
};

/** Shop copy. */
export const shopCopy = {
  kicker: "Sage World",
  title: "The Curiosity Shop",
  intro: "A few things you might want to take home.",
  previewLabel: "Future artifact.",
  unavailable: "Not on the shelf yet.",
  notice:
    "Nothing here is for sale yet. These are design previews: no prices, no stock, and this site never asks for payment details.",
};

export const merch: MerchItem[] = [
  {
    id: "blue-house-hoodie",
    name: "Blue House Hoodie",
    category: "apparel",
    status: "preview",
    price: null,
    tagline: "Something warm for late nights and questionable shortcuts.",
    description: "Design preview: a heavyweight hoodie with the blue house over the heart and the moon across the back.",
    details: ["Design preview only", "Sizes and pricing not announced", "Not available to order"],
    art: "hoodie",
    checkoutUrl: null,
  },
  {
    id: "good-side-tee",
    name: "Baboo Baboo’s Good Side Tee",
    category: "apparel",
    status: "preview",
    price: null,
    tagline: "He dressed up for this. Technically.",
    description: "Design preview: Baboo Baboo, the turquoise house companion, waving from a washed plum tee.",
    details: ["Design preview only", "Not available to order"],
    art: "tee",
    checkoutUrl: null,
  },
  {
    id: "what-up-world-print",
    name: "What Up World Art Print",
    category: "prints",
    status: "preview",
    price: null,
    tagline: "A small window into a much stranger place.",
    description: "Design preview: a print of the What Up World cover artwork. Format and paper not decided.",
    details: ["Design preview only", "Size, paper and pricing not announced"],
    art: "print-cover",
    checkoutUrl: null,
  },
  {
    id: "sleepy-moon-pin",
    name: "Sleepy Moon Pin",
    category: "oddities",
    status: "preview",
    price: null,
    tagline: "For anyone keeping unusual hours.",
    description: "Design preview: a gold enamel crescent moon with one eye open.",
    details: ["Design preview only", "Not available to order"],
    art: "pin-moon",
    checkoutUrl: null,
  },
];
