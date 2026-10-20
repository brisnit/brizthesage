/**
 * Illustrated layers for the world outside the blue house.
 * Each export is a separate layer so scenes can move them independently.
 * Drawn after the "What Up World" cover: golden moon, faced clouds,
 * mauve mountains, the turquoise mossy house-world.
 */

const INK = "var(--line)";

/** Deterministic pseudo-random so server and client render the same stars. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function Stars({ count = 70, className }: { count?: number; className?: string }) {
  const rnd = seeded(42);
  const stars = Array.from({ length: count }, () => ({
    x: rnd() * 1000,
    y: rnd() * 560,
    r: 0.6 + rnd() * 1.8,
    tw: rnd() > 0.7,
  }));
  return (
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x.toFixed(1)}
          cy={s.y.toFixed(1)}
          r={s.r.toFixed(2)}
          fill="#f6e6b8"
          opacity={s.tw ? 0.9 : 0.55}
          className={s.tw ? "twinkle-star" : undefined}
          style={s.tw ? { animationDelay: `${(i % 7) * 0.6}s` } : undefined}
        />
      ))}
    </svg>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="moon-body" cx="45%" cy="40%" r="62%">
          <stop offset="0" stopColor="#fdf0b0" />
          <stop offset="0.6" stopColor="#f6dd8a" />
          <stop offset="1" stopColor="#e9bf5c" />
        </radialGradient>
        <radialGradient id="moon-halo">
          <stop offset="0.48" stopColor="#f6dd8a" stopOpacity="0.5" />
          <stop offset="0.7" stopColor="#e0a23a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#e0a23a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="moon-clip">
          <circle cx="300" cy="300" r="240" />
        </clipPath>
      </defs>
      <circle cx="300" cy="300" r="300" fill="url(#moon-halo)" />
      <circle cx="300" cy="300" r="240" fill="url(#moon-body)" stroke={INK} strokeWidth="3" />
      <g clipPath="url(#moon-clip)" fill="none" strokeLinecap="round">
        {/* soft craters */}
        <circle cx="210" cy="190" r="28" fill="#ecc96b" opacity="0.5" />
        <circle cx="380" cy="250" r="18" fill="#ecc96b" opacity="0.45" />
        <circle cx="330" cy="420" r="34" fill="#ecc96b" opacity="0.4" />
        <circle cx="160" cy="360" r="14" fill="#ecc96b" opacity="0.5" />
        {/* the drifting cloud-streaks painted across the cover's moon */}
        <g stroke="#fff6cf" strokeWidth="5" opacity="0.7">
          <path d="M90 230 C150 222 210 228 260 224" />
          <path d="M320 168 C380 160 440 170 500 166" />
          <path d="M120 470 C190 462 260 470 330 464" />
          <path d="M380 360 C430 356 480 362 530 358" />
        </g>
        <g stroke="#d9a94c" strokeWidth="2" opacity="0.6">
          <path d="M96 238 C150 232 210 236 258 233" />
          <path d="M326 176 C380 170 440 178 496 174" />
          <path d="M126 478 C190 472 258 478 326 473" />
        </g>
        <circle cx="300" cy="300" r="236" fill="url(#hatch)" opacity="0.18" />
      </g>
    </svg>
  );
}

export function TealPlanet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="#6aa9a0" stroke={INK} strokeWidth="3" />
      <path d="M20 50 C40 30 70 26 100 40" stroke="#9adbd0" strokeWidth="5" fill="none" opacity="0.6" strokeLinecap="round" />
      <circle cx="44" cy="70" r="9" fill="#4d8a82" />
      <circle cx="78" cy="56" r="6" fill="#4d8a82" />
      <circle cx="70" cy="88" r="5" fill="#4d8a82" />
      <circle cx="60" cy="60" r="50" fill="url(#hatch)" opacity="0.4" />
    </svg>
  );
}

type CloudProps = { className?: string; flip?: boolean; face?: boolean; tone?: "pink" | "coral" | "dusk" };

