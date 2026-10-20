// Renders the "Blue House Explorer" wallpapers — original artwork painted in SVG
// for this site — to PNG files in public/rewards/.
// Run with: npm run reward
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const C = {
  plum950: "#120a19",
  plum900: "#1b1024",
  plum800: "#2a1734",
  plum700: "#3d2147",
  ink900: "#0e1630",
  ink700: "#1f2f5c",
  teal700: "#24706f",
  teal500: "#4fb3a9",
  teal400: "#6cc8bd",
  teal300: "#9adbd0",
  moss700: "#3f5a26",
  moss500: "#6b8a37",
  moss300: "#a3b864",
  coral600: "#c4664f",
  coral500: "#de8a72",
  coral300: "#efb6a0",
  rose: "#c98a8f",
  ochre700: "#9c6419",
  ochre500: "#e0a23a",
  ochre300: "#f4cf72",
  moon: "#f6dd8a",
  parchment: "#f3e7cc",
  line: "#1a1022",
};

// Deterministic pseudo-random so the artwork is stable between builds.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function stars(W, H, n, seed) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = r() * W;
    const y = r() * H * 0.62;
    const s = 0.8 + r() * 2.6;
    if (r() > 0.86) {
      out += `<path d="M${x} ${y - s * 3} L${x + s * 0.8} ${y - s * 0.8} L${x + s * 3} ${y} L${x + s * 0.8} ${y + s * 0.8} L${x} ${y + s * 3} L${x - s * 0.8} ${y + s * 0.8} L${x - s * 3} ${y} L${x - s * 0.8} ${y - s * 0.8} Z" fill="${C.parchment}" opacity="0.9"/>`;
    } else {
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(2)}" fill="${C.parchment}" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`;
    }
  }
  return out;
}

/** A puffy cloud with a sleepy face, centred at 0,0, roughly 600 wide. */
function cloud(flip = false, tint = C.coral500) {
  const puffs = [
    [-220, 40, 90],
    [-130, -10, 120],
    [-10, -60, 140],
    [120, -20, 120],
    [220, 40, 90],
    [-60, 60, 110],
    [80, 70, 110],
  ];
  const back = puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 8}" fill="${C.line}"/>`).join("");
  const front = puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${tint}"/>`).join("");
  const light = puffs
    .slice(0, 5)
    .map(([x, y, r]) => `<circle cx="${x - r * 0.25}" cy="${y - r * 0.3}" r="${r * 0.62}" fill="${C.coral300}" opacity="0.55"/>`)
    .join("");
  const curls = puffs
    .map(([x, y, r]) => `<path d="M${x - r * 0.5} ${y + r * 0.2} q ${r * 0.25} ${-r * 0.35} ${r * 0.5} 0" fill="none" stroke="${C.coral600}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`)
    .join("");
  const face = `
    <path d="M-70 20 q 26 22 52 0" fill="none" stroke="${C.line}" stroke-width="9" stroke-linecap="round"/>
    <path d="M40 16 q 26 22 52 0" fill="none" stroke="${C.line}" stroke-width="9" stroke-linecap="round"/>
    <path d="M-12 70 q 20 14 40 0" fill="none" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="-90" cy="56" r="16" fill="${C.rose}" opacity="0.7"/>
    <circle cx="110" cy="52" r="16" fill="${C.rose}" opacity="0.7"/>
    <text x="150" y="-60" font-family="Georgia, serif" font-size="46" font-style="italic" fill="${C.line}" opacity="0.55">z</text>
    <text x="190" y="-110" font-family="Georgia, serif" font-size="34" font-style="italic" fill="${C.line}" opacity="0.45">z</text>`;
  return `<g transform="scale(${flip ? -1 : 1},1)">${back}${front}${light}${curls}<g transform="scale(${flip ? -1 : 1},1)">${face}</g></g>`;
}

