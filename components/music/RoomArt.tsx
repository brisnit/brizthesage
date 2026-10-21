/** Illustrations for the Listening Room: a shelf of record spines and a static-filled TV. (The turntable is components/music/Deck.tsx.) */

const SPINES = [
  { w: 14, h: 150, c: "var(--coral-500)" },
  { w: 10, h: 160, c: "var(--teal-500)" },
  { w: 18, h: 145, c: "var(--ochre-500)" },
  { w: 9, h: 158, c: "var(--plum-600)" },
  { w: 12, h: 152, c: "var(--moss-500)" },
  { w: 16, h: 148, c: "var(--rose-500)" },
  { w: 8, h: 160, c: "var(--ink-500)" },
  { w: 14, h: 155, c: "var(--teal-700)" },
  { w: 11, h: 150, c: "var(--ochre-300)" },
  { w: 15, h: 157, c: "var(--coral-600)" },
  { w: 10, h: 146, c: "var(--moss-300)" },
  { w: 13, h: 159, c: "var(--plum-700)" },
];

/** A long shelf of record spines, with one record leaning out. */
export function RecordShelf({ className }: { className?: string }) {
  let x = 20;
  const spines = [];
  for (let row = 0; row < 3; row++) {
    for (const [i, s] of SPINES.entries()) {
      const idx = row * SPINES.length + i;
      spines.push(
        <g key={idx}>
          <rect
            x={x}
            y={175 - s.h}
            width={s.w}
            height={s.h}
            rx="1.5"
            fill={s.c}
            stroke="var(--line)"
            strokeWidth="2"
          />
          {idx % 3 === 0 && (
            <line x1={x + s.w / 2} y1={190 - s.h} x2={x + s.w / 2} y2={160 - s.h / 3} stroke="var(--parchment)" strokeWidth="1.5" strokeOpacity="0.55" strokeDasharray="4 5" />
          )}
        </g>,
      );
      x += s.w + 1;
    }
    x += 26;
  }
  return (
    <svg viewBox={`0 0 ${x + 120} 200`} className={className} aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <g filter="url(#ink)">
        {spines}
        {/* a record leaning out of the row */}
        <g transform={`translate(${x - 10} 30) rotate(14)`}>
          <rect x="0" y="0" width="140" height="140" fill="var(--teal-400)" stroke="var(--line)" strokeWidth="2.5" />
          <circle cx="70" cy="70" r="44" fill="var(--moon)" stroke="var(--line)" strokeWidth="2.5" />
          <path d="M30 120 C40 92 100 92 112 120 Z" fill="var(--teal-700)" stroke="var(--line)" strokeWidth="2" />
        </g>
        {/* shelf plank */}
        <rect x="0" y="175" width={x + 120} height="22" fill="#5b3a26" stroke="var(--line)" strokeWidth="2.5" />
        <rect x="0" y="175" width={x + 120} height="22" fill="url(#hatch)" />
      </g>
    </svg>
  );
}

/** Small CRT television filled with static: used for the empty video state. */
export function StaticTv({ className, staticClass }: { className?: string; staticClass?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <defs>
        <filter id="lr-tv-static">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="lr-tv-screen">
          <path d="M42 46 C80 38 160 38 196 46 C204 80 204 116 196 146 C160 154 80 154 42 146 C34 116 34 80 42 46 Z" />
        </clipPath>
      </defs>
      <g filter="url(#ink)">
        <path d="M84 22 L112 40 M156 18 L128 40" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
        <rect x="18" y="34" width="204" height="134" rx="22" fill="#8a5a36" stroke="var(--line)" strokeWidth="3" />
        <rect x="18" y="34" width="204" height="134" rx="22" fill="url(#hatch)" />
        <path d="M42 46 C80 38 160 38 196 46 C204 80 204 116 196 146 C160 154 80 154 42 146 C34 116 34 80 42 46 Z" fill="#2b3a3a" stroke="var(--line)" strokeWidth="3" />
        <path d="M60 182 L70 168 M180 182 L170 168" stroke="var(--line)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g clipPath="url(#lr-tv-screen)">
        <rect className={staticClass} x="20" y="20" width="220" height="160" filter="url(#lr-tv-static)" opacity="0.55" />
        <rect x="30" y="40" width="180" height="120" fill="url(#glow-teal)" opacity="0.35" />
      </g>
    </svg>
  );
}