/** Puffy cloud with an optional sleepy face (eyelid blinks via CSS class "cloud-lid"). */
export function Cloud({ className, flip, face = true, tone = "pink" }: CloudProps) {
  const fills = {
    pink: ["#e3a49a", "#c9796f", "#f2c6b6"],
    coral: ["#de8a72", "#b9604f", "#f0b29c"],
    dusk: ["#b9808e", "#8d5568", "#d9a4ad"],
  }[tone];
  const id = `cloud-${tone}`;
  return (
    <svg viewBox="0 0 420 260" className={className} aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fills[2]} />
          <stop offset="0.55" stopColor={fills[0]} />
          <stop offset="1" stopColor={fills[1]} />
        </linearGradient>
      </defs>
      <path
        d="M40 210 C10 206 6 168 34 156 C22 124 52 98 86 108 C88 70 128 46 164 62 C180 26 236 18 262 50 C290 30 340 40 346 82 C384 80 408 112 394 142 C418 156 414 200 384 208 C360 226 330 222 314 214 C290 232 250 230 232 216 C206 234 160 232 142 214 C116 228 70 228 40 210 Z"
        fill={`url(#${id})`}
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* inner puff lines */}
      <g fill="none" stroke={fills[1]} strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <path d="M86 108 C100 120 104 136 98 150" />
        <path d="M164 62 C176 78 178 96 170 110" />
        <path d="M262 50 C266 70 262 86 252 98" />
        <path d="M346 82 C340 100 330 110 316 116" />
        <path d="M60 170 C90 160 120 168 136 182" />
        <path d="M250 160 C280 150 320 156 340 172" />
      </g>
      <g fill="none" stroke="#fbe2d4" strokeWidth="4" strokeLinecap="round" opacity="0.7">
        <path d="M120 84 C136 70 152 68 166 72" />
        <path d="M222 44 C238 34 256 36 268 46" />
        <path d="M54 130 C64 118 76 114 88 116" />
      </g>
      <path
        d="M40 210 C70 228 116 228 142 214 C160 232 206 234 232 216 C250 230 290 232 314 214 C330 222 360 226 384 208"
        fill="none"
        stroke={INK}
        strokeWidth="3"
        opacity="0.5"
      />
      {face && (
        <g className="cloud-face">
          {/* droopy, suspicious eye like the cover's clouds */}
          <path d="M196 128 C212 112 246 112 260 128 C246 140 212 142 196 128 Z" fill="#fdf3e4" stroke={INK} strokeWidth="3" />
          <circle cx="232" cy="128" r="7" fill={INK} />
          <path className="cloud-lid" d="M192 128 C208 106 248 106 264 128 C248 118 210 118 192 128 Z" fill={fills[1]} stroke={INK} strokeWidth="3" />
          <path d="M190 112 C210 98 246 98 266 110" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M214 168 C226 162 240 164 248 170" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export function Mountains({ className, side }: { className?: string; side: "left" | "right" }) {
  const d =
    side === "left"
      ? "M0 300 L0 170 L40 120 L70 160 L110 60 L150 140 L180 100 L230 200 L270 150 L320 230 L360 300 Z"
      : "M0 300 L40 230 L80 170 L110 200 L160 70 L200 150 L240 40 L290 160 L320 120 L360 190 L360 300 Z";
  return (
    <svg viewBox="0 0 360 300" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`mtn-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d7b1a6" />
          <stop offset="0.5" stopColor="#9c7488" />
          <stop offset="1" stopColor="#4f3550" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#mtn-${side})`} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={d} fill="url(#hatch)" opacity="0.5" />
      {side === "left" ? (
        <path d="M110 60 L120 110 L104 150 M180 100 L188 140 M270 150 L276 190" stroke="#f3dccf" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
      ) : (
        <path d="M240 40 L248 100 L236 150 M160 70 L168 120 M320 120 L326 160" stroke="#f3dccf" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
      )}
    </svg>
  );
}