function mountains(W, baseY, seed) {
  const r = rng(seed);
  let out = "";
  let x = -100;
  while (x < W + 100) {
    const w = 220 + r() * 260;
    const h = 180 + r() * 260;
    const px = x + w * (0.4 + r() * 0.2);
    out += `<path d="M${x} ${baseY} L${px} ${baseY - h} L${x + w} ${baseY} Z" fill="${C.plum700}" stroke="${C.line}" stroke-width="6" stroke-linejoin="round"/>`;
    out += `<path d="M${px} ${baseY - h} L${px + w * 0.12} ${baseY - h * 0.55} L${px + w * 0.02} ${baseY - h * 0.6} L${px - w * 0.05} ${baseY - h * 0.45} Z" fill="${C.rose}" opacity="0.65"/>`;
    x += w * 0.7;
  }
  return out;
}

/** The blue house on its hill. Drawn around (0,0) = ground centre, ~1000 wide. */
function house() {
  const L = C.line;
  return `
  <!-- hill -->
  <path d="M-1700 160 C-1100 40 -500 -90 0 -95 C500 -90 1100 40 1700 160 L1700 700 L-1700 700 Z" fill="${C.moss700}" stroke="${L}" stroke-width="10"/>
  <path d="M-700 110 C-520 -10 -300 -55 0 -60 C300 -55 520 -10 700 110" fill="none" stroke="${C.moss300}" stroke-width="10" stroke-linecap="round" opacity="0.6"/>
  <!-- house body: organic turquoise dome -->
  <path d="M-330 -60 C-370 -260 -330 -470 -200 -560 C-90 -640 90 -650 200 -570 C330 -480 380 -270 330 -60 Z" fill="${C.teal500}" stroke="${L}" stroke-width="12" stroke-linejoin="round"/>
  <path d="M-280 -120 C-300 -300 -250 -450 -150 -520" fill="none" stroke="${C.teal300}" stroke-width="18" stroke-linecap="round" opacity="0.6"/>
  <path d="M260 -100 C300 -260 270 -420 180 -510" fill="none" stroke="${C.teal700}" stroke-width="22" stroke-linecap="round" opacity="0.55"/>
  <!-- swirls on the walls -->
  <path d="M-200 -330 c 30 -30 70 0 40 30 c -20 20 -50 0 -30 -18" fill="none" stroke="${C.teal700}" stroke-width="8" stroke-linecap="round"/>
  <path d="M150 -260 c 30 -30 70 0 40 30 c -20 20 -50 0 -30 -18" fill="none" stroke="${C.teal700}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="-120" cy="-200" r="14" fill="${C.teal300}" stroke="${L}" stroke-width="5"/>
  <circle cx="230" cy="-380" r="10" fill="${C.coral500}" stroke="${L}" stroke-width="5"/>
  <!-- moss drips from the roof -->
  <path d="M-250 -500 C-180 -560 -60 -610 60 -608 C160 -604 250 -560 290 -480 C270 -440 250 -470 240 -420 C226 -380 210 -450 190 -430 C170 -400 150 -470 120 -450 C100 -420 80 -380 60 -440 C40 -480 20 -430 0 -420 C-20 -410 -40 -470 -70 -460 C-100 -450 -110 -380 -140 -420 C-160 -450 -180 -400 -200 -430 C-220 -460 -240 -440 -250 -500 Z" fill="${C.moss500}" stroke="${L}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M-200 -540 C-120 -580 0 -600 120 -580" fill="none" stroke="${C.moss300}" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
  <!-- chimney (crooked) -->
  <path d="M110 -600 L120 -700 L190 -690 L176 -575 Z" fill="${C.coral600}" stroke="${L}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M104 -705 L200 -694" stroke="${L}" stroke-width="14" stroke-linecap="round"/>
  <path d="M150 -720 c -30 -40 30 -60 0 -110 c -20 -30 20 -60 10 -90" fill="none" stroke="${C.parchment}" stroke-width="9" stroke-linecap="round" opacity="0.55"/>
  <!-- round window, warm -->
  <circle cx="-150" cy="-330" r="56" fill="${C.ochre300}" stroke="${L}" stroke-width="10"/>
  <path d="M-150 -386 L-150 -274 M-206 -330 L-94 -330" stroke="${L}" stroke-width="8"/>
  <circle cx="-150" cy="-330" r="56" fill="url(#warm)" opacity="0.6"/>
  <!-- crooked little window -->
  <path d="M120 -370 L210 -380 L214 -290 L126 -284 Z" fill="${C.ochre300}" stroke="${L}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M168 -376 L170 -286" stroke="${L}" stroke-width="7"/>
  <!-- the crooked door: ochre frame, warm light -->
  <path d="M-120 -60 L-130 -250 C-128 -320 -60 -350 0 -350 C70 -350 125 -310 126 -240 L120 -60 Z" fill="${C.ochre500}" stroke="${L}" stroke-width="12" stroke-linejoin="round"/>
  <path d="M-80 -60 L-88 -230 C-86 -280 -40 -300 0 -300 C50 -300 86 -270 86 -220 L82 -60 Z" fill="${C.ochre300}" stroke="${L}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M-80 -60 L-88 -230 C-86 -280 -40 -300 0 -300 C50 -300 86 -270 86 -220 L82 -60 Z" fill="url(#doorlight)"/>
  <!-- skeleton peeking from the door -->
  <g transform="translate(36 -180) rotate(-14) scale(1.45)">
    <path d="M-38 -10 C-44 -54 -10 -78 22 -74 C54 -70 66 -38 56 -8 C52 4 44 12 36 14 L34 26 L-16 28 L-20 16 C-32 10 -36 4 -38 -10 Z" fill="${C.teal400}" stroke="${L}" stroke-width="6" stroke-linejoin="round"/>
    <ellipse cx="-14" cy="-28" rx="12" ry="15" fill="${C.plum950}"/>
    <ellipse cx="24" cy="-30" rx="14" ry="16" fill="${C.plum950}"/>
    <circle cx="-11" cy="-24" r="3" fill="${C.ochre300}"/>
    <circle cx="27" cy="-26" r="3.4" fill="${C.ochre300}"/>
    <path d="M3 -8 L-3 2 L8 2 Z" fill="${C.plum950}"/>
    <path d="M-22 10 C-6 20 26 20 44 6" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round"/>
    <path d="M-14 12 L-14 20 M-2 15 L-2 22 M10 16 L10 23 M22 15 L22 22 M34 11 L34 18" stroke="${L}" stroke-width="3"/>
  </g>
  <!-- step -->
  <path d="M-150 -60 L150 -60 L170 -20 L-170 -20 Z" fill="${C.plum700}" stroke="${L}" stroke-width="9" stroke-linejoin="round"/>
  <!-- path down the hill -->
  <path d="M-130 -20 C-170 80 -80 160 -150 300 L150 300 C100 160 160 80 130 -20 Z" fill="${C.ochre700}" stroke="${L}" stroke-width="8" opacity="0.85"/>
  <path d="M-60 40 l20 -6 M40 90 l24 4 M-70 170 l26 2 M30 220 l22 -6" stroke="${C.ochre300}" stroke-width="7" stroke-linecap="round" opacity="0.7"/>
  <!-- mushrooms -->
  ${mushroom(-420, 40, 1)}
  ${mushroom(-370, 70, 0.7)}
  ${mushroom(430, 30, 0.9)}
  ${mushroom(500, 80, 0.6)}
  <!-- grass tufts -->
  ${[-600, -500, -260, 260, 340, 620]
    .map((x, i) => `<path d="M${x} ${60 + (i % 3) * 30} l -14 -40 M${x} ${60 + (i % 3) * 30} l 0 -50 M${x} ${60 + (i % 3) * 30} l 14 -38" stroke="${C.moss300}" stroke-width="7" stroke-linecap="round"/>`)
    .join("")}
  `;
}

