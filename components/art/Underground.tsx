/** Illustrated pieces for the world under the house. */

const INK = "var(--line)";

export function Roots({ className, variant = 0 }: { className?: string; variant?: 0 | 1 }) {
  const main =
    variant === 0
      ? ["M80 0 C90 80 60 140 76 220 C88 290 70 360 90 440", "M240 0 C230 60 260 120 244 200 C232 260 250 320 238 380", "M420 0 C430 70 400 150 420 230 C440 310 410 380 430 470"]
      : ["M60 0 C76 60 50 120 70 200 C86 270 60 330 74 400", "M300 0 C290 90 320 160 300 240 C284 300 300 360 290 420", "M500 0 C520 50 490 120 506 190"];
  return (
    <svg viewBox="0 0 560 480" preserveAspectRatio="xMidYMin meet" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        {main.map((d, i) => (
          <g key={i} className="sway" style={{ transformOrigin: "50% 0%", animationDelay: `${i * 0.9}s`, animationDuration: "9s" }}>
            <path d={d} stroke={INK} strokeWidth="30" />
            <path d={d} stroke="#6f4a32" strokeWidth="24" />
            <path d={d} stroke="#8f6444" strokeWidth="6" transform="translate(-5 0)" />
            <path d={d} stroke="#4f3222" strokeWidth="4" transform="translate(6 0)" />
          </g>
        ))}
        {/* tendrils */}
        <g stroke={INK} strokeWidth="9">
          <path d="M80 120 C110 140 120 170 140 180" />
          <path d="M76 260 C50 280 40 300 26 330" />
          <path d="M244 140 C270 150 290 180 300 210" />
          <path d="M420 200 C390 220 380 250 372 280" />
          <path d="M426 330 C450 350 460 380 470 400" />
        </g>
        <g stroke="#6f4a32" strokeWidth="5">
          <path d="M80 120 C110 140 120 170 140 180" />
          <path d="M76 260 C50 280 40 300 26 330" />
          <path d="M244 140 C270 150 290 180 300 210" />
          <path d="M420 200 C390 220 380 250 372 280" />
          <path d="M426 330 C450 350 460 380 470 400" />
        </g>
      </g>
    </svg>
  );
}

export function Stones({ className }: { className?: string }) {
  const stones = [
    [40, 60, 30, 18, "#5b4a5e"],
    [140, 120, 18, 12, "#6e5a63"],
    [260, 40, 24, 14, "#4d3f55"],
    [380, 140, 34, 20, "#5b4a5e"],
    [480, 70, 16, 10, "#6e5a63"],
    [90, 180, 14, 9, "#4d3f55"],
    [320, 200, 20, 12, "#6e5a63"],
  ] as const;
  return (
    <svg viewBox="0 0 560 240" className={className} aria-hidden="true">
      {stones.map(([x, y, rx, ry, c], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={c} stroke={INK} strokeWidth="2.5" />
          <path d={`M${x - rx * 0.5} ${y - ry * 0.3} q${rx * 0.3} ${-ry * 0.4} ${rx * 0.7} ${-ry * 0.2}`} stroke="#9d8a95" strokeWidth="2" fill="none" />
        </g>
      ))}
    </svg>
  );
}

/** Old records half-buried in the soil (decor). */
export function BuriedRecords({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 160" className={className} aria-hidden="true">
      {[
        [60, 90, -18, "#c4664f"],
        [150, 70, 12, "#e0a23a"],
        [240, 100, -6, "#4fb3a9"],
      ].map(([x, y, r, label], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="52" ry="50" fill="#17111d" stroke={INK} strokeWidth="3" />
          <ellipse cx={x} cy={y} rx="38" ry="36" fill="none" stroke="#3d2f45" strokeWidth="1.5" />
          <ellipse cx={x} cy={y} rx="26" ry="24" fill="none" stroke="#3d2f45" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="14" fill={label as string} stroke={INK} strokeWidth="2" />
          <circle cx={x} cy={y} r="3" fill="var(--parchment)" />
        </g>
      ))}
      {/* soil covering their lower halves */}
      <path d="M0 110 C40 100 80 118 120 108 C170 96 210 120 260 110 C280 106 292 112 300 110 L300 160 L0 160 Z" fill="#2c1d22" stroke={INK} strokeWidth="3" />
      <path d="M0 126 C60 120 120 134 180 124 C220 118 260 130 300 124" fill="none" stroke="#3d2a2e" strokeWidth="3" />
    </svg>
  );
}