/** The blue house: an organic turquoise mound-house on a mossy island. viewBox 700×620. */
export function House({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 620" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id="house-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fd3c6" />
          <stop offset="0.5" stopColor="#4fb3a9" />
          <stop offset="1" stopColor="#2b7f7e" />
        </linearGradient>
        <linearGradient id="island" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fae4a" />
          <stop offset="1" stopColor="#4d6a2a" />
        </linearGradient>
        <linearGradient id="door-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe7a6" />
          <stop offset="1" stopColor="#f0a944" />
        </linearGradient>
        <clipPath id="house-clip">
          <path d="M118 530 C96 420 108 300 168 220 C220 150 298 116 360 120 C444 126 524 168 564 250 C604 332 604 444 588 530 Z" />
        </clipPath>
      </defs>

      {/* water ring + island */}
      <ellipse cx="350" cy="560" rx="345" ry="58" fill="#241a33" stroke={INK} strokeWidth="3" />
      <path d="M20 556 C60 520 180 506 350 506 C520 506 640 520 680 556 C640 594 520 608 350 608 C180 608 60 594 20 556 Z" fill="url(#island)" stroke={INK} strokeWidth="3.5" />
      <path d="M40 560 C120 590 240 600 350 600 C470 600 590 588 660 560" fill="none" stroke="#3c5223" strokeWidth="6" opacity="0.6" />

      {/* rooftop oddities (behind the moss cap) */}
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M232 168 L238 96 L250 92 L256 160 Z" fill="#a0603a" />
        <path d="M228 98 L244 60 L262 96 Z" fill="#6f3f39" />
        <rect x="240" y="108" width="8" height="12" fill="#ffd98a" />
        <path d="M352 122 L360 40 L368 122 Z" fill="#3d2147" />
        <circle cx="360" cy="40" r="5" fill="var(--ochre-300)" />
        <path d="M452 138 L456 92 L496 96 L492 150 Z" fill="#b2683c" />
        <path d="M448 96 L476 70 L500 98 Z" fill="#7c3e33" />
        <rect x="466" y="108" width="10" height="14" fill="#ffd98a" />
        <path d="M510 170 L514 120" fill="none" />
        <circle cx="516" cy="112" r="16" fill="#e2b34a" />
        <path d="M506 112 L526 112 M516 102 L516 122" stroke={INK} strokeWidth="2" />
      </g>
      {/* little pines */}
      <g fill="#2f4a2a" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M296 136 L306 100 L316 136 Z" />
        <path d="M404 128 L412 98 L420 128 Z" />
        <path d="M196 196 L204 170 L212 196 Z" />
        <path d="M540 196 L548 168 L556 196 Z" />
      </g>

      {/* the house body */}
      <path
        d="M118 530 C96 420 108 300 168 220 C220 150 298 116 360 120 C444 126 524 168 564 250 C604 332 604 444 588 530 Z"
        fill="url(#house-body)"
        stroke={INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <g clipPath="url(#house-clip)">
        {/* swirls and folds */}
        <g fill="none" stroke="#a8ecdf" strokeWidth="4" strokeLinecap="round" opacity="0.75">
          <path d="M170 300 C150 360 168 430 160 520" />
          <path d="M240 260 C228 300 250 330 240 380 C232 420 250 460 246 520" />
          <path d="M540 300 C560 360 548 440 560 520" />
          <path d="M470 260 C482 300 462 340 470 380" />
        </g>
        <g fill="none" stroke="#1f6363" strokeWidth="3" strokeLinecap="round" opacity="0.7">
          <path d="M200 240 C190 290 210 330 196 380 C186 420 204 470 196 528" />
          <path d="M300 200 C292 240 310 270 300 310" />
          <path d="M520 240 C532 290 516 330 528 380 C536 420 520 470 530 528" />
          <path d="M276 360 C300 340 330 344 340 368 C350 392 324 410 306 398 C292 388 300 370 314 372" />
          <path d="M420 300 C446 286 474 300 470 324 C466 346 440 346 436 330" />
        </g>
        {/* spots */}
        <g stroke={INK} strokeWidth="2.5">
          <circle cx="226" cy="300" r="10" fill="#d2e7a8" />
          <circle cx="226" cy="300" r="4" fill="#3d2147" />
          <circle cx="498" cy="350" r="12" fill="#f0b29c" />
          <circle cx="498" cy="350" r="5" fill="#3d2147" />
          <circle cx="330" cy="250" r="7" fill="#d2e7a8" />
          <circle cx="182" cy="440" r="8" fill="#f0b29c" />
          <circle cx="552" cy="440" r="6" fill="#d2e7a8" />
        </g>
        {/* round windows with warm light */}
        <g className="house-windows" stroke={INK} strokeWidth="3.5">
          <circle cx="282" cy="300" r="22" fill="#2a1734" />
          <circle cx="282" cy="300" r="16" fill="#f3c46a" className="house-window" />
          <path d="M266 300 H298 M282 284 V316" stroke={INK} strokeWidth="2.5" />
          <circle cx="430" cy="236" r="16" fill="#2a1734" />
          <circle cx="430" cy="236" r="11" fill="#f3c46a" className="house-window" style={{ animationDelay: "1.6s" }} />
          <ellipse cx="262" cy="452" rx="18" ry="24" fill="#2a1734" />
          <ellipse cx="262" cy="452" rx="12" ry="17" fill="#e8a74b" className="house-window" style={{ animationDelay: "3s" }} />
        </g>
        {/* cross-hatched shading on the right */}
        <path d="M480 160 C580 240 610 380 590 540 L470 540 C520 420 520 280 480 160 Z" fill="url(#hatch)" opacity="0.8" />
      </g>

      {/* moss cap with drips */}
      <path
        d="M160 232 C214 154 298 116 360 120 C446 126 526 170 566 252 C560 262 552 262 548 276 C544 296 536 300 532 280 C528 262 516 264 512 286 C508 318 496 320 494 290 C492 262 480 254 470 270 C462 290 452 290 452 266 C450 240 430 232 418 254 C410 270 398 268 396 248 C392 224 368 226 362 252 C356 286 340 290 338 256 C336 228 316 228 308 250 C302 268 290 266 288 248 C284 224 262 226 254 252 C246 286 230 290 228 262 C226 238 208 236 200 256 C192 280 178 284 176 262 C174 246 166 240 160 232 Z"
        fill="#6b8a37"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M190 210 C240 160 300 140 360 140 C420 142 480 162 520 200" fill="none" stroke="#a3b864" strokeWidth="6" strokeLinecap="round" opacity="0.7" />

      {/* winding path from the door */}
      <path d="M392 540 C380 560 330 568 300 590 C284 602 290 612 296 618 L352 618 C344 604 360 590 400 580 C430 570 440 556 432 540 Z" fill="#c99a5b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* the crooked door: ornate golden frame, warm light inside */}
      <g transform="rotate(-4 412 470)">
        <path d="M350 540 L350 452 C350 400 378 376 412 376 C446 376 474 400 474 452 L474 540 Z" fill="#d9a03c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M356 412 C366 390 390 380 412 380 C436 380 458 390 468 412" fill="none" stroke="#8a5a1c" strokeWidth="3" />
        <g fill="none" stroke="#8a5a1c" strokeWidth="2.5" strokeLinecap="round">
          <path d="M360 470 C368 462 360 452 352 458" />
          <path d="M464 470 C456 462 464 452 472 458" />
          <path d="M398 384 C404 374 420 374 426 384" />
        </g>
        <path d="M374 540 L374 460 C374 428 392 410 412 410 C432 410 450 428 450 460 L450 540 Z" fill="url(#door-light)" stroke={INK} strokeWidth="3.5" className="house-door-light" />
        <path d="M380 540 L380 470 C392 480 404 476 412 470 L412 540 Z" fill="#f7d793" opacity="0.6" />
        {/* the door itself, ajar */}
        <path d="M450 540 L450 460 C450 440 444 426 436 418 L428 424 L428 540 Z" fill="#6f3f39" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="434" cy="486" r="3.5" fill="var(--ochre-300)" stroke={INK} strokeWidth="1.5" />
      </g>

      {/* moss drips down the front */}
      <g fill="#7f9d3f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M118 530 C122 500 136 480 150 470 C148 496 156 510 170 530 Z" />
        <path d="M560 530 C566 500 580 484 588 480 C592 500 590 516 586 530 Z" />
      </g>

      {/* island creatures (blink via CSS) */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <g className="creature creature-a">
          <path d="M110 560 C108 540 126 532 140 536 C152 528 170 536 168 552 L170 572 L160 572 L158 560 L124 562 L122 574 L112 574 Z" fill="#2a1734" />
          <circle cx="148" cy="544" r="3" fill="#f6dd8a" className="blink" />
        </g>
        <g className="creature creature-b">
          <path d="M560 572 C556 550 576 540 592 546 C604 540 616 552 610 566 L612 580 L602 580 L600 572 L576 572 L574 582 L564 582 Z" fill="#c4664f" />
          <circle cx="600" cy="554" r="2.8" fill={INK} className="blink" style={{ animationDelay: "2.2s" }} />
        </g>
        <g className="creature creature-c">
          <path d="M230 590 C226 576 238 568 250 572 C262 568 270 578 266 590 Z" fill="#e9fff8" />
          <circle cx="244" cy="580" r="2.4" fill={INK} />
          <circle cx="254" cy="580" r="2.4" fill={INK} />
        </g>
      </g>
      {/* mushrooms on the island */}
      <g stroke={INK} strokeWidth="2.5">
        <path d="M486 566 L486 586 L494 586 L494 566" fill="#f3e7cc" />
        <path d="M474 568 C474 548 506 548 506 568 Z" fill="#de8a72" />
        <circle cx="484" cy="560" r="2.5" fill="#f3e7cc" stroke="none" />
        <path d="M196 552 L196 568 L202 568 L202 552" fill="#f3e7cc" />
        <path d="M188 554 C188 538 210 538 210 554 Z" fill="#e0a23a" />
      </g>
    </svg>
  );
}

/** Foreground foliage that frames the scene and rushes past on approach. */
export function Foliage({ side, className }: { side: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 420 520"
      className={className}
      aria-hidden="true"
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
      overflow="visible"
    >
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
        {/* big leaf */}
        <path d="M-20 520 C-10 380 60 250 200 200 C170 300 120 420 60 520 Z" fill="#23402e" />
        <path d="M-10 510 C40 390 100 300 190 210" fill="none" stroke="#4d7a4a" strokeWidth="3" />
        {/* fern fronds */}
        <path d="M30 520 C60 400 140 310 260 280 C220 330 170 380 140 430 C120 470 110 500 100 520 Z" fill="#2f5236" />
        <path d="M60 510 C100 420 160 350 250 290" fill="none" stroke="#5f8f55" strokeWidth="3" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${90 + i * 30} ${450 - i * 34} C${120 + i * 30} ${430 - i * 34} ${140 + i * 30} ${420 - i * 36} ${160 + i * 26} ${396 - i * 36}`} fill="none" stroke="#5f8f55" strokeWidth="3" strokeLinecap="round" />
        ))}
        {/* tall grass */}
        <path d="M150 520 C160 440 170 380 200 320 C190 400 190 460 196 520 Z" fill="#3f5a26" />
        <path d="M190 520 C210 450 240 400 290 360 C260 420 240 470 236 520 Z" fill="#4c6a2c" />
        {/* glowing mushrooms */}
        <g className="glow-shroom">
          <ellipse cx="250" cy="470" rx="70" ry="44" fill="url(#glow-teal)" stroke="none" opacity="0.7" />
          <path d="M240 520 L242 470 L258 470 L262 520 Z" fill="#e9dcc0" />
          <path d="M212 476 C214 438 286 434 290 476 C270 484 232 484 212 476 Z" fill="#6cc8bd" />
          <circle cx="236" cy="462" r="5" fill="#e9fff8" stroke="none" />
          <circle cx="262" cy="456" r="4" fill="#e9fff8" stroke="none" />
          <path d="M300 520 L301 492 L311 492 L313 520 Z" fill="#e9dcc0" />
          <path d="M286 496 C288 474 324 472 326 496 C314 501 298 501 286 496 Z" fill="#9adbd0" />
        </g>
      </g>
    </svg>
  );
}

/** Hanging branch for the top corner of the frame. */
export function Branch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 260" className={className} aria-hidden="true" overflow="visible">
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M-40 30 C80 40 200 70 320 50 C400 38 460 60 520 90" fill="none" stroke="#2a1734" strokeWidth="18" />
        <path d="M-40 30 C80 40 200 70 320 50 C400 38 460 60 520 90" fill="none" stroke={INK} strokeWidth="4" opacity="0.5" />
        {[60, 140, 220, 300, 380].map((x, i) => (
          <g key={x} className="sway" style={{ transformOrigin: `${x}px 50px`, animationDelay: `${i * 0.4}s` }}>
            <path d={`M${x} 52 C${x + 6} 100 ${x - 4} 150 ${x + 4} ${170 + (i % 2) * 50}`} fill="none" stroke="#3f5a26" strokeWidth="4" />
            <path d={`M${x + 4} ${170 + (i % 2) * 50} c-14 6 -16 24 -2 30 c14 -6 14 -24 2 -30 Z`} fill="#6b8a37" />
            <path d={`M${x} 110 c-16 0 -22 14 -14 24 c12 -2 18 -14 14 -24 Z`} fill="#4c6a2c" />
          </g>
        ))}
      </g>
    </svg>
  );
}