function mushroom(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="0" cy="-40" r="70" fill="url(#tealglow)"/>
    <path d="M-12 0 L-10 -40 L10 -40 L12 0 Z" fill="${C.parchment}" stroke="${C.line}" stroke-width="7"/>
    <path d="M-50 -38 C-50 -80 50 -80 50 -38 Z" fill="${C.teal300}" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="-18" cy="-56" r="7" fill="${C.parchment}"/><circle cx="16" cy="-62" r="5" fill="${C.parchment}"/>
  </g>`;
}

/** Relics, roughly 120 units across, centred. */
function relicMoon() {
  return `<path d="M20 -50 C-30 -44 -56 -6 -50 30 C-44 64 -6 84 34 76 C6 66 -12 40 -12 10 C-12 -20 0 -40 20 -50 Z" fill="${C.moon}" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M-36 6 c 6 8 14 8 20 2" fill="none" stroke="${C.line}" stroke-width="6" stroke-linecap="round"/>`;
}
function relicKey() {
  const teeth = Array.from({ length: 7 }, (_, i) => `<rect x="${10 + i * 9}" y="8" width="6" height="${i % 2 ? 10 : 15}" fill="${C.ochre500}" stroke="${C.line}" stroke-width="3"/>`).join("");
  return `<g transform="rotate(-30)"><circle cx="-40" cy="0" r="24" fill="${C.ochre500}" stroke="${C.line}" stroke-width="7"/><circle cx="-40" cy="0" r="9" fill="${C.plum900}"/>
  <rect x="-18" y="-7" width="92" height="14" rx="5" fill="${C.ochre500}" stroke="${C.line}" stroke-width="6"/>${teeth}</g>`;
}
function relicRecord() {
  return `<circle r="58" fill="${C.plum950}" stroke="${C.line}" stroke-width="6"/>
  <circle r="44" fill="none" stroke="#4a3b57" stroke-width="3"/><circle r="34" fill="none" stroke="#4a3b57" stroke-width="3"/>
  <circle r="20" fill="${C.coral500}" stroke="${C.line}" stroke-width="5"/><circle r="6" fill="${C.parchment}"/>
  <path d="M-40 -26 A48 48 0 0 1 -14 -46" fill="none" stroke="${C.teal300}" stroke-width="5" stroke-linecap="round"/>`;
}

