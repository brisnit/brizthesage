"use client";

import { useState } from "react";
import { sanctumCopy } from "@/content/hunt";
import Skeleton from "@/components/art/Skeleton";
import Oliver from "./Oliver";
import styles from "./Sanctum.module.css";

export type SageState = "idle" | "thinking" | "answering";

const INK = "var(--line)";
const GOLD = "#e3b44a";
const GOLD_DEEP = "#a8741f";
const CLOAK = "#1f2a5c";
const CLOAK_DEEP = "#141b3d";

/** A faceted jewel with a soft glow. */
function Jewel({ x, y, r, c, i = 0 }: { x: number; y: number; r: number; c: string; i?: number }) {
  return (
    <g className={styles.jewel} style={{ animationDelay: `${-i * 0.7}s` }}>
      <circle cx={x} cy={y} r={r * 2.4} fill={c} opacity="0.22" />
      <path d={`M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`} fill={c} stroke={INK} strokeWidth="2" />
      <path d={`M${x - r * 0.4} ${y - r * 0.3} L${x} ${y - r * 0.7} L${x + r * 0.2} ${y - r * 0.2} Z`} fill="#fff" opacity="0.7" />
    </g>
  );
}

/**
 * The Throne of Unnecessary Grandeur.
 *
 * Layers (each animates on its own): back glow and rays, smoke, the throne,
 * Briz (cloak, staff, and his face, a separate image layer cut from his portrait,
 * placed inside the hood), Oliver, and a peeking Baboo Baboo.
 * The face moves only as a whole (a gentle head tilt), never with invented features.
 *
 * `state` follows the real Ask-the-Sage response lifecycle:
 * idle → thinking (request sent) → answering (text arriving / being read aloud) → idle.
 */
