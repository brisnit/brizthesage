# BRIZ THE SAGE: The Blue House

> “What’s down inside the blue house?”

The official site for BRIZ THE SAGE. The homepage is a scroll-driven trip through the strange blue house from the *What Up World* artwork. You start outside, walk up to the crooked door, explore a haunted 1970s living room, and drop through a hatch under the rug into the earth.

| Route | Room | What it is |
| --- | --- | --- |
| `/` | The Blue House | The five-scene scroll journey |
| `/music` | The Listening Room | Featured release, discography, streaming links, videos |
| `/merch` | The Curiosity Shop | Preview cabinet of collectibles (no checkout yet) |
| `/briz-lore` | The Archives | Real bio, exhibits, field notes, and the game **The House Remembers** |

Every route is statically prerendered, so each one works on refresh and as a direct link.

---

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (also type-checks)
npm start            # serve the production build
npm run lint         # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck    # tsc --noEmit
npm run assets       # regenerate web images from "brand assets/"
npm run reward       # regenerate the downloadable wallpapers
```

Requires Node 20+. The stack is Next.js 16 (App Router), React 19, TypeScript, GSAP 3 + ScrollTrigger (via `@gsap/react`), CSS Modules, and hand-drawn SVG illustration layers. There is no WebGL; the 2.5D layering works well on phones.

---

## Editing content (no animation code needed)

All copy, links and discoveries live in `content/`:

| File | Controls |
| --- | --- |
| `content/site.ts` | Site name and URL, **real bio** (`artist.bio`), contact email, social links, nav labels |
| `content/music.ts` | Releases, tracks, streaming links, artist profiles, videos |
| `content/merch.ts` | Shop categories and products |
| `content/home.ts` | Homepage scene copy, underground discoveries, paper scraps, sanctuary copy |
| `content/room.ts` | Living-room objects: labels, captions, destinations, desktop/phone placement |
| `content/phone.ts` | The rotary-phone conversation |
| `content/sagenet.ts` | The fictional dial-up “SageNet” portal |
| `content/lore.ts` | Field notes, exhibits, Archives copy, Lost & Found drawers |
| `content/game.ts` | Relics, clues, solution, hints, secret number, **reward** |

### Rules of the house: fact vs fiction

- Everything in `artist` (`content/site.ts`) and `content/music.ts` is shown as **fact**. Only put true information there.
- A `null` link renders as a disabled **“Link coming soon”**, never a fake URL.
- Lore entries carry `fiction: true` (house story) or `fiction: false` (real fact about Briz).
- Anything marked `sample: true` shows a **SAMPLE** stamp until you replace it.
- The floating paper scraps underground are world-building, **not lyrics**. Swap in approved lyric lines in `content/home.ts` if you want.

### Adding real music

1. In `content/music.ts`, fill in `kind`, `releaseDate`, `description` and `tracks` for *What Up World*, and add more releases (the first one is featured).
2. Replace `url: null` with real Spotify, Apple Music, Bandcamp and other URLs.
3. **Audio:** put files in `public/audio/` and set `audioSrc: "/audio/track.mp3"` on a track. A persistent mini-player then appears automatically. It never autoplays. With no audio, there is no player.
4. **Videos:** add `{ title, youtubeId }` to `videos`. They show in the Listening Room and on the living-room CRT. They are click-to-load embeds via `youtube-nocookie.com`.

### Going live with merch

Every product is currently a **preview** (`status: "preview"` or `"coming-soon"`). To sell one, set `status: "available"`, `price`, and `checkoutUrl` (Shopify, Bandcamp, Big Cartel and so on). The shop only renders a **Buy** link when both are set. The integration point is commented in `components/merch/Shop.tsx`. The site never collects payment details itself.

---

## Asset strategy

The two reference images are flattened artwork, so the site does not treat them as layers:

- **Originals are preserved untouched** in `brand assets/`.
- `scripts/build-assets.mjs` makes web copies and **deliberate crops** in `public/art/`:
  - `what-up-world.jpg`: the full cover, resized only (featured release, print preview).
  - `briz-portrait.jpg`: the full portrait, resized only (Archives, real-bio section).
  - `briz-hood.jpg`: a face crop, hung as a framed photo in the living room and used as an exhibit.
  - `skeleton-companion.jpg`, `house-door-detail.jpg`, `cloud-face-detail.jpg`: exhibit crops.
  - `public/og.jpg` is the social preview; `public/textures/grain.png` is the paper grain tile.
- **Everything that moves is original SVG** drawn for this site, after the artwork’s visual language: the moon, faced clouds, mountains, the turquoise house, foliage, the skeleton companion, every living-room object, and the underground strata, roots, artifacts, creatures and sanctuary. Each one is a separate layer, so foreground, middle-ground and background move independently. Briz’s appearance is never redrawn or altered; his photos are only cropped.
- Ambient “room tone” (`lib/audio.ts`) is synthesised live with WebAudio: hum, crackle, far chimes. It is not music and never presented as Briz’s. It only starts when the visitor turns sound on.

---

## How the homepage works

`components/home/HomeJourney.tsx` composes three scene components. Each owns its own GSAP ScrollTrigger timeline, cleaned up automatically by `useGSAP`.

1. **SceneOutside (scenes 1–2):** a pinned stage. Scrolling scales the house toward the crooked door, separates the clouds, and moves the foliage past fastest. Whispers appear and the skeleton peeks out. Then the door light swallows the screen.
2. **SceneRoom (scenes 3–4):** a pinned living room. The first stretch of scroll is a deliberate pause to explore. Then the floor glows, the rug slides aside, the hatch opens, the skeleton points down, and the hole swallows the screen.
3. **SceneUnder (scene 5):** native scrolling through soil strata with per-layer parallax (`data-speed`), tap-to-open discoveries, and the glowing listening chamber at the end.

Notes:

- Native scrolling throughout: no scroll-jacking, no forced smooth scroll. Scrubbed timelines reverse when scrolling up.
- Off-screen scenes pause their ambient CSS animation (`data-active="false"`).
- Phones get recomposed layouts: a 10:16 room with its own placements in `content/room.ts`, a re-framed hero, and fewer decor pieces.
- An **“Explore the room”** button opens an accessible list of every destination, for touch and keyboard users.
- **Simplified experience:** this follows `prefers-reduced-motion`, and the “Simplified” toggle in the nav overrides it either way. In this mode, no timelines are built, every scene shows its finished composition, and all content, routes, interactions and clues remain. The setting is stored in `localStorage` and applied before first paint.

---

## Game: “The House Remembers”

**Relics** (`content/game.ts`):

| Relic | Hidden on the homepage | Number | Clue |
| --- | --- | --- | --- |
| The Small Moon | Drifting near the big moon (scene 1) | III → 3 | “The moon always comes up last.” |
| The Seven-Tooth Key | Click the odd clock in the living room | 7 teeth → 7 | “Nothing in this house plays until something is unlocked.” |
| The Buried 45 | The spinning record underground | 45 | “The record plays in the middle of the night: after the door, before the moon.” |

- **Accessible path:** the Archives’ *Lost & Found cabinet* has drawers that also hold each relic, so the game can be finished without replaying the homepage. Riddles and “Look:” hints point to both places.
- **Final puzzle:** press the relics in order (Key → Record → Moon), then **Wake the relics**. This needs no dragging, audio or colour perception. It works with keyboard and touch, includes undo/clear, gives text feedback for wrong attempts, and has three progressive hints.
- **Progress** is saved in `localStorage` (`bluehouse:game:v1`) on this device only, via `lib/gameStore.ts`. **Reset progress** has an inline confirm step.
- **Secret:** dial **7453** on the living-room rotary phone (the relic numbers in solution order). The phone and SageNet’s `hint.txt` hint at it. Doing so adds a **NIGHT LINE** stamp to the Explorer Card.

### The reward

Winning unlocks the **Blue House Explorer kit**:

- Two original wallpapers, generated from SVG by `scripts/build-reward.mjs` into `public/rewards/`:
  - phone, 1290 × 2796
  - desktop, 2560 × 1600
- A **personalised Explorer Card**, drawn in the browser on `<canvas>`, with the visitor’s name, the date and a card number, downloaded as PNG.

### Replacing the reward

Change `reward` in `content/game.ts`. The `Reward` type already supports:

- `kind: "download"`: files plus the optional Explorer Card (current)
- `kind: "track"`: an unreleased-track preview, with an optional download link
- `kind: "discount"`: a public merch code

⚠️ **The game is local-only and not secure.** Its URLs and codes ship in the page source, and anyone can read them or skip the puzzle. Use it only for things that are fine to be public. For a limited coupon, a paid or unreleased track, or one-time redemption, add server-side validation (for example, an API route that issues signed, single-use tokens and records redemption), and keep the real asset behind it.

---

## Accessibility and performance

- The skip link, semantic landmarks and headings, and real `<a>`/`<button>` controls with descriptive labels are all in place. Focus outlines are visible.
- Dialogs use the native `<dialog>` element, which traps focus, closes on Esc, and restores focus.
- Touch targets are at least 44px. Nothing requires hover.
- Relic discoveries and puzzle feedback are announced through `aria-live` regions.
- Images go through `next/image` (AVIF/WebP) with reserved dimensions, and below-the-fold images lazy-load.
- Animation uses transforms and opacity. There are no large blur filters and no particle systems, and grain is a single tiled PNG.
- If JavaScript animation fails, every scene still renders its content and all navigation works.

## What was tested

These checks ran against the production build, using Chrome via `playwright-core`:

- Desktop (1440×900) and phone (390×844, touch) walkthroughs of the whole journey.
- Every route loads directly (200), and unknown routes return 404.
- Reduced-motion rendering.
- Full keyboard tab order on the homepage.
- Every living-room object: the TV empty state, SageNet pages, and the phone conversation, including clues.
- Relics found from the homepage and from the drawers.
- Wrong order, hints and correct solve.
- Both wallpaper downloads and the Explorer Card download.
- The 7453 secret call, persistence across reload, and reset.
- The mobile menu and the merch detail dialog.

`tsc`, ESLint and `next build` are all clean.

## Still placeholder (needs real info)

- **Biography:** `artist.bio` (`content/site.ts`).
- **Release details for *What Up World*:** format, date, tracklist, description, and all streaming URLs.
- **Videos** and **audio files**: none supplied yet.
- **Social links and contact email.**
- **Merch:** every product is a labelled preview, with no prices and no checkout.
- **Lore:** two entries are stamped *sample* (`content/lore.ts`, `content/home.ts`) and waiting for real facts.
- **Site URL** for social previews: `site.url` (currently `https://brizthesage.com`).