function seaGlints(W, y, seed) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < W / 60; i++) {
    const x = r() * W;
    const yy = y + 20 + r() * 200;
    out += `<path d="M${x} ${yy} h ${30 + r() * 60}" stroke="${C.teal300}" stroke-width="4" stroke-linecap="round" opacity="${0.15 + r() * 0.3}"/>`;
  }
  return out;
}

/** Big dark leaves growing out of a bottom corner. dir = 1 (left) or -1 (right). */
function foliage(x, y, dir, s) {
  const leaf = (rot, len, col) =>
    `<g transform="rotate(${rot})"><path d="M0 0 C ${len * 0.2} -${len * 0.18} ${len * 0.75} -${len * 0.2} ${len} 0 C ${len * 0.75} ${len * 0.16} ${len * 0.2} ${len * 0.14} 0 0 Z" fill="${col}" stroke="${C.line}" stroke-width="7"/><path d="M10 0 L ${len * 0.92} 0" stroke="${C.line}" stroke-width="4" opacity="0.6"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${dir * s} ${s})">
    ${leaf(-70, 520, C.plum800)}${leaf(-48, 600, "#2b3a24")}${leaf(-28, 480, C.plum700)}${leaf(-10, 420, "#24331f")}${leaf(-85, 380, "#2b3a24")}
  </g>`;
}

