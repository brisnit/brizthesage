# The Open Ear: artwork status and prompts

The sanctuary's throne scene (`components/sanctum/ThroneScene.tsx`) is **temporary composite artwork**:

| Layer | Status |
| --- | --- |
| Briz's face (`public/art/sanctum/briz-face.webp`) | **Real**: an oval crop of the original portrait in `brand assets/Brizz12.png`, the same source as the living-room picture. Rebuilt by `npm run assets`. It moves only as a whole (head tilt/nod); no features are animated. |
| Wizard cloak, hood, gloves, staff, throne, jewels, smoke, rays | Temporary vector art (SVG), in the site's ink style. |
| Oliver (corgi) | Vector art (`components/sanctum/Oliver.tsx`), with separate ear, eye, tail and head parts. Fine to keep, or replace with painted layers below. |
| Baboo Baboo | Reuses the site's skeleton illustration. |

No image generator was used. To replace the vector layers with painted ones, generate these as **separate transparent PNGs** (same canvas, 1200×1520, so they stack) using the portrait as the identity reference, then swap them into `ThroneScene.tsx`, keeping each layer in its own `<g>` so the existing idle/thinking/answering animations still apply.

Common style line for every prompt:
> Hand-inked storybook illustration matching the "What Up World" album cover: warm golden moonlight, deep plum and ink-blue shadows, turquoise and moss accents, slightly wobbly ink outlines, soft grain, whimsical not spooky. Transparent background.

1. `throne-bg.png`: "An extravagant, absurdly tall gold throne with spires, an ear-shaped crest in a sunburst, glowing ruby, turquoise and amethyst jewels, plum velvet back, set on two wooden steps inside a dark plum alcove with soft golden rays. No figure."
2. `briz-body.png`: "A seated hooded wizard musician in a richly textured midnight-blue cloak embroidered with tiny gold stars and crescent moons, gold trim down the front, a large hood up, dark gloves, sitting on a throne (throne not shown). The hood opening is empty and transparent so a face layer can sit behind it." *(Identity reference: Brizz12.png. The face itself should stay the real portrait layer unless the artist approves a painted likeness.)*
3. `briz-head-painted.png` *(optional, only with Briz's approval)*: "Painted portrait of the man in the reference photo, same face, same expression, in a deep-blue wizard hood, three-quarter view, matching the storybook style." Provide as its own layer so it moves as a whole.
4. `staff.png`: "An ornate twisted gold wizard staff with a glowing teal orb held in a crescent-moon cage, small gold rings along the shaft, held by a dark glove."
5. `oliver-sit.png`: "A Pembroke Welsh Corgi named Oliver sitting proudly: tan and white coat, white blaze and chest, pure white paws, short legs, big upright ears with pink insides, friendly open-mouth smile, and a fluffy tan tail with a white tip clearly visible (not docked). Teal collar with a tiny gold blue-house tag." Also export `oliver-ear-left.png`, `oliver-tail.png` and `oliver-eyes-closed.png` as separate layers for the ear flick, wag and blink.
6. `smoke-1.png` / `smoke-2.png`: "Soft curling incense smoke ribbons, pale lilac, semi-transparent."

Keep Oliver's markings and proportions identical across poses.
