/**
 * Living-room illustrations, one SVG per object so each can be its own
 * interactive element. viewBoxes define each object's proportions;
 * placement lives in content/room.ts.
 */
import type { RoomObjectId } from "@/content/room";

const INK = "var(--line)";
const W = 3; // standard ink weight

function Bookcase() {
  const books = [
    // shelf y, [x, w, h, color, lean]
    [118, [[18, 16, 64, "#7a2f3a", 0], [35, 12, 58, "#c4664f", 0], [48, 20, 70, "#3f5a26", 0], [70, 14, 60, "#e0a23a", 0], [86, 10, 52, "#34497c", 0], [100, 18, 68, "#5a3260", -8], [150, 14, 66, "#24706f", 0], [166, 20, 60, "#a86d1f", 0], [188, 12, 70, "#7a2f3a", 0], [204, 16, 56, "#d8c8a4", 0], [222, 22, 64, "#3d2147", 6]]],
    [230, [[18, 22, 62, "#24706f", 0], [42, 14, 56, "#d8c8a4", 0], [58, 12, 66, "#c4664f", 0], [72, 18, 60, "#34497c", 0], [92, 14, 52, "#e0a23a", 0], [150, 16, 64, "#5a3260", 0], [168, 12, 58, "#3f5a26", 0], [182, 20, 68, "#7a2f3a", 0], [204, 14, 60, "#a86d1f", 0], [220, 18, 54, "#3d2147", 0]]],
    [342, [[18, 30, 22, "#c4664f", 0], [18, 30, 18, "#3f5a26", 0], [60, 16, 64, "#e0a23a", 0], [78, 12, 60, "#24706f", 0], [92, 16, 58, "#7a2f3a", 0], [110, 14, 66, "#d8c8a4", 0], [126, 18, 62, "#34497c", 0], [146, 12, 54, "#5a3260", 0], [196, 20, 60, "#a86d1f", 0], [218, 16, 66, "#3f5a26", 0]]],
  ] as const;
  return (
    <svg viewBox="0 0 270 520" aria-hidden="true">
      {/* trailing plant on top */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M196 30 L230 30 L226 52 L200 52 Z" fill="var(--coral-500)" />
        <g className="sway" style={{ transformOrigin: "212px 30px" }}>
          <path d="M210 30 C200 10 190 6 180 2 M214 30 C230 8 244 6 256 10" fill="none" stroke="#3f5a26" strokeWidth="3" />
          <path d="M226 50 C240 80 236 120 246 150" fill="none" stroke="#3f5a26" strokeWidth="3" />
          {[70, 100, 130].map((y, i) => (
            <path key={y} d={`M${238 + (i % 2) * 6} ${y} c10 -4 18 4 14 12 c-10 2 -16 -4 -14 -12 Z`} fill="#6b8a37" />
          ))}
          <path d="M180 2 c-8 0 -12 10 -6 14 c8 -2 10 -10 6 -14 Z" fill="#6b8a37" />
        </g>
        {/* candle */}
        <rect x="42" y="18" width="14" height="36" rx="3" fill="var(--parchment)" />
        <path d="M49 18 C44 10 48 4 49 0 C52 6 54 12 49 18 Z" fill="var(--ochre-300)" className="flame" />
        <rect x="34" y="52" width="30" height="6" rx="3" fill="#a86d1f" />
        {/* jar */}
        <path d="M100 30 L122 30 L124 56 L98 56 Z" fill="#9adbd0" opacity="0.85" />
        <rect x="98" y="24" width="26" height="8" rx="2" fill="#6f3f39" />
      </g>
      {/* carcass */}
      <rect x="6" y="58" width="258" height="456" rx="6" fill="#6f3f39" stroke={INK} strokeWidth={W + 1} />
      <rect x="18" y="70" width="234" height="432" fill="#3a2020" stroke={INK} strokeWidth="2" />
      <rect x="18" y="70" width="234" height="432" fill="url(#hatch)" opacity="0.6" />
      {[182, 294, 406].map((y) => (
        <rect key={y} x="12" y={y - 2} width="246" height="12" fill="#8a4f3a" stroke={INK} strokeWidth="2.5" />
      ))}
      {books.map(([shelf, row]) => (
        <g key={shelf} stroke={INK} strokeWidth="2">
          {row.map(([x, w, h, c, lean], i) => (
            <g key={i} transform={lean ? `rotate(${lean} ${x + w / 2} ${shelf + 62})` : undefined}>
              <rect x={x} y={shelf + 62 - h} width={w} height={h} fill={c} rx="1.5" />
              <path d={`M${x + 2} ${shelf + 62 - h + 8} h${w - 4} M${x + 2} ${shelf + 52} h${w - 4}`} stroke="#f3e7cc" strokeOpacity="0.45" strokeWidth="1.5" />
            </g>
          ))}
        </g>
      ))}
      {/* the glowing book, pulled half out */}
      <g className="glow-book">
        <ellipse cx="132" cy="150" rx="48" ry="46" fill="url(#glow-teal)" />
        <g transform="rotate(-10 132 180)" stroke={INK} strokeWidth="2.5">
          <rect x="118" y="114" width="28" height="68" rx="2" fill="#4fb3a9" />
          <path d="M124 128 h16 M124 166 h16" stroke="#e9fff8" strokeWidth="2" />
          <circle cx="132" cy="147" r="6" fill="var(--moon)" strokeWidth="1.8" />
        </g>
      </g>
      {/* small skull bookend & curiosities on lower shelf */}
      <g stroke={INK} strokeWidth="2.2">
        <path d="M150 400 C146 380 160 368 174 370 C188 372 194 386 190 400 L184 404 L156 404 Z" fill="#e9dcc0" />
        <ellipse cx="163" cy="388" rx="5" ry="6" fill="var(--plum-950)" />
        <ellipse cx="179" cy="388" rx="5" ry="6" fill="var(--plum-950)" />
        <circle cx="100" cy="500" r="0" />
      </g>
      {/* bottom drawer: odd objects */}
      <g stroke={INK} strokeWidth="2.2">
        <path d="M30 498 C30 470 70 462 84 476 L88 498 Z" fill="#a86d1f" />
        <circle cx="128" cy="484" r="14" fill="#5a3260" />
        <path d="M128 470 v-10" stroke={INK} />
        <rect x="160" y="456" width="60" height="42" rx="4" fill="#34497c" />
        <path d="M168 470 h44 M168 482 h30" stroke="#d8c8a4" strokeWidth="2" />
      </g>
    </svg>
  );
}

function Clock() {
  return (
    <svg viewBox="0 0 90 230" aria-hidden="true">
      <g stroke={INK} strokeLinejoin="round">
        <path d="M14 70 L14 200 L45 224 L76 200 L76 70 Z" fill="#7a4632" strokeWidth={W} />
        <rect x="24" y="92" width="42" height="96" rx="20" fill="#2a1734" strokeWidth="2.5" />
        {/* the key, hidden behind the pendulum until found */}
        <g data-part="key">
          <circle cx="56" cy="174" r="5" fill="var(--ochre-500)" strokeWidth="1.6" />
          <rect x="40" y="172" width="13" height="3.5" fill="var(--ochre-500)" strokeWidth="1.2" />
        </g>
        <g className="pendulum" style={{ transformOrigin: "45px 92px" }}>
          <path d="M45 92 L45 160" stroke="#c99a5b" strokeWidth="3" />
          <circle cx="45" cy="166" r="11" fill="var(--ochre-500)" strokeWidth="2.5" />
          <circle cx="42" cy="163" r="3" fill="var(--moon)" stroke="none" />
        </g>
        <circle cx="45" cy="44" r="40" fill="#7a4632" strokeWidth={W} />
        <circle cx="45" cy="44" r="31" fill="var(--parchment)" strokeWidth="2.5" />
        {/* odd numerals: 13 where 12 should be */}
        <g fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill={INK} stroke="none" textAnchor="middle">
          <text x="45" y="23">13</text>
          <text x="68" y="47">3</text>
          <text x="45" y="72">6</text>
          <text x="22" y="47">?</text>
        </g>
        <path d="M45 44 L45 26" strokeWidth="3" strokeLinecap="round" />
        <path d="M45 44 L58 52" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="45" cy="44" r="3" fill={INK} />
        <path d="M30 6 C36 -2 54 -2 60 6" fill="none" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function Portrait() {
  return (
    <svg viewBox="0 0 160 200" aria-hidden="true">
      <g stroke={INK} strokeLinejoin="round">
        <rect x="4" y="4" width="152" height="192" rx="10" fill="#c99a3c" strokeWidth={W + 0.5} />
        <rect x="14" y="14" width="132" height="172" rx="4" fill="#a87425" strokeWidth="2" />
        <rect x="20" y="20" width="120" height="160" fill="#3d2147" strokeWidth="2.5" />
        <rect x="20" y="20" width="120" height="160" fill="url(#hatch-light)" stroke="none" />
        {/* painted subject: a cloud in its Sunday best */}
        <path d="M44 150 C30 148 30 128 44 124 C38 104 58 92 74 100 C82 80 108 80 114 98 C130 96 140 112 132 126 C142 134 136 152 120 152 Z" fill="#e3a49a" strokeWidth="2.5" />
        <path d="M60 152 L58 180 L102 180 L100 152 Z" fill="#2a1734" strokeWidth="2.2" />
        <path d="M74 152 L80 164 L86 152" fill="var(--parchment)" strokeWidth="1.8" />
        {/* tiny hat */}
        <path d="M70 92 L72 70 L100 70 L102 92 Z" fill="#1b1024" strokeWidth="2.2" />
        <path d="M62 92 L110 92" strokeWidth="4" strokeLinecap="round" />
        {/* eyes that occasionally look at the visitor */}
        <ellipse cx="72" cy="120" rx="10" ry="8" fill="var(--parchment)" strokeWidth="2" />
        <ellipse cx="104" cy="120" rx="10" ry="8" fill="var(--parchment)" strokeWidth="2" />
        <g className="portrait-eyes">
          <circle cx="68" cy="121" r="4" fill={INK} stroke="none" />
          <circle cx="100" cy="121" r="4" fill={INK} stroke="none" />
        </g>
        <path d="M60 108 C66 104 76 104 82 108 M94 108 C100 104 110 104 116 108" fill="none" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="104" cy="120" r="12" fill="none" strokeWidth="1.8" />
        <path d="M116 122 C124 130 124 140 120 150" fill="none" strokeWidth="1.4" />
        <path d="M80 136 C86 140 92 140 96 136" fill="none" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Lamp() {
  return (
    <svg viewBox="0 0 110 430" aria-hidden="true" overflow="visible">
      <g className="lamp-glow">
        <ellipse cx="55" cy="70" rx="90" ry="80" fill="url(#glow-amber)" />
      </g>
      <g stroke={INK} strokeLinejoin="round">
        <path d="M53 110 L53 400" stroke="#8a5a1c" strokeWidth="6" />
        <path d="M53 110 L53 400" stroke={INK} strokeWidth="1" opacity="0.5" />
        <path d="M24 424 C24 404 86 404 86 424 Z" fill="#7a4632" strokeWidth={W} />
        <path d="M14 104 L30 30 L80 30 L96 104 Z" fill="var(--ochre-500)" strokeWidth={W} className="lamp-shade" />
        <path d="M30 30 L22 104 M44 30 L40 104 M62 30 L66 104 M78 30 L86 104" stroke="#a86d1f" strokeWidth="1.5" />
        {/* tassels */}
        {[18, 32, 46, 60, 74, 88].map((x) => (
          <path key={x} d={`M${x} 104 L${x} 116`} stroke="#c4664f" strokeWidth="3" strokeLinecap="round" />
        ))}
        <path d="M14 104 L96 104" strokeWidth={W} />
        <path d="M60 104 L60 136" stroke="#8a5a1c" strokeWidth="1.5" />
        <circle cx="60" cy="138" r="3" fill="var(--ochre-300)" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function Sofa() {
  return (
    <svg viewBox="0 0 460 230" aria-hidden="true">
      <defs>
        <linearGradient id="velvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3566a" />
          <stop offset="1" stopColor="#6d3049" />
        </linearGradient>
      </defs>
      <g stroke={INK} strokeLinejoin="round">
        {/* legs */}
        <path d="M54 206 L48 228 L60 228 L66 206 M394 206 L400 228 L412 228 L406 206" fill="#5a3622" strokeWidth="2.5" />
        {/* back */}
        <path d="M40 140 C30 70 50 30 110 28 L350 28 C410 30 430 70 420 140 Z" fill="url(#velvet)" strokeWidth={W + 0.5} />
        {[120, 190, 260, 330].map((x) => (
          <g key={x}>
            <path d={`M${x} 40 C${x - 8} 70 ${x + 8} 100 ${x} 130`} fill="none" stroke="#5a2440" strokeWidth="2" opacity="0.7" />
            <circle cx={x} cy="84" r="3.5" fill="#3d1a2c" stroke="none" />
          </g>
        ))}
        {/* worn patches */}
        <path d="M150 60 C170 54 196 56 210 66" fill="none" stroke="#c98a9a" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        {/* seat */}
        <path d="M44 132 L416 132 C430 132 434 150 430 170 L30 170 C26 150 30 132 44 132 Z" fill="#94485e" strokeWidth={W} />
        <path d="M230 134 L230 168" strokeWidth="2" />
        {/* arms */}
        <path d="M6 122 C4 96 22 84 44 88 C60 92 64 110 62 130 L66 206 L18 206 C10 180 8 150 6 122 Z" fill="url(#velvet)" strokeWidth={W} />
        <path d="M454 122 C456 96 438 84 416 88 C400 92 396 110 398 130 L394 206 L442 206 C450 180 452 150 454 122 Z" fill="url(#velvet)" strokeWidth={W} />
        {/* base */}
        <path d="M30 168 L430 168 L426 208 L34 208 Z" fill="#6d3049" strokeWidth={W} />
        <path d="M34 196 L426 196" stroke="#5a2440" strokeWidth="2" />
        {/* crochet throw */}
        <path d="M300 34 L360 30 L376 150 L330 176 L300 150 Z" fill="#4fb3a9" strokeWidth="2.5" />
        {[0, 1, 2, 3].map((r) =>
          [0, 1].map((c) => (
            <rect key={`${r}${c}`} x={310 + c * 26} y={46 + r * 28} width="18" height="18" fill={(r + c) % 2 ? "var(--ochre-300)" : "var(--coral-500)"} strokeWidth="1.5" transform={`rotate(-4 ${319 + c * 26} ${55 + r * 28})`} />
          )),
        )}
        {/* cushion with a moon */}
        <path d="M86 132 C70 104 84 76 110 78 L170 82 C190 84 196 108 186 134 Z" fill="var(--ochre-500)" strokeWidth="2.5" />
        <path d="M144 96 C130 98 126 116 138 124 C130 114 134 102 144 96 Z" fill="var(--parchment)" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

function Plant() {
  return (
    <svg viewBox="0 0 100 250" aria-hidden="true" overflow="visible">
      <g stroke={INK} strokeLinejoin="round">
        <g className="sway plant-leaves" style={{ transformOrigin: "50px 180px" }}>
          <path d="M50 180 C46 130 30 90 10 60" fill="none" stroke="#3f5a26" strokeWidth="3" />
          <path d="M50 180 C54 120 70 80 92 50" fill="none" stroke="#3f5a26" strokeWidth="3" />
          <path d="M50 180 C50 120 52 60 48 10" fill="none" stroke="#3f5a26" strokeWidth="3" />
          <path d="M10 60 C-6 40 4 14 26 22 C36 40 30 56 10 60 Z" fill="#6b8a37" strokeWidth="2.5" />
          <path d="M92 50 C108 30 96 6 76 14 C66 32 72 48 92 50 Z" fill="#4c6a2c" strokeWidth="2.5" />
          <path d="M48 10 C30 -6 66 -10 60 14 C56 30 44 26 48 10 Z" fill="#7f9d3f" strokeWidth="2.5" />
          <path d="M32 120 C10 112 8 92 26 90 C38 100 40 112 32 120 Z" fill="#6b8a37" strokeWidth="2.5" />
          <path d="M66 110 C90 106 92 84 74 82 C62 92 60 104 66 110 Z" fill="#7f9d3f" strokeWidth="2.5" />
          {/* it has eyes. of course it does. */}
          <circle cx="20" cy="40" r="2.4" fill={INK} stroke="none" className="blink" />
          <circle cx="27" cy="38" r="2.4" fill={INK} stroke="none" className="blink" />
        </g>
        <path d="M20 180 L80 180 L72 246 L28 246 Z" fill="var(--coral-500)" strokeWidth={W} />
        <path d="M18 176 L82 176 L82 188 L18 188 Z" fill="var(--coral-600)" strokeWidth="2.5" />
        <path d="M30 208 C40 200 60 216 70 208 M32 226 C42 218 58 234 68 226" fill="none" stroke="var(--parchment)" strokeWidth="2" />
      </g>
    </svg>
  );
}

function Tv() {
  return (
    <svg viewBox="0 0 220 300" aria-hidden="true">
      <defs>
        <clipPath id="room-tv-screen">
          <rect x="34" y="72" width="118" height="92" rx="18" />
        </clipPath>
      </defs>
      <g stroke={INK} strokeLinejoin="round">
        {/* antenna */}
        <path d="M100 52 L64 6 M110 52 L150 2" strokeWidth="3" strokeLinecap="round" />
        <circle cx="64" cy="6" r="4" fill="var(--ochre-300)" strokeWidth="2" />
        <circle cx="150" cy="2" r="4" fill="var(--ochre-300)" strokeWidth="2" />
        <path d="M86 56 C86 44 124 44 124 56 Z" fill="#3a2a2a" strokeWidth="2.5" />
        {/* set */}
        <rect x="16" y="54" width="190" height="130" rx="16" fill="#8a5a34" strokeWidth={W + 0.5} />
        <rect x="16" y="54" width="190" height="130" rx="16" fill="url(#hatch)" opacity="0.4" stroke="none" />
        <rect x="28" y="66" width="130" height="104" rx="22" fill="#2a1f22" strokeWidth="2.5" />
        <g clipPath="url(#room-tv-screen)">
          <rect x="34" y="72" width="118" height="92" fill="#556b74" className="tv-screen" />
          <g className="tv-static" stroke="none">
            {Array.from({ length: 14 }, (_, i) => (
              <rect key={i} x={34 + ((i * 37) % 100)} y={74 + i * 6.5} width={18 + ((i * 13) % 40)} height="2.5" fill="#cfe7e3" opacity={0.25 + (i % 3) * 0.2} />
            ))}
          </g>
          <rect className="tv-scanline" x="34" y="72" width="118" height="10" fill="#e9fff8" opacity="0.18" stroke="none" />
          <path d="M44 84 C60 76 90 74 110 78" stroke="#e9fff8" strokeWidth="4" opacity="0.25" fill="none" strokeLinecap="round" />
        </g>
        {/* knobs */}
        <circle cx="182" cy="92" r="11" fill="#d8c8a4" strokeWidth="2.5" />
        <path d="M182 84 L182 92" strokeWidth="2.5" />
        <circle cx="182" cy="126" r="9" fill="#d8c8a4" strokeWidth="2.5" />
        <path d="M170 148 h24 M170 156 h24 M170 164 h24" stroke="#5a3622" strokeWidth="2.5" />
        {/* cabinet */}
        <rect x="6" y="184" width="208" height="104" rx="6" fill="#6f3f39" strokeWidth={W + 0.5} />
        <path d="M110 190 L110 282" strokeWidth="2.5" />
        <circle cx="98" cy="236" r="4" fill="var(--ochre-300)" strokeWidth="1.6" />
        <circle cx="122" cy="236" r="4" fill="var(--ochre-300)" strokeWidth="1.6" />
        <path d="M20 200 C40 210 60 200 80 210 M140 220 C160 230 180 220 200 230" fill="none" stroke="#8a4f3a" strokeWidth="2" />
        <path d="M14 288 L10 298 L24 298 L26 288 M196 288 L198 298 L212 298 L208 288" fill="#5a3622" strokeWidth="2" />
      </g>
    </svg>
  );
}

function RecordPlayer() {
  const spines = ["#c4664f", "#24706f", "#e0a23a", "#5a3260", "#d8c8a4", "#3f5a26", "#7a2f3a", "#34497c", "#a86d1f", "#4fb3a9", "#de8a72", "#3d2147"];
  return (
    <svg viewBox="0 0 220 300" aria-hidden="true">
      <g stroke={INK} strokeLinejoin="round">
        {/* turntable */}
        <rect x="18" y="62" width="184" height="58" rx="8" fill="#a8693c" strokeWidth={W} />
        <rect x="18" y="62" width="184" height="58" rx="8" fill="url(#hatch)" opacity="0.35" stroke="none" />
        <ellipse cx="96" cy="70" rx="72" ry="22" fill="#2a1f22" strokeWidth="2.5" />
        <g className="spin-record" style={{ transformOrigin: "96px 66px" }}>
          <ellipse cx="96" cy="66" rx="64" ry="18" fill="#17111d" strokeWidth="2" />
          <ellipse cx="96" cy="66" rx="48" ry="13" fill="none" stroke="#3d2f45" strokeWidth="1.5" />
          <ellipse cx="96" cy="66" rx="34" ry="9" fill="none" stroke="#3d2f45" strokeWidth="1.5" />
          <ellipse cx="96" cy="66" rx="18" ry="5" fill="var(--coral-500)" strokeWidth="1.5" />
          <path d="M52 60 C60 54 72 52 80 52" stroke="#9adbd0" strokeWidth="2" opacity="0.6" fill="none" />
        </g>
        <ellipse cx="96" cy="66" rx="3" ry="1.5" fill="var(--parchment)" strokeWidth="1" />
        {/* tonearm */}
        <g className="tonearm" style={{ transformOrigin: "178px 52px" }}>
          <circle cx="178" cy="52" r="9" fill="#d8c8a4" strokeWidth="2.5" />
          <path d="M178 52 L150 76 L130 74" fill="none" stroke="#d8c8a4" strokeWidth="5" strokeLinecap="round" />
          <path d="M178 52 L150 76 L130 74" fill="none" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="122" y="70" width="12" height="7" rx="2" fill="#3a2a2a" strokeWidth="1.5" />
        </g>
        <circle cx="186" cy="104" r="5" fill="var(--ochre-300)" strokeWidth="1.6" />
        {/* music notes drifting up */}
        <g className="notes" fill={INK} stroke="none">
          <path d="M40 30 v-16 l10 -3 v14" stroke={INK} strokeWidth="2" fill="none" />
          <ellipse cx="37" cy="31" rx="4" ry="3" />
          <ellipse cx="47" cy="26" rx="4" ry="3" />
          <path d="M150 20 v-14" stroke={INK} strokeWidth="2" />
          <ellipse cx="147" cy="21" rx="4" ry="3" />
        </g>
        {/* sideboard with vinyl cubbies */}
        <rect x="8" y="120" width="204" height="168" rx="6" fill="#6f3f39" strokeWidth={W + 0.5} />
        <rect x="18" y="132" width="88" height="146" fill="#2a1717" strokeWidth="2" />
        <rect x="114" y="132" width="88" height="146" fill="#2a1717" strokeWidth="2" />
        {spines.map((c, i) => (
          <rect key={i} x={20 + (i % 6) * 14 + (i >= 6 ? 96 : 0)} y={i % 2 ? 150 : 146} width="12" height={i % 2 ? 128 : 132} fill={c} strokeWidth="1.5" transform={i === 5 ? "rotate(-8 92 278)" : undefined} />
        ))}
        <path d="M14 288 L10 298 L24 298 L26 288 M194 288 L196 298 L210 298 L206 288" fill="#5a3622" strokeWidth="2" />
      </g>
    </svg>
  );
}

function Computer() {
  return (
    <svg viewBox="0 0 200 300" aria-hidden="true">
      <g stroke={INK} strokeLinejoin="round">
        {/* monitor */}
        <path d="M30 22 L170 22 L176 128 L24 128 Z" fill="#d9cfb0" strokeWidth={W} />
        <path d="M30 22 L170 22 L176 128 L24 128 Z" fill="url(#hatch)" opacity="0.25" stroke="none" />
        <rect x="40" y="34" width="120" height="80" rx="12" fill="#10261f" strokeWidth="2.5" />
        <g className="crt-glow" stroke="none">
          <rect x="44" y="38" width="112" height="72" rx="10" fill="#1b4a3a" />
          <text x="54" y="58" fontFamily="var(--font-vt323), monospace" fontSize="14" fill="#b8f5d9">SageNet</text>
          <text x="54" y="74" fontFamily="var(--font-vt323), monospace" fontSize="10" fill="#7fd9b0">C:\HOUSE&gt; dial</text>
          <rect className="cursor-blink" x="118" y="66" width="6" height="10" fill="#b8f5d9" />
          <path d="M54 88 h70 M54 98 h48" stroke="#7fd9b0" strokeWidth="3" opacity="0.6" />
        </g>
        <path d="M72 128 L66 146 L134 146 L128 128" fill="#cfc4a3" strokeWidth="2.5" />
        <circle cx="152" cy="120" r="2.5" fill="#6ce08a" stroke="none" />
        {/* desktop box */}
        <rect x="14" y="146" width="172" height="34" rx="4" fill="#d9cfb0" strokeWidth={W} />
        <rect x="30" y="156" width="54" height="8" rx="2" fill="#2a1f22" strokeWidth="1.5" />
        <circle cx="160" cy="163" r="5" fill="#c4664f" strokeWidth="1.5" />
        {/* keyboard */}
        <path d="M20 192 L172 192 L180 210 L12 210 Z" fill="#e3dabd" strokeWidth="2.5" />
        <path d="M30 199 h132 M26 205 h140" stroke="#a69b7c" strokeWidth="2" strokeDasharray="5 3" />
        {/* desk */}
        <rect x="2" y="210" width="196" height="16" rx="3" fill="#7a4632" strokeWidth={W} />
        <path d="M14 226 L14 296 M186 226 L186 296" strokeWidth="9" stroke="#5a3622" />
        <path d="M14 226 L14 296 M186 226 L186 296" strokeWidth="1.5" />
        {/* floppy */}
        <rect x="150" y="196" width="0" height="0" />
        <rect x="132" y="232" width="26" height="26" rx="2" fill="#34497c" strokeWidth="2" transform="rotate(8 145 245)" />
        <rect x="138" y="234" width="14" height="8" fill="#d8c8a4" strokeWidth="1.2" transform="rotate(8 145 245)" />
      </g>
    </svg>
  );
}

function Phone() {
  return (
    <svg viewBox="0 0 120 190" aria-hidden="true">
      <g stroke={INK} strokeLinejoin="round">
        {/* side table */}
        <path d="M18 92 L102 92 L96 104 L24 104 Z" fill="#7a4632" strokeWidth={W} />
        <path d="M14 86 C30 82 90 82 106 86 L102 94 L18 94 Z" fill="var(--parchment)" strokeWidth="2" />
        <path d="M20 94 C26 100 32 94 38 100 C44 94 50 100 56 94 C62 100 68 94 74 100 C80 94 86 100 92 94 C96 98 100 96 102 94" fill="none" strokeWidth="1.5" />
        <path d="M34 104 L28 188 M86 104 L92 188 M60 104 L60 188" strokeWidth="6" stroke="#5a3622" />
        <path d="M30 150 L90 150" strokeWidth="4" stroke="#5a3622" />
        {/* rotary phone */}
        <path d="M26 84 C24 60 36 46 60 46 C84 46 96 60 94 84 Z" fill="#d0533f" strokeWidth={W} />
        <g className="receiver">
          <path d="M18 44 C18 30 30 28 36 34 L84 34 C90 28 102 30 102 44 C102 52 92 54 88 48 L32 48 C28 54 18 52 18 44 Z" fill="#b8402f" strokeWidth={W} />
        </g>
        <circle cx="60" cy="68" r="15" fill="var(--parchment)" strokeWidth="2.5" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 1.6 + Math.PI * 0.75;
          return <circle key={i} cx={(60 + Math.cos(a) * 10).toFixed(2)} cy={(68 + Math.sin(a) * 10).toFixed(2)} r="2.4" fill="#3a2a2a" strokeWidth="0.8" />;
        })}
        <circle cx="60" cy="68" r="4" fill="var(--ochre-300)" strokeWidth="1.5" />
        <path d="M92 76 C112 80 108 96 100 98" fill="none" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

function Trunk() {
  return (
    <svg viewBox="0 0 240 170" aria-hidden="true" overflow="visible">
      <g stroke={INK} strokeLinejoin="round">
        <ellipse cx="120" cy="64" rx="100" ry="26" fill="url(#glow-amber)" stroke="none" className="trunk-glow" />
        <g className="trunk-body">
          <rect x="12" y="62" width="216" height="100" rx="8" fill="#34497c" strokeWidth={W + 0.5} />
          <rect x="12" y="62" width="216" height="100" rx="8" fill="url(#hatch)" opacity="0.4" stroke="none" />
          <path d="M60 62 L60 162 M180 62 L180 162" stroke="#a86d1f" strokeWidth="10" />
          <path d="M60 62 L60 162 M180 62 L180 162" strokeWidth="1.5" />
          {/* stickers */}
          <rect x="82" y="90" width="44" height="28" rx="4" fill="var(--parchment)" strokeWidth="2" transform="rotate(-6 104 104)" />
          <text x="104" y="108" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8.5" fontWeight="700" fill={INK} stroke="none" transform="rotate(-6 104 104)">
            CURIOS
          </text>
          <circle cx="146" cy="128" r="12" fill="var(--coral-500)" strokeWidth="2" />
          <path d="M140 128 C143 122 149 122 152 128" fill="none" strokeWidth="1.6" />
          <rect x="108" y="128" width="24" height="20" rx="3" fill="var(--ochre-300)" strokeWidth="2" />
          <circle cx="120" cy="138" r="3" fill={INK} stroke="none" />
          {/* lid, ajar */}
          <g className="trunk-lid" style={{ transformOrigin: "16px 62px" }}>
            <path d="M12 62 C12 30 40 20 120 20 C200 20 228 30 228 62 Z" fill="#3f5690" strokeWidth={W + 0.5} transform="rotate(-6 16 62)" />
            <path d="M60 24 L60 62 M180 24 L180 62" stroke="#a86d1f" strokeWidth="10" transform="rotate(-6 16 62)" />
          </g>
          {/* a sock escaping */}
          <path d="M200 56 C214 40 228 46 230 56 C232 66 222 70 214 66" fill="var(--coral-300)" strokeWidth="2" />
          <path d="M8 156 L8 166 L22 166 L22 156 M218 156 L218 166 L232 166 L232 156" fill="#a86d1f" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}

export const roomArt: Record<RoomObjectId, () => React.JSX.Element> = {
  bookcase: Bookcase,
  clock: Clock,
  portrait: Portrait,
  lamp: Lamp,
  sofa: Sofa,
  plant: Plant,
  tv: Tv,
  "record-player": RecordPlayer,
  computer: Computer,
  phone: Phone,
  trunk: Trunk,
};

/** Rug (decor). Slides aside in scene 4. */
export function Rug() {
  return (
    <svg viewBox="0 0 420 130" aria-hidden="true">
      <g stroke={INK} strokeLinejoin="round">
        <ellipse cx="210" cy="65" rx="206" ry="60" fill="#a8562f" strokeWidth={W + 0.5} />
        <ellipse cx="210" cy="65" rx="178" ry="50" fill="#e0a23a" strokeWidth="2" />
        <ellipse cx="210" cy="65" rx="150" ry="41" fill="#6d3049" strokeWidth="2" />
        <ellipse cx="210" cy="65" rx="118" ry="31" fill="#de8a72" strokeWidth="2" />
        <ellipse cx="210" cy="65" rx="84" ry="21" fill="#3f5a26" strokeWidth="2" />
        <ellipse cx="210" cy="65" rx="48" ry="11" fill="#f4cf72" strokeWidth="2" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <circle key={i} cx={(210 + Math.cos(a) * 164).toFixed(1)} cy={(65 + Math.sin(a) * 45.5).toFixed(1)} r="4" fill="var(--parchment)" strokeWidth="1.2" />;
        })}
        <ellipse cx="210" cy="65" rx="206" ry="60" fill="url(#hatch)" opacity="0.35" stroke="none" />
      </g>
      {/* fringe */}
      <g stroke="#e9dcc0" strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${2 - (i % 2)} ${45 + i * 5} l-10 ${i % 2 ? 2 : -1}`} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`r${i}`} d={`M${418 + (i % 2)} ${45 + i * 5} l10 ${i % 2 ? -2 : 1}`} />
        ))}
      </g>
    </svg>
  );
}

/** The circular floor hatch hidden under the rug. */
export function Hatch() {
  return (
    <svg viewBox="0 0 220 90" aria-hidden="true" overflow="visible">
      <ellipse cx="110" cy="45" rx="120" ry="52" fill="url(#glow-teal)" opacity="0.9" className="hatch-glow" />
      <g stroke={INK} strokeLinejoin="round">
        {/* the hole */}
        <ellipse cx="110" cy="45" rx="86" ry="32" fill="#0c1d1f" strokeWidth={W + 0.5} />
        <ellipse cx="110" cy="52" rx="70" ry="22" fill="#2b7f7e" opacity="0.6" stroke="none" />
        <ellipse cx="110" cy="56" rx="44" ry="12" fill="#9adbd0" opacity="0.6" stroke="none" />
        {/* the lid, which flips open */}
        <g data-part="lid" style={{ transformOrigin: "110px 13px" }}>
          <ellipse cx="110" cy="45" rx="86" ry="32" fill="#7a4632" strokeWidth={W + 0.5} />
          <path d="M40 34 L180 34 M30 46 L190 46 M40 58 L180 58" stroke="#5a3622" strokeWidth="2.5" />
          <ellipse cx="110" cy="45" rx="86" ry="32" fill="none" stroke="#9adbd0" strokeWidth="2" opacity="0.8" className="hatch-seam" />
          <circle cx="110" cy="46" r="10" fill="none" stroke="#3a2a2a" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
}

/** Non-interactive decor that fills the room out. Positioned by CSS classes. */
export const decor = {
  books: (
    <svg viewBox="0 0 60 70" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="4" y="52" width="52" height="14" rx="2" fill="#7a2f3a" />
        <rect x="8" y="40" width="44" height="12" rx="2" fill="#24706f" transform="rotate(-4 30 46)" />
        <rect x="6" y="28" width="48" height="12" rx="2" fill="#e0a23a" transform="rotate(3 30 34)" />
        <rect x="10" y="17" width="38" height="11" rx="2" fill="#5a3260" />
        <path d="M22 17 C20 8 32 4 34 12 Z" fill="#9adbd0" />
      </g>
    </svg>
  ),
  records: (
    <svg viewBox="0 0 50 90" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="6" y="14" width="34" height="74" rx="2" fill="#c4664f" transform="rotate(-10 23 88)" />
        <rect x="12" y="10" width="34" height="78" rx="2" fill="#34497c" transform="rotate(-4 29 88)" />
        <circle cx="29" cy="46" r="10" fill="#17111d" transform="rotate(-4 29 88)" />
        <rect x="16" y="20" width="30" height="68" rx="2" fill="#e0a23a" transform="rotate(3 31 88)" />
        <path d="M22 40 C28 30 40 34 38 46 C36 56 24 54 24 46" fill="none" stroke="#7a2f3a" strokeWidth="3" transform="rotate(3 31 88)" />
      </g>
    </svg>
  ),
  slippers: (
    <svg viewBox="0 0 80 40" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M4 30 C4 18 20 14 34 18 C40 20 40 32 34 34 C24 38 6 38 4 30 Z" fill="#de8a72" />
        <path d="M14 22 C18 16 30 16 32 24" fill="none" stroke="#f3e7cc" strokeWidth="4" />
        <path d="M44 34 C44 22 60 18 74 22 C80 24 80 36 74 38 C64 40 46 40 44 34 Z" fill="#de8a72" />
        <path d="M54 26 C58 20 70 20 72 28" fill="none" stroke="#f3e7cc" strokeWidth="4" />
      </g>
    </svg>
  ),
  candles: (
    <svg viewBox="0 0 50 80" aria-hidden="true" overflow="visible">
      <ellipse cx="25" cy="30" rx="40" ry="34" fill="url(#glow-amber)" opacity="0.7" />
      <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <rect x="6" y="34" width="12" height="44" rx="3" fill="var(--parchment)" />
        <rect x="22" y="22" width="12" height="56" rx="3" fill="#e9dcc0" />
        <rect x="36" y="46" width="10" height="32" rx="3" fill="var(--parchment)" />
        <path d="M12 34 c-5 -7 -2 -12 0 -17 c3 5 7 10 0 17 Z" fill="var(--ochre-300)" className="flame" />
        <path d="M28 22 c-5 -7 -2 -12 0 -17 c3 5 7 10 0 17 Z" fill="var(--ochre-300)" className="flame" />
        <path d="M41 46 c-4 -6 -2 -10 0 -14 c3 4 6 8 0 14 Z" fill="var(--ochre-300)" className="flame" />
      </g>
    </svg>
  ),
  hanger: (
    <svg viewBox="0 0 60 200" aria-hidden="true" overflow="visible">
      <g stroke={INK} strokeLinejoin="round">
        <path d="M30 0 L30 60 M30 60 L12 120 M30 60 L48 120 M30 60 L30 122" stroke="#d8c8a4" strokeWidth="2.5" fill="none" />
        <path d="M14 116 L46 116 L42 150 L18 150 Z" fill="var(--teal-500)" strokeWidth="2.5" />
        <g className="sway" style={{ transformOrigin: "30px 120px" }}>
          <path d="M18 120 C6 140 4 170 10 196 M30 120 C30 150 26 172 30 190 M42 120 C56 146 54 170 50 186" fill="none" stroke="#3f5a26" strokeWidth="3" />
          {[[10, 160], [8, 186], [28, 150], [30, 178], [52, 156], [50, 178]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} c8 -6 16 0 12 8 c-8 2 -14 -2 -12 -8 Z`} fill={i % 2 ? "#6b8a37" : "#7f9d3f"} strokeWidth="2" />
          ))}
        </g>
      </g>
    </svg>
  ),
  /** A short staircase linking two levels of the split-level room (phones). */
  stairs: (
    <svg viewBox="0 0 100 130" aria-hidden="true" overflow="visible">
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M0 0 L22 0 L98 118 L98 130 L74 130 L0 16 Z" fill="#3a2014" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x={4 + i * 18} y={4 + i * 24} width="26" height="7" rx="1.5" fill="#a8693c" />
            <rect x={4 + i * 18} y={11 + i * 24} width="26" height="17" fill="#6f3f39" />
          </g>
        ))}
        <path d="M14 -18 L96 104" fill="none" stroke="#c99a5b" strokeWidth="4" strokeLinecap="round" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${24 + i * 20} ${-3 + i * 30} L${24 + i * 20} ${14 + i * 28}`} stroke="#c99a5b" strokeWidth="3" />
        ))}
      </g>
    </svg>
  ),
  shelf: (
    <svg viewBox="0 0 160 70" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <rect x="2" y="56" width="156" height="10" fill="#8a4f3a" />
        <path d="M20 66 L28 76 M140 66 L132 76" strokeWidth="4" stroke="#5a3622" />
        <path d="M14 56 L14 26 C14 18 34 18 34 26 L34 56 Z" fill="#9adbd0" opacity="0.85" />
        <circle cx="24" cy="40" r="6" fill="#de8a72" />
        <path d="M54 56 C50 36 64 28 76 30 C88 32 94 44 90 56 Z" fill="#e9dcc0" />
        <ellipse cx="66" cy="44" rx="4" ry="5" fill="var(--plum-950)" />
        <ellipse cx="80" cy="44" rx="4" ry="5" fill="var(--plum-950)" />
        <path d="M108 56 L114 20 L120 56 Z" fill="#5a3260" />
        <path d="M120 56 L126 32 L132 56 Z" fill="#7a5aa0" />
        <circle cx="146" cy="48" r="8" fill="var(--ochre-500)" />
        <path d="M146 40 L146 34" />
      </g>
    </svg>
  ),
};