function defs() {
  return `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.plum950}"/>
      <stop offset="0.45" stop-color="${C.plum800}"/>
      <stop offset="0.75" stop-color="#6b3a55"/>
      <stop offset="1" stop-color="${C.coral600}"/>
    </linearGradient>
    <radialGradient id="moonglow">
      <stop offset="0.55" stop-color="${C.ochre300}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${C.ochre300}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="moonbody" cx="0.42" cy="0.38" r="0.7">
      <stop offset="0" stop-color="#fff2b8"/>
      <stop offset="0.7" stop-color="${C.moon}"/>
      <stop offset="1" stop-color="#e8bf5e"/>
    </radialGradient>
    <radialGradient id="warm">
      <stop offset="0" stop-color="#fff6cf"/>
      <stop offset="1" stop-color="${C.ochre500}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="doorlight" cx="0.5" cy="0.6" r="0.6">
      <stop offset="0" stop-color="#fff6cf"/>
      <stop offset="0.6" stop-color="${C.ochre300}"/>
      <stop offset="1" stop-color="${C.ochre500}"/>
    </radialGradient>
    <radialGradient id="tealglow">
      <stop offset="0" stop-color="#c6fff2" stop-opacity="0.7"/>
      <stop offset="1" stop-color="${C.teal400}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="relicglow">
      <stop offset="0" stop-color="#fff2b8" stop-opacity="0.75"/>
      <stop offset="1" stop-color="${C.ochre300}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
    <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" stitchTiles="stitch" result="t"/>
      <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0.55 -0.18"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>`;
}

function relicWithGlow(inner, x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="95" fill="url(#relicglow)"/>${inner}</g>`;
}

function wallpaper(W, H, layout) {
  const { moon, cloudsL, cloudsR, houseAt, houseScale, mountainY, relics, title } = layout;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs()}
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars(W, H, Math.round((W * H) / 9000), 17)}
  <!-- the big moon -->
  <circle cx="${moon.x}" cy="${moon.y}" r="${moon.r * 1.45}" fill="url(#moonglow)"/>
  <g filter="url(#ink)">
    <circle cx="${moon.x}" cy="${moon.y}" r="${moon.r}" fill="url(#moonbody)" stroke="${C.line}" stroke-width="12"/>
    <circle cx="${moon.x - moon.r * 0.35}" cy="${moon.y - moon.r * 0.2}" r="${moon.r * 0.11}" fill="#e8bf5e" opacity="0.6"/>
    <circle cx="${moon.x + moon.r * 0.3}" cy="${moon.y + moon.r * 0.25}" r="${moon.r * 0.16}" fill="#e8bf5e" opacity="0.5"/>
    <circle cx="${moon.x + moon.r * 0.45}" cy="${moon.y - moon.r * 0.4}" r="${moon.r * 0.07}" fill="#e8bf5e" opacity="0.6"/>
    ${[0.18, 0.32, 0.5].map((f, i) => `<path d="M${moon.x - moon.r * (0.8 - i * 0.1)} ${moon.y - moon.r * (0.5 - f)} q ${moon.r * 0.3} -10 ${moon.r * 0.6} 0" fill="none" stroke="#e0b45a" stroke-width="7" stroke-linecap="round" opacity="0.5"/>`).join("")}
  </g>
  <!-- mountains -->
  <g filter="url(#ink)">${mountains(W, mountainY, 5)}</g>
  <!-- distant sea -->
  <rect x="0" y="${mountainY - 4}" width="${W}" height="${H - mountainY + 4}" fill="${C.ink700}"/>
  <rect x="0" y="${mountainY - 4}" width="${W}" height="10" fill="${C.line}"/>
  ${seaGlints(W, mountainY, 23)}
  <!-- clouds -->
  <g filter="url(#ink)">
    ${cloudsL.map((c) => `<g transform="translate(${c.x} ${c.y}) scale(${c.s})">${cloud(false, c.tint)}</g>`).join("")}
    ${cloudsR.map((c) => `<g transform="translate(${c.x} ${c.y}) scale(${c.s})">${cloud(true, c.tint)}</g>`).join("")}
  </g>
  <!-- the house -->
  <g transform="translate(${houseAt.x} ${houseAt.y}) scale(${houseScale})" filter="url(#ink)">${house()}</g>
  <!-- foreground foliage framing the corners -->
  <g filter="url(#ink)">${foliage(0, H, 1, Math.min(W, H) / 1290)}${foliage(W, H, -1, Math.min(W, H) / 1290)}</g>
  <!-- hidden relics -->
  ${relicWithGlow(relicMoon(), relics.moon.x, relics.moon.y, relics.moon.s)}
  ${relicWithGlow(relicKey(), relics.key.x, relics.key.y, relics.key.s)}
  ${relicWithGlow(relicRecord(), relics.record.x, relics.record.y, relics.record.s)}
  <!-- lettering -->
  <g font-family="Georgia, 'Times New Roman', serif" text-anchor="middle" fill="${C.parchment}">
    <text x="${title.x}" y="${title.y}" font-size="${title.size}" letter-spacing="${title.size * 0.32}" font-weight="bold" stroke="${C.line}" stroke-width="${title.size * 0.14}" paint-order="stroke">BLUE HOUSE EXPLORER</text>
    <text x="${title.x}" y="${title.y + title.size * 1.7}" font-size="${title.size * 0.8}" font-style="italic" fill="${C.ochre300}" stroke="${C.line}" stroke-width="${title.size * 0.1}" paint-order="stroke">brizthesage</text>
  </g>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect width="${W}" height="${H}" fill="#fff" filter="url(#grain)" opacity="0.5"/>
</svg>`;
}

