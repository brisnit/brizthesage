# Briz the Sage — Welcome to Sage World

> “What’s down inside the blue house?”

The official site for Briz the Sage, a Southern California artist making chill lo-fi, ambient and alternative electronic music. **Briz the Sage** is the artist; **Sage World** is the place visitors explore. The homepage is a scroll-driven trip through the strange blue house from the *What Up World* artwork. You start outside, walk up to the crooked door, explore a haunted 1970s living room, and drop through a hatch under the rug into the earth.

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
| `content/site.ts` | Artist name, browser title, sharing description, domain, **real bio** and short bio, contact email, social links, nav labels |
| `content/music.ts` | Releases, tracks, credits, streaming links, artist profiles, videos, Listening Room copy |
| `content/merch.ts` | Shop copy, categories and products |
| `content/home.ts` | Homepage scene copy, underground discoveries, paper scraps, sanctuary copy |
| `content/room.ts` | Living-room objects: labels, captions, destinations, desktop/phone placement |
| `content/phone.ts` | The rotary-phone conversation |
| `content/sagenet.ts` | The fictional dial-up “SageNet” portal |
| `content/lore.ts` | Field notes (true and fiction), Baboo Baboo, exhibits, Archives copy, Lost & Found drawers |
| `content/game.ts` | Relics, clues, solution, hints, secret number, game copy, Explorer Card text, **reward** |

### Rules of the house: fact vs fiction

- Everything in `artist` (`content/site.ts`) and `content/music.ts` is shown as **fact**. Only put true information there.
- Platforms, socials and contact details without a confirmed link are simply **hidden**, never guessed.
- Lore entries carry `fiction: true` (house story) or `fiction: false` (real fact about Briz).
- Anything marked `sample: true` shows a **SAMPLE** stamp until you replace it.
- The floating paper scraps underground are world-building, **not lyrics**. Swap in approved lyric lines in `content/home.ts` if you want.

### Music data

All release facts were checked against the official Apple Music and Spotify listings (October 2026): *What Up World* (album, 5 Oct 2023, 8 tracks with Apple Music durations) plus six singles with their listed credits, dates, covers and links. Covers for the singles are in `public/art/releases/`. Two notes:

- *Be Love*: Spotify credits Briz the Sage and Celmer; Apple Music lists Briz the Sage only. The site follows Spotify.
- Briz’s Spotify page also lists *Friends, Music or Nothing* (an Andres Salomon EP, 2024). It isn’t on the site; add it if Briz appears on it.

**Playing music on the site:** the featured release gets a “Play it here” panel (`components/music/ListenPanel.tsx`) with the official Spotify and Apple Music embedded players, built from the release’s real links. Nothing from those services loads until the visitor picks a player, and choosing one turns off the room tone. Listeners signed in to that service hear full songs; others get the service’s previews.

To add more: append a release to `releases` (the first one is featured) with only real links. Platforms without a link are left out.
3. **Audio:** put files in `public/audio/` and set `audioSrc: "/audio/track.mp3"` on a track. A persistent mini-player then appears automatically. It never autoplays. With no audio, there is no player.
4. **Videos:** add `{ title, youtubeId }` to `videos`. They show in the Listening Room and on the living-room CRT. They are click-to-load embeds via `youtube-nocookie.com`.

### Going live with merch

Four products are shown as labelled **previews** (“A possible future artifact.”): Blue House Hoodie, Baboo Baboo’s Good Side Tee, What Up World Art Print, Sleepy Moon Pin. The vinyl, cassette, blueprint and candle previews are set aside (their art is still in `components/merch/MerchArt.tsx`). To sell one, set `status: "available"`, `price`, and `checkoutUrl` (Shopify, Bandcamp, Big Cartel and so on). The shop only renders a **Buy** link when both are set. The integration point is commented in `components/merch/Shop.tsx`. The site never collects payment details itself.

---

## Asset strategy

The two reference images are flattened artwork, so the site does not treat them as layers:

- **Originals are preserved untouched** in `brand assets/`.
- `scripts/build-assets.mjs` makes web copies and **deliberate crops** in `public/art/`:
  - `what-up-world.jpg`: the full cover, resized only (featured release, print preview).
  - `briz-portrait.jpg`: the full portrait, resized only (Archives, real-bio section).
  - `briz-hood.jpg`: a face crop, hung as a small framed portrait in the living room and used as an exhibit.
  - `skeleton-companion.jpg` (Baboo Baboo), `house-door-detail.jpg`, `cloud-face-detail.jpg`: exhibit crops.
  - `public/art/releases/*.jpg`: official single covers from the streaming listings.
  - `public/og.jpg` is the social preview; `public/textures/grain.png` is the paper grain tile.
