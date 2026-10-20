/**
 * The Curiosity Shop.
 *
 * Every product below is a DEMONSTRATION PREVIEW (`status: "preview"`).
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

export const merch: MerchItem[] = [
  {
    id: "blue-house-hoodie",
    name: "Blue House Hoodie",
    category: "apparel",
    status: "preview",
    price: null,
    tagline: "A hood for looking mysterious in forests.",
    description:
      "Design preview: a heavyweight hoodie with the blue house embroidered over the heart and the moon across the back.",
    details: ["Design preview only", "Sizes and pricing not announced", "Not available to order"],
    art: "hoodie",
    checkoutUrl: null,
  },
  {
    id: "skeleton-friend-tee",
    name: "Skeleton Friend Tee",
    category: "apparel",
    status: "preview",
    price: null,
    tagline: "He’s friendly. Mostly.",
    description: "Design preview: the turquoise skeleton companion, waving, on a washed plum tee.",
    details: ["Design preview only", "Not available to order"],
    art: "tee",
    checkoutUrl: null,
  },
  {
    id: "what-up-world-print",
    name: "What Up World Art Print",
    category: "prints",
    status: "coming-soon",
    price: null,
    tagline: "The moon, the clouds, the whole world.",
    description: "A print of the What Up World cover artwork. Format and paper still being decided.",
    details: ["Coming soon", "Size, paper and price to be announced"],
    art: "print-cover",
    checkoutUrl: null,
  },
  {
    id: "blue-house-blueprint",
    name: "Blue House Blueprint",
    category: "prints",
    status: "preview",
    price: null,
    tagline: "Floor plans, including the floor under the floor.",
    description: "Design preview: a cyanotype-style cutaway of the blue house, from chimney to the listening chamber.",
    details: ["Design preview only", "Not available to order"],
    art: "print-house",
    checkoutUrl: null,
  },
  {
    id: "what-up-world-vinyl",
    name: "What Up World on Vinyl",
    category: "music",
    status: "preview",
    price: null,
    tagline: "If it happens, it will spin.",
    description: "Concept preview of a vinyl pressing. No pressing has been announced.",
    details: ["Concept preview only", "No release announced"],
    art: "vinyl",
    checkoutUrl: null,
  },
  {
    id: "basement-tapes",
    name: "Basement Cassette",
    category: "music",
    status: "preview",
    price: null,
    tagline: "Found under the rug. Probably.",
    description: "Concept preview of a cassette edition. Contents and release not announced.",
    details: ["Concept preview only", "No release announced"],
    art: "cassette",
    checkoutUrl: null,
  },
  {
    id: "moon-pin",
    name: "Sleepy Moon Enamel Pin",
    category: "oddities",
    status: "preview",
    price: null,
    tagline: "It’s tired. Let it rest on your jacket.",
    description: "Design preview: a gold enamel crescent moon with one eye open.",
    details: ["Design preview only", "Not available to order"],
    art: "pin-moon",
    checkoutUrl: null,
  },
  {
    id: "listening-candle",
    name: "Listening Room Candle",
    category: "oddities",
    status: "preview",
    price: null,
    tagline: "Smells like old records and rain on moss.",
    description: "Concept preview of a candle for long listening sessions.",
    details: ["Concept preview only", "Not available to order"],
    art: "candle",
    checkoutUrl: null,
  },
];