export function Mushrooms({ className, tone = "teal" }: { className?: string; tone?: "teal" | "gold" }) {
  const cap = tone === "teal" ? ["#6cc8bd", "#9adbd0"] : ["#e0a23a", "#f4cf72"];
  const glow = tone === "teal" ? "url(#glow-teal)" : "url(#glow-amber)";
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true" overflow="visible">
      <g className="glow-shroom">
        <ellipse cx="100" cy="100" rx="110" ry="70" fill={glow} opacity="0.75" />
      </g>
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M60 160 L64 96 L80 96 L84 160 Z" fill="#e9dcc0" />
        <path d="M30 102 C30 56 116 52 116 102 C92 110 52 110 30 102 Z" fill={cap[0]} />
        <circle cx="56" cy="84" r="6" fill="#e9fff8" stroke="none" />
        <circle cx="86" cy="76" r="4" fill="#e9fff8" stroke="none" />
        <path d="M122 160 L124 120 L134 120 L136 160 Z" fill="#e9dcc0" />
        <path d="M106 124 C108 96 152 94 152 124 C138 130 120 130 106 124 Z" fill={cap[1]} />
        <path d="M156 160 L157 140 L163 140 L164 160 Z" fill="#e9dcc0" />
        <path d="M146 142 C148 128 172 126 174 142 C166 146 154 146 146 142 Z" fill={cap[0]} />
      </g>
    </svg>
  );
}

export function Teacup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M10 22 L70 22 C70 50 56 62 40 62 C24 62 10 50 10 22 Z" fill="var(--parchment)" />
        <path d="M70 30 C84 28 86 46 68 46" fill="none" />
        <path d="M18 34 C28 40 50 40 62 34" fill="none" stroke="var(--teal-500)" strokeWidth="3" />
        <ellipse cx="40" cy="22" rx="30" ry="6" fill="#6f3f39" />
        <path d="M30 14 C26 6 34 4 30 -4 M44 14 C40 6 48 4 44 -4" fill="none" stroke="#e9dcc0" strokeWidth="2" opacity="0.7" className="steam" />
      </g>
    </svg>
  );
}

export function Lantern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden="true" overflow="visible">
      <circle cx="40" cy="70" r="56" fill="url(#glow-amber)" className="glow-shroom" />
      <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M28 18 C28 4 52 4 52 18" fill="none" strokeWidth="3" />
        <path d="M22 26 L58 26 L52 18 L28 18 Z" fill="#3a2a2a" />
        <path d="M24 26 L56 26 L54 98 L26 98 Z" fill="#f4cf72" opacity="0.9" />
        <path d="M24 26 L26 98 M40 26 L40 98 M56 26 L54 98" stroke="#3a2a2a" strokeWidth="3" />
        <path d="M40 74 C34 64 40 56 40 50 C46 58 48 66 40 74 Z" fill="#fff1c4" stroke="none" className="flame" />
        <path d="M18 98 L62 98 L58 108 L22 108 Z" fill="#3a2a2a" />
      </g>
    </svg>
  );
}