export default function ThroneScene({ state }: { state: SageState }) {
  const [oliverNote, setOliverNote] = useState(false);

  return (
    <figure className={styles.throne} data-state={state}>
      <svg viewBox="0 0 600 760" className={styles.throneArt} role="img" aria-label="Briz the Sage, hood up and holding an ornate staff, sits on an enormous gold throne studded with glowing jewels, smoke curling around him. Oliver, his tan-and-white corgi, sits beside him. Baboo Baboo peeks out from behind the throne.">
        <defs>
          <radialGradient id="th-glow" cx="50%" cy="38%" r="60%">
            <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#c97b3a" stopOpacity="0.18" />
            <stop offset="1" stopColor="#1b1024" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="th-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe9a3" />
            <stop offset="0.45" stopColor={GOLD} />
            <stop offset="1" stopColor={GOLD_DEEP} />
          </linearGradient>
          <linearGradient id="th-velvet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a2f4a" />
            <stop offset="1" stopColor="#3d1630" />
          </linearGradient>
          <linearGradient id="th-cloak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c3a7a" />
            <stop offset="1" stopColor={CLOAK_DEEP} />
          </linearGradient>
          <radialGradient id="th-orb" cx="40%" cy="35%" r="65%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.35" stopColor="#c6fff2" />
            <stop offset="1" stopColor="#4fb3a9" />
          </radialGradient>
          <clipPath id="th-face">
            <ellipse cx="300" cy="212" rx="64" ry="80" />
          </clipPath>
        </defs>

        {/* back glow and rays */}
        <g className={styles.rays} data-depth="far">
          <circle cx="300" cy="280" r="320" fill="url(#th-glow)" />
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return (
              <path
                key={i}
                d={`M300 280 L${(300 + Math.cos(a - 0.06) * 420).toFixed(1)} ${(280 + Math.sin(a - 0.06) * 420).toFixed(1)} L${(300 + Math.cos(a + 0.06) * 420).toFixed(1)} ${(280 + Math.sin(a + 0.06) * 420).toFixed(1)} Z`}
                fill="#ffd98a"
                opacity="0.07"
              />
            );
          })}
        </g>

        {/* smoke, curling slowly */}
        <g className={styles.smoke} fill="none" stroke="#e9dcf0" strokeLinecap="round" opacity="0.32">
          <path d="M120 700 C90 640 150 600 120 540 C96 490 140 450 118 400" strokeWidth="14" />
          <path d="M480 700 C510 640 450 600 482 540 C506 488 462 452 486 400" strokeWidth="12" />
          <path d="M70 620 C50 580 90 550 72 510" strokeWidth="8" />
          <path d="M535 610 C555 570 515 545 532 505" strokeWidth="8" />
        </g>

        {/* Baboo Baboo, peeking from behind the throne */}
        <g className={styles.baboo} transform="translate(66 372) scale(0.2)">
          <Skeleton pose="peek" headOnly />
        </g>

        {/* the throne */}
        <g stroke={INK} strokeLinejoin="round">
          {/* back, with spires */}
          <path d="M140 640 L140 220 C140 110 200 40 300 40 C400 40 460 110 460 220 L460 640 Z" fill="url(#th-gold)" strokeWidth="5" />
          <path d="M168 620 L168 232 C168 140 220 72 300 72 C380 72 432 140 432 232 L432 620 Z" fill="url(#th-velvet)" strokeWidth="3" />
          {[140, 460].map((x) => (
            <g key={x}>
              <path d={`M${x - 22} 300 L${x} 96 L${x + 22} 300 Z`} fill="url(#th-gold)" strokeWidth="4" />
              <circle cx={x} cy="88" r="14" fill="url(#th-gold)" strokeWidth="3" />
            </g>
          ))}
          {/* crest: a gold ear inside a sunburst */}
          <circle cx="300" cy="22" r="34" fill="url(#th-gold)" strokeWidth="4" />
          <path d="M286 20 a14 14 0 0 1 28 0 c0 9 -9 11 -9 20 a8 8 0 0 1 -15 4.5 M294 22 a6 6 0 0 1 12 0 c0 4 -4 5 -4 9" fill="none" stroke={GOLD_DEEP} strokeWidth="4.5" strokeLinecap="round" />
          {/* velvet tufting and mysterious symbols */}
          <g fill="none" stroke="#e3b44a" strokeWidth="2" opacity="0.6">
            <path d="M206 200 l12 12 l-12 12 l-12 -12 Z M394 200 l12 12 l-12 12 l-12 -12 Z" />
            <circle cx="214" cy="560" r="10" />
            <path d="M386 552 a10 10 0 1 0 12 12 a8 8 0 1 1 -12 -12" />
          </g>
          {/* arms and seat */}
          <path d="M96 480 C96 450 130 440 168 448 L168 560 L104 560 C96 540 96 510 96 480 Z" fill="url(#th-gold)" strokeWidth="4" />
          <path d="M504 480 C504 450 470 440 432 448 L432 560 L496 560 C504 540 504 510 504 480 Z" fill="url(#th-gold)" strokeWidth="4" />
          <path d="M120 560 L480 560 L470 640 L130 640 Z" fill="url(#th-gold)" strokeWidth="4" />
          <path d="M130 640 L150 720 L190 720 L196 640 M470 640 L450 720 L410 720 L404 640" fill="url(#th-gold)" strokeWidth="4" />
          {/* steps */}
          <path d="M40 720 L560 720 L580 760 L20 760 Z" fill="#6f3f39" strokeWidth="4" />
          <path d="M80 704 L520 704 L540 722 L60 722 Z" fill="#8a4f3a" strokeWidth="3" />
        </g>
        {/* jewels on the throne */}
        <Jewel x={300} y={-14} r={9} c="#e0505e" i={0} />
        <Jewel x={140} y={88} r={8} c="#6cc8bd" i={1} />
        <Jewel x={460} y={88} r={8} c="#9a6ce0" i={2} />
        <Jewel x={128} y={470} r={9} c="#6cc8bd" i={3} />
        <Jewel x={472} y={470} r={9} c="#e0505e" i={4} />
        <Jewel x={300} y={600} r={10} c="#9a6ce0" i={5} />
        <Jewel x={210} y={600} r={7} c="#f4cf72" i={6} />
        <Jewel x={390} y={600} r={7} c="#f4cf72" i={7} />

        {/* Briz the Sage */}
        <g className={styles.sage}>
          {/* cloak body */}
          <g className={styles.cloak}>
            <path
              d="M222 290 C196 300 180 330 176 380 C170 450 168 540 176 624 L424 624 C432 540 430 450 424 380 C420 330 404 300 378 290 C350 280 250 280 222 290 Z"
              fill="url(#th-cloak)"
              stroke={INK}
              strokeWidth="4"
            />
            {/* gold trim down the front */}
            <path d="M286 300 C282 400 278 520 272 624 M314 300 C318 400 322 520 328 624" fill="none" stroke={GOLD} strokeWidth="6" />
            <path d="M286 300 C282 400 278 520 272 624 M314 300 C318 400 322 520 328 624" fill="none" stroke={INK} strokeWidth="1.5" opacity="0.6" />
            {/* stars and moons embroidered on the cloak */}
            <g fill="#f4cf72" opacity="0.85">
              {[
                [220, 420],
                [380, 400],
                [210, 540],
                [392, 560],
                [244, 600],
                [360, 480],
              ].map(([x, y], i) => (
                <path key={i} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z`} />
              ))}
              <path d="M232 488 a12 12 0 1 0 10 18 a9 9 0 1 1 -10 -18 Z" />
              <path d="M370 616 a10 10 0 1 0 8 15 a7 7 0 1 1 -8 -15 Z" />
            </g>
            {/* boots, resting on the step (he’s seated) */}
            <path d="M232 628 C232 612 262 610 270 622 L272 642 L226 642 Z M368 628 C368 612 338 610 330 622 L328 642 L374 642 Z" fill="#2a1f22" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            {/* knees / lap folds */}
            <path d="M196 560 C240 548 270 556 300 570 C330 556 360 548 404 560" fill="none" stroke={CLOAK} strokeWidth="5" opacity="0.8" />
            {/* the resting arm and gloved hand on the throne arm */}
            <path d="M392 330 C420 360 432 410 430 458 L404 462 C400 420 392 380 376 350 Z" fill="url(#th-cloak)" stroke={INK} strokeWidth="3.5" />
            <path d="M404 456 C412 448 432 448 438 458 C440 470 428 478 414 476 C404 474 400 464 404 456 Z" fill="#2a1f22" stroke={INK} strokeWidth="3" />
            <circle cx="424" cy="462" r="5" fill="#e0505e" stroke={INK} strokeWidth="1.5" />
          </g>

          {/* the staff, held in his other hand (gestures while he talks) */}
          <g transform="translate(-44 0)">
          <g className={styles.staff}>
            <path d="M196 150 C200 300 204 480 208 700" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
            <path d="M196 150 C200 300 204 480 208 700" fill="none" stroke="url(#th-gold)" strokeWidth="8" strokeLinecap="round" />
            {[260, 320, 520, 600].map((y) => (
              <ellipse key={y} cx={200 + (y - 150) * 0.022} cy={y} rx="9" ry="4" fill={GOLD} stroke={INK} strokeWidth="2" />
            ))}
            {/* crescent cage around the orb */}
            <path d="M166 128 C160 92 186 66 214 74 C196 80 184 100 190 126 Z" fill="url(#th-gold)" stroke={INK} strokeWidth="3" />
            <path d="M226 128 C232 96 214 76 196 74 C214 86 218 106 212 128 Z" fill="url(#th-gold)" stroke={INK} strokeWidth="3" />
            <circle className={styles.orbGlow} cx="196" cy="112" r="44" fill="#9adbd0" opacity="0.25" />
            <circle className={styles.orb} cx="196" cy="112" r="20" fill="url(#th-orb)" stroke={INK} strokeWidth="3" />
            {/* sleeve and gloved hand around the staff */}
            <path d="M214 330 C200 350 192 380 194 410 L222 414 C226 384 232 360 244 344 Z" fill="url(#th-cloak)" stroke={INK} strokeWidth="3.5" />
            <path d="M186 404 C186 394 216 392 222 402 C226 414 220 428 206 430 C192 430 184 418 186 404 Z" fill="#2a1f22" stroke={INK} strokeWidth="3" />
            <circle cx="214" cy="410" r="4.5" fill="#6cc8bd" stroke={INK} strokeWidth="1.5" />
          </g>
          </g>
          {/* gathering particles (thinking) */}
          <g className={styles.particles} fill="#c6fff2">
            {[
              [150, 60],
              [250, 50],
              [140, 170],
              [250, 180],
              [196, 30],
              [120, 110],
            ].map(([x, y], i) => (
              <circle key={i} cx={x - 44} cy={y} r="3" style={{ "--dx": `${196 - x}px`, "--dy": `${112 - y}px`, animationDelay: `${i * 0.18}s` } as React.CSSProperties} />
            ))}
          </g>

          {/* head: his face (from the portrait) inside the wizard hood; moves only as a whole */}
          <g className={styles.head}>
            <ellipse cx="300" cy="212" rx="66" ry="82" fill="#120a19" />
            <image href="/art/sanctum/briz-face.webp" x="226" y="124" width="148" height="176" preserveAspectRatio="xMidYMid slice" clipPath="url(#th-face)" />
            {/* the wizard hood, around the face */}
            <path
              fillRule="evenodd"
              d="M300 74 C248 76 204 118 196 180 C188 232 198 284 176 318 C232 340 368 340 424 318 C402 284 412 232 404 180 C396 118 352 76 300 74 Z M300 132 C262 132 236 168 236 212 C236 258 264 292 300 292 C336 292 364 258 364 212 C364 168 338 132 300 132 Z"
              fill="url(#th-cloak)"
              stroke={INK}
              strokeWidth="4"
            />
            <path d="M300 132 C262 132 236 168 236 212 C236 258 264 292 300 292 C336 292 364 258 364 212 C364 168 338 132 300 132 Z" fill="none" stroke={GOLD} strokeWidth="5" />
            {/* the hood’s tip flops back over one shoulder */}
            <path d="M300 74 C326 70 352 82 372 106 C384 122 392 142 404 150 C380 148 362 132 352 116 C340 98 322 86 300 74 Z" fill="url(#th-cloak)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="404" cy="152" r="7" fill="url(#th-gold)" stroke={INK} strokeWidth="2" />
            <path d="M214 170 C222 128 250 98 290 88" fill="none" stroke="#3d4f99" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
            {/* clasp */}
            <circle cx="300" cy="306" r="15" fill="url(#th-gold)" stroke={INK} strokeWidth="3" />
            <Jewel x={300} y={306} r={8} c="#6cc8bd" i={2} />
          </g>
          {/* speaking: little notes and sparks rise from the hood (an illustrated cue, not lip-sync) */}
          <g className={styles.voice} fill="#ffe9a3" stroke={INK} strokeWidth="1.5">
            <path d="M352 200 v-18 l10 -3 v14" fill="none" stroke="#ffe9a3" strokeWidth="2.5" />
            <ellipse cx="349" cy="201" rx="4.5" ry="3.5" />
            <path d="M372 236 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 Z" />
            <path d="M236 196 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 Z" />
          </g>
        </g>
      </svg>

      {/* Oliver, beside the throne: tap him */}
      <button
        type="button"
        className={styles.oliverSpot}
        aria-label="Oliver, the Sage’s corgi"
        aria-expanded={oliverNote}
        onClick={() => setOliverNote((v) => !v)}
      >
        <Oliver className={styles.oliverArt} />
      </button>
      {oliverNote && (
        <p className={styles.oliverNote} role="status">
          {sanctumCopy.oliverCaption}
        </p>
      )}
      <figcaption className={styles.stateBadge} aria-live="polite">
        {state === "thinking" ? "The Sage is thinking…" : state === "answering" ? "The Sage is answering…" : "The Sage is listening."}
      </figcaption>
    </figure>
  );
}