const phone = {
  W: 1290,
  H: 2796,
  layout: {
    moon: { x: 645, y: 1080, r: 520 },
    cloudsL: [
      { x: 140, y: 760, s: 0.75, tint: C.coral500 },
      { x: 120, y: 1520, s: 0.55, tint: C.rose },
    ],
    cloudsR: [
      { x: 1160, y: 980, s: 0.8, tint: C.coral500 },
      { x: 1180, y: 1640, s: 0.5, tint: C.rose },
    ],
    mountainY: 1900,
    houseAt: { x: 645, y: 2260 },
    houseScale: 1.05,
    relics: {
      moon: { x: 1080, y: 420, s: 0.75 },
      key: { x: 260, y: 2520, s: 0.7 },
      record: { x: 1060, y: 2560, s: 0.7 },
    },
    title: { x: 645, y: 300, size: 46 },
  },
};

const desktop = {
  W: 2560,
  H: 1600,
  layout: {
    moon: { x: 1280, y: 640, r: 520 },
    cloudsL: [
      { x: 520, y: 420, s: 0.95, tint: C.coral500 },
      { x: 300, y: 920, s: 0.7, tint: C.rose },
    ],
    cloudsR: [
      { x: 2060, y: 480, s: 1, tint: C.coral500 },
      { x: 2300, y: 980, s: 0.65, tint: C.rose },
    ],
    mountainY: 1260,
    houseAt: { x: 1280, y: 1400 },
    houseScale: 0.95,
    relics: {
      moon: { x: 2280, y: 170, s: 0.7 },
      key: { x: 560, y: 1450, s: 0.65 },
      record: { x: 2000, y: 1460, s: 0.65 },
    },
    title: { x: 1280, y: 110, size: 40 },
  },
};

await mkdir("public/rewards", { recursive: true });
for (const [name, { W, H, layout }] of Object.entries({ phone, desktop })) {
  const svg = wallpaper(W, H, layout);
  const out = `public/rewards/blue-house-wallpaper-${name}.png`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 92, colours: 256, dither: 0.6 }).toFile(out);
  console.log("wrote", out);
}