/** A tunnel opening with a creature whose eyes blink. `peek` lifts it out a bit. */
export function Tunnel({ className, hue = "#2a1734" }: { className?: string; hue?: string }) {
  return (
    <svg viewBox="0 0 140 90" className={className} aria-hidden="true" overflow="visible">
      <ellipse cx="70" cy="50" rx="66" ry="40" fill="#120a14" stroke={INK} strokeWidth="3" />
      <ellipse cx="70" cy="56" rx="50" ry="28" fill="#1b1220" />
      <g className="tunnel-creature">
        <path d="M44 90 C40 56 54 40 70 40 C86 40 100 56 96 90 Z" fill={hue} stroke={INK} strokeWidth="2.6" />
        <circle cx="60" cy="60" r="7" fill="#f6dd8a" className="blink" />
        <circle cx="80" cy="60" r="7" fill="#f6dd8a" className="blink" />
        <circle cx="61" cy="61" r="3" fill={INK} />
        <circle cx="81" cy="61" r="3" fill={INK} />
      </g>
      {/* tunnel lip in front of the creature */}
      <path d="M4 56 C10 84 130 84 136 56 C136 96 4 96 4 56 Z" fill="#2c1d22" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/** The arch of the hidden listening chamber. */
export function Sanctuary({ className }: { className?: string }) {
  const spines = ["#c4664f", "#24706f", "#e0a23a", "#5a3260", "#d8c8a4", "#3f5a26", "#7a2f3a", "#34497c", "#4fb3a9", "#de8a72"];
  return (
    <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMax meet" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="chamber" cx="50%" cy="60%" r="60%">
          <stop offset="0" stopColor="#ffe3a0" />
          <stop offset="0.35" stopColor="#e0a23a" />
          <stop offset="0.75" stopColor="#7a3f3a" />
          <stop offset="1" stopColor="#2a1734" />
        </radialGradient>
      </defs>
      {/* chamber arch carved into the soil */}
      <path d="M90 560 L90 300 C90 120 230 40 400 40 C570 40 710 120 710 300 L710 560 Z" fill="url(#chamber)" stroke={INK} strokeWidth="6" />
      <path d="M90 560 L90 300 C90 120 230 40 400 40 C570 40 710 120 710 300 L710 560" fill="none" stroke="#8f6444" strokeWidth="14" opacity="0.6" />
      {/* light rays */}
      <g opacity="0.25" fill="#fff1c4">
        <path d="M400 120 L300 560 L360 560 Z" />
        <path d="M400 120 L440 560 L500 560 Z" />
        <path d="M400 120 L560 560 L600 560 Z" />
        <path d="M400 120 L200 560 L230 560 Z" />
      </g>
      {/* record shelves on both walls */}
      {[0, 1].map((side) => (
        <g key={side} stroke={INK} strokeWidth="2.5">
          {[260, 360].map((y) => (
            <g key={y}>
              <rect x={side ? 560 : 120} y={y} width="120" height="10" fill="#6f3f39" />
              {spines.map((c, i) => (
                <rect key={i} x={(side ? 566 : 126) + i * 11} y={y - 64 + (i % 3) * 4} width="9" height={64 - (i % 3) * 4} fill={c} strokeWidth="1.5" />
              ))}
            </g>
          ))}
        </g>
      ))}
      {/* candles */}
      {[150, 200, 610, 650].map((x, i) => (
        <g key={x} stroke={INK} strokeWidth="2">
          <rect x={x} y={470 - (i % 2) * 20} width="14" height={50 + (i % 2) * 20} rx="3" fill="var(--parchment)" />
          <path d={`M${x + 7} ${468 - (i % 2) * 20} c-6 -8 -2 -14 0 -20 c4 6 8 12 0 20 Z`} fill="var(--ochre-300)" className="flame" />
        </g>
      ))}
      {/* turntable altar */}
      <g stroke={INK} strokeWidth="3">
        <path d="M290 560 L300 470 L500 470 L510 560 Z" fill="#6f3f39" />
        <rect x="300" y="440" width="200" height="34" rx="6" fill="#a8693c" />
        <ellipse cx="390" cy="444" rx="80" ry="16" fill="#17111d" />
        <ellipse cx="390" cy="444" rx="22" ry="5" fill="var(--coral-500)" />
        <path d="M480 430 L440 448" strokeWidth="5" stroke="#d8c8a4" />
      </g>
    </svg>
  );
}

/**
 * Soil strata for the whole underground section. Stretched to fit
 * (preserveAspectRatio="none"); strokes keep their width.
 */
export function Strata({ className }: { className?: string }) {
  const bands = [
    ["M0 60 C150 40 300 90 500 66 C700 44 850 84 1000 62 L1000 230 C820 250 640 214 480 236 C300 258 140 222 0 240 Z", "#33212a"],
    ["M0 300 C180 280 360 330 540 304 C720 280 860 316 1000 298 L1000 470 C840 488 660 452 500 474 C320 496 160 460 0 478 Z", "#2a1d2c"],
    ["M0 540 C200 520 380 566 560 544 C740 522 880 560 1000 540 L1000 700 C820 720 640 690 480 708 C300 726 150 696 0 712 Z", "#211a33"],
    ["M0 770 C180 752 360 790 520 772 C700 752 860 786 1000 770 L1000 1000 L0 1000 Z", "#18152e"],
  ];
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className={className} aria-hidden="true">
      {bands.map(([d, c], i) => (
        <path key={i} d={d} fill={c} stroke={INK} strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.9" />
      ))}
      {/* mycelium: faint glowing threads */}
      <g fill="none" stroke="#9adbd0" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.5">
        <path d="M60 250 C160 270 220 330 320 350 C420 372 460 420 560 430" vectorEffect="non-scaling-stroke" />
        <path d="M980 120 C880 150 820 200 720 210 C640 220 600 260 520 270" vectorEffect="non-scaling-stroke" />
        <path d="M40 620 C140 600 240 640 340 630 C460 618 520 660 640 650" vectorEffect="non-scaling-stroke" />
        <path d="M960 520 C860 540 800 600 700 610" vectorEffect="non-scaling-stroke" />
        <path d="M200 860 C300 840 400 880 520 866 C640 852 700 890 820 880" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** The underside of the living-room floor, with the hole we fell through. */
export function Ceiling({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMin slice" className={className} aria-hidden="true">
      <rect x="0" y="0" width="1200" height="44" fill="#3a2216" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={i * 100 - 10} y="30" width="34" height="46" fill="#4a2c1c" stroke={INK} strokeWidth="3" />
      ))}
      <path d="M0 44 L1200 44" stroke={INK} strokeWidth="4" />
      <ellipse cx="600" cy="40" rx="150" ry="44" fill="url(#glow-teal)" />
      <ellipse cx="600" cy="30" rx="96" ry="22" fill="#9adbd0" stroke={INK} strokeWidth="4" />
      <ellipse cx="600" cy="30" rx="70" ry="12" fill="#e9fff8" opacity="0.7" />
    </svg>
  );
}