- **Everything that moves is original SVG** drawn for this site, after the artwork’s visual language: the moon, faced clouds, mountains, the turquoise house, foliage, the skeleton companion, every living-room object, and the underground strata, roots, artifacts, creatures and sanctuary. Each one is a separate layer, so foreground, middle-ground and background move independently. Briz’s appearance is never redrawn or altered; his photos are only cropped.
- Ambient “room tone” (`lib/audio.ts`) is synthesised live with WebAudio: hum, crackle, far chimes. It is not music and never presented as Briz’s. It only starts when the visitor turns sound on.

---

## How the homepage works

`components/home/HomeJourney.tsx` composes three scene components. Each owns its own GSAP ScrollTrigger timeline, cleaned up automatically by `useGSAP`.

1. **SceneOutside (scenes 1–2):** a pinned stage. Scrolling scales the house toward the crooked door, separates the clouds, and moves the foliage past fastest. Whispers appear and the skeleton peeks out. Then the door light swallows the screen.
2. **SceneRoom (scenes 3–4):** the living room. On desktop the rug and hatch sit on its floor; once the whole room is on screen it holds while the rug beat plays right there. On phones the room scrolls freely.
3. **SceneRug (scene 4, phones only):** a pinned close-up of the floor. The rug glows and slides aside, the hatch opens, Baboo Baboo points down, and the hole swallows the screen.
4. **SceneUnder (scene 5):** native scrolling through soil strata with per-layer parallax (`data-speed`), tap-to-open discoveries, and the glowing listening chamber at the end.

Notes:

- Native scrolling throughout: no scroll-jacking, no forced smooth scroll. Scrubbed timelines reverse when scrolling up.
- Off-screen scenes pause their ambient CSS animation (`data-active="false"`).
- Phones get recomposed layouts: a split-level room with its own placements in `content/room.ts`, and a re-framed hero.
- **Layout rule: intro copy never sits on an interactive scene.** The living room’s intro (title, hint, buttons) comes first in normal flow, then the room. The room is its own canvas that **scrolls with the page** instead of shrinking to fit the screen: one wide 16:9 room on desktop, and on phones a tall split-level room (three staggered levels joined by stairs: bookcase/computer, sofa/phone, record player/TV/trunk). Each object and decor piece has its own desktop and phone position and size in `content/room.ts` (`roomObjects`, `roomDecor`, `roomLevels`), so objects keep their proportions and every hotspot stays on its drawing. Wall-mounted decor drifts slightly as you scroll (subtle parallax); objects never move. On desktop the rug, hatch and descent happen inside the room; on phones they are a separate pinned close-up right after it (`components/home/SceneRug.tsx`), on the same floor. On wide desktops (1240px+) the intro is left-aligned under the logo and sits on the room’s empty upper-left wall, which the desktop layout keeps free of objects (the room measures the intro and moves down if it ever grows, e.g. with larger text); “Explore the room →” becomes a quiet text link on the empty floor, bottom-left. On phones the hero works the same way: title, then the house and moon relic in their own box, then the buttons.
- **Taps go to objects, not decoration.** Decorative layers have `pointer-events: none`, and each room object only takes taps on its painted shapes (plus a centred 44px core), so transparent corners and glows never block a neighbour.
- **“Explore the room”** scrolls to the room and moves keyboard focus into it; **“See it as a list”** opens an accessible list of every destination, for touch and keyboard users.
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
- **Baboo Baboo**, the turquoise skeleton from Briz’s portrait, is the house companion (`companion` in `content/lore.ts`; `baboo_baboo` on SageNet).
- **Secret:** dial **7453** on the living-room rotary phone (the relic numbers in solution order). The phone and SageNet’s `hint.txt` hint at it. Doing so adds a **NIGHT LINE** stamp to the Explorer Card.

### The reward

Winning unlocks **“Take a little of the house with you.”**:

- Two original wallpapers, generated from SVG by `scripts/build-reward.mjs` into `public/rewards/`:
  - phone, 1290 × 2796
  - desktop, 2560 × 1600
- A **personalised Sage World Explorer Card**, drawn in the browser on `<canvas>` (text in `explorerCardCopy`), with the visitor’s name, the date and a card number.
- **Collect your keepsakes.** saves the card and both wallpapers in one go; each wallpaper also has its own button.

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

## Still needed (factual details)

Each of these stays hidden or labelled until supplied:

- **Final website domain:** set `site.url` (`content/site.ts`). Until then, link previews use relative image URLs.
- **Public contact or booking email** and **social profile URLs** (`content/site.ts`).
- **Videos** (YouTube ids) and any owned **audio** for the mini-player (`content/music.ts`).
- Any **additional releases** beyond the seven listed, and a TIDAL or other link for each release if wanted.
- **Merch:** real availability, prices, product photos and store links (`content/merch.ts`).