type ArtifactKind = "mic" | "cassette" | "headphones" | "fish" | "bottle" | "watch" | "bone" | "gear";

/** Small buried things, purely decorative. */
export function Artifact({ kind, className }: { kind: ArtifactKind; className?: string }) {
  const g = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" overflow="visible">
      {kind === "mic" && (
        <g {...g} transform="rotate(-24 50 50)">
          <rect x="38" y="10" width="24" height="40" rx="12" fill="#8f8aa0" />
          <path d="M40 22 h20 M40 30 h20 M40 38 h20" stroke="#5b5670" strokeWidth="2" />
          <path d="M30 40 C30 62 70 62 70 40" fill="none" strokeWidth="3" />
          <rect x="46" y="58" width="8" height="30" fill="#3a2a2a" />
          <path d="M36 90 h28" strokeWidth="5" />
        </g>
      )}
      {kind === "cassette" && (
        <g {...g} transform="rotate(12 50 50)">
          <rect x="8" y="26" width="84" height="52" rx="6" fill="#c4664f" />
          <rect x="20" y="34" width="60" height="22" rx="3" fill="var(--parchment)" />
          <circle cx="34" cy="45" r="7" fill="#3a2a2a" />
          <circle cx="66" cy="45" r="7" fill="#3a2a2a" />
          <path d="M26 72 L32 62 L68 62 L74 72" fill="#7a2f3a" />
          <path d="M20 40 h60" stroke="#c4664f" strokeWidth="2" />
        </g>
      )}
      {kind === "headphones" && (
        <g {...g} transform="rotate(-10 50 50)">
          <path d="M18 60 C14 20 86 20 82 60" fill="none" strokeWidth="9" stroke={INK} />
          <path d="M18 60 C14 20 86 20 82 60" fill="none" strokeWidth="5" stroke="#4fb3a9" />
          <rect x="8" y="52" width="20" height="30" rx="8" fill="#e0a23a" />
          <rect x="72" y="52" width="20" height="30" rx="8" fill="#e0a23a" />
        </g>
      )}
      {kind === "fish" && (
        <g {...g} fill="none" stroke="#e9dcc0" strokeWidth="3">
          <path d="M14 50 L80 50" />
          {[26, 38, 50, 62].map((x) => (
            <path key={x} d={`M${x} 36 C${x + 4} 44 ${x + 4} 56 ${x} 64`} />
          ))}
          <path d="M80 50 C86 38 98 40 96 50 C98 60 86 62 80 50 Z" fill="#e9dcc0" stroke={INK} strokeWidth="2" />
          <circle cx="90" cy="48" r="2.5" fill={INK} stroke="none" />
          <path d="M14 50 L4 40 M14 50 L4 60" />
        </g>
      )}
      {kind === "bottle" && (
        <g {...g} transform="rotate(-50 50 50)">
          <path d="M42 8 L58 8 L58 26 C72 32 72 44 72 52 L72 90 L28 90 L28 52 C28 44 28 32 42 26 Z" fill="#6cc8bd" opacity="0.8" />
          <rect x="40" y="2" width="20" height="10" rx="2" fill="#a86d1f" />
          <path d="M38 56 L62 52 L64 74 L40 78 Z" fill="var(--parchment)" strokeWidth="1.6" />
          <path d="M42 62 h16 M43 68 h12" stroke="#7a2f3a" strokeWidth="1.5" />
        </g>
      )}
      {kind === "watch" && (
        <g {...g}>
          <path d="M50 14 C40 4 60 4 50 14" fill="none" strokeWidth="3" />
          <circle cx="50" cy="52" r="34" fill="var(--ochre-500)" />
          <circle cx="50" cy="52" r="26" fill="var(--parchment)" />
          <path d="M50 52 L50 34 M50 52 L62 58" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="52" r="3" fill={INK} />
        </g>
      )}
      {kind === "bone" && (
        <g {...g} transform="rotate(20 50 50)">
          <path d="M22 44 C10 36 16 22 28 30 C30 20 44 24 38 36 L64 58 C76 52 84 64 72 70 C80 78 68 90 60 80 L34 56 C28 62 14 58 22 44 Z" fill="#e9dcc0" />
        </g>
      )}
      {kind === "gear" && (
        <g {...g}>
          <path
            d="M50 14 L57 14 L59 24 L68 28 L76 21 L82 27 L75 36 L79 45 L89 47 L89 55 L79 57 L75 66 L82 74 L76 80 L68 73 L59 77 L57 87 L49 87 L47 77 L38 73 L30 80 L24 74 L31 66 L27 57 L17 55 L17 47 L27 45 L31 36 L24 27 L30 21 L38 28 L47 24 Z"
            fill="#8f6444"
          />
          <circle cx="53" cy="51" r="11" fill="#2c1d22" />
        </g>
      )}
    </svg>
  );
}
