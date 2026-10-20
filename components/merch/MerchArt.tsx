import Image from "next/image";
import type { MerchArt as MerchArtKind } from "@/content/merch";

/**
 * Illustrated product mock-ups for the Curiosity Shop.
 * Every drawing sits in a 200×200 box. Replace with real photos by setting
 * `image` on the product in content/merch.ts.
 */

const ink = "var(--line)";
const sw = 3;

function Hoodie() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <g filter="url(#ink)" stroke={ink} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
        <path d="M70 40 C78 22 122 22 130 40 L168 60 L186 128 L160 136 L152 100 L150 180 L50 180 L48 100 L40 136 L14 128 L32 60 Z" fill="var(--plum-600)" />
        <path d="M70 40 C74 64 126 64 130 40 C122 30 78 30 70 40 Z" fill="var(--plum-700)" />
        <path d="M84 150 L116 150 L120 176 L80 176 Z" fill="var(--plum-700)" />
        <path d="M94 58 L92 96 M106 58 L108 96" fill="none" stroke="var(--parchment-dim)" strokeWidth="2.5" />
        {/* tiny blue house over the heart */}
        <circle cx="126" cy="86" r="9" fill="var(--moon)" strokeWidth="2" />
        <path d="M110 112 C110 96 116 90 124 89 C133 88 140 96 140 112 Z" fill="var(--teal-400)" strokeWidth="2.2" />
        <path d="M121 112 V104 C121 100 128 100 128 104 V112" fill="var(--ochre-300)" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

function Tee() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <g filter="url(#ink)" stroke={ink} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
        <path d="M74 30 C84 42 116 42 126 30 L172 50 L188 92 L158 102 L152 86 L152 182 L48 182 L48 86 L42 102 L12 92 L28 50 Z" fill="var(--rose-500)" />
        <path d="M74 30 C84 46 116 46 126 30" fill="none" />
        {/* skeleton waving */}
        <path d="M78 96 C74 72 92 58 108 60 C126 62 132 80 126 96 L122 112 L86 114 Z" fill="var(--teal-400)" strokeWidth="2.4" />
        <ellipse cx="94" cy="86" rx="7" ry="9" fill="var(--plum-950)" strokeWidth="2" />
        <ellipse cx="114" cy="84" rx="8" ry="10" fill="var(--plum-950)" strokeWidth="2" />
        <path d="M88 104 C98 110 112 110 122 102" fill="none" strokeWidth="2" />
        <path d="M100 114 V150 M84 126 C96 122 108 122 120 126 M86 136 C96 132 108 132 118 136" fill="none" stroke="var(--teal-400)" strokeWidth="5" />
        <path d="M120 120 C134 112 140 100 142 88" fill="none" stroke="var(--teal-400)" strokeWidth="5" />
        <path d="M142 88 L138 76 M142 88 L146 76 M142 88 L152 82" fill="none" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

function PrintHouse() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <g filter="url(#ink)" strokeLinejoin="round">
        <rect x="26" y="14" width="148" height="172" fill="#c9a36a" stroke={ink} strokeWidth="6" />
        <rect x="36" y="24" width="128" height="152" fill="#244a7a" stroke={ink} strokeWidth="2" />
        <g fill="none" stroke="#cfe6ff" strokeWidth="1.6">
          <path d="M36 50 H164 M36 90 H164 M36 130 H164 M70 24 V176 M130 24 V176" strokeOpacity="0.18" />
          <path d="M60 104 C60 70 80 52 100 50 C122 48 140 70 140 104 Z" strokeWidth="2.2" />
          <path d="M92 104 V90 C92 84 108 84 108 90 V104" strokeWidth="2" />
          <path d="M46 104 H154" strokeWidth="2.2" />
          <path d="M70 104 V156 H130 V104" strokeDasharray="4 4" />
          <path d="M100 104 V122" strokeDasharray="3 3" />
          <circle cx="100" cy="136" r="14" />
          <circle cx="100" cy="136" r="5" />
          <path d="M56 116 C60 128 52 140 58 152 M146 112 C140 126 150 138 142 150" />
          <circle cx="132" cy="40" r="9" />
        </g>
        <text x="100" y="170" textAnchor="middle" fill="#cfe6ff" fontSize="8" fontFamily="var(--font-term), monospace" letterSpacing="1">
          FIG. 1 · THE BLUE HOUSE
        </text>
      </g>
    </svg>
  );
}

function Vinyl() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <g filter="url(#ink)" stroke={ink} strokeWidth={sw}>
        <circle cx="122" cy="100" r="68" fill="#1c1426" />
        <circle cx="122" cy="100" r="56" fill="none" stroke="#4a3b57" strokeWidth="1.4" />
        <circle cx="122" cy="100" r="44" fill="none" stroke="#4a3b57" strokeWidth="1.4" />
        <circle cx="122" cy="100" r="22" fill="var(--moon)" strokeWidth="2.4" />
        <circle cx="122" cy="100" r="3" fill="var(--parchment)" strokeWidth="1.5" />
        <rect x="18" y="30" width="140" height="140" fill="var(--teal-500)" strokeLinejoin="round" />
        <circle cx="88" cy="88" r="36" fill="var(--moon)" strokeWidth="2.4" />
        <path d="M40 170 C46 128 70 112 88 112 C110 112 130 130 136 170 Z" fill="var(--teal-700)" strokeWidth="2.4" />
        <path d="M80 170 V150 C80 140 96 140 96 150 V170" fill="var(--ochre-300)" strokeWidth="2.2" />
        <path d="M30 60 C50 52 52 70 70 62" fill="none" stroke="var(--coral-300)" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Cassette() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <g filter="url(#ink)" stroke={ink} strokeWidth={sw} strokeLinejoin="round" transform="rotate(-6 100 100)">
        <rect x="20" y="50" width="160" height="104" rx="10" fill="var(--ochre-500)" />
        <rect x="34" y="62" width="132" height="54" rx="6" fill="var(--parchment)" strokeWidth="2.4" />
        <path d="M44 74 H120 M44 84 H96" stroke="var(--plum-700)" strokeWidth="2.4" strokeLinecap="round" />
        <text x="140" y="80" textAnchor="middle" fontSize="11" fontFamily="var(--font-hand), cursive" fill="var(--plum-700)" stroke="none">
          side B
        </text>
        <rect x="58" y="94" width="84" height="18" rx="8" fill="#2a1d2e" strokeWidth="2" />
        <circle cx="76" cy="103" r="6" fill="var(--parchment-dim)" strokeWidth="2" />
        <circle cx="124" cy="103" r="6" fill="var(--parchment-dim)" strokeWidth="2" />
        <path d="M54 154 L64 130 H136 L146 154" fill="var(--ochre-700)" strokeWidth="2.4" />
        <circle cx="80" cy="144" r="3" fill={ink} />
        <circle cx="120" cy="144" r="3" fill={ink} />
      </g>
      {/* a little soil clinging to it */}
      <path d="M150 158 C160 150 176 152 182 162 Z" fill="var(--moss-700)" stroke={ink} strokeWidth="2" />
    </svg>
  );
}

function PinMoon() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <g filter="url(#ink)" stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        <circle cx="100" cy="100" r="78" fill="url(#glow-amber)" stroke="none" opacity="0.5" />
        <path
          d="M128 32 C82 36 52 70 54 108 C56 146 92 174 134 170 C104 158 86 132 86 100 C86 68 102 44 128 32 Z"
          fill="var(--ochre-300)"
          strokeWidth="5"
        />
        <path d="M92 64 C108 52 116 50 122 50" fill="none" stroke="#fff3c4" strokeWidth="4" opacity="0.8" />
        {/* one eye open, one closed */}
        <path d="M62 96 C66 102 74 102 78 96" fill="none" strokeWidth="3" />
        <circle cx="70" cy="122" r="5" fill="var(--plum-950)" strokeWidth="2" />
        <circle cx="72" cy="120" r="1.5" fill="#fff" stroke="none" />
        <circle cx="66" cy="140" r="5" fill="var(--coral-500)" stroke="none" opacity="0.8" />
        <path d="M150 64 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 z" fill="var(--parchment)" strokeWidth="2" />
      </g>
    </svg>
  );
}

function Candle() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="58" r="50" fill="url(#glow-amber)" opacity="0.7" />
      <g filter="url(#ink)" stroke={ink} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
        <path d="M100 30 C112 44 110 60 100 66 C90 60 88 44 100 30 Z" fill="var(--ochre-300)" />
        <path d="M100 46 C104 52 103 58 100 61 C97 58 96 52 100 46 Z" fill="#fff3c4" strokeWidth="1.5" />
        <path d="M100 66 V76" />
        <path d="M58 82 C58 74 142 74 142 82 L138 176 C138 184 62 184 62 176 Z" fill="var(--plum-600)" />
        <path d="M58 82 C58 90 142 90 142 82" fill="var(--plum-700)" />
        <path d="M80 86 C80 96 76 100 78 108 M120 88 C122 94 124 98 122 104" fill="none" stroke="var(--plum-700)" strokeWidth="5" />
        <rect x="72" y="112" width="56" height="44" rx="4" fill="var(--parchment)" strokeWidth="2.4" />
        <path d="M80 126 H120 M86 138 H114" stroke="var(--plum-700)" strokeWidth="2.2" />
        <circle cx="100" cy="148" r="3" fill="var(--teal-500)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function PrintCover() {
  return (
    <span style={{ display: "block", position: "relative", width: "78%", aspectRatio: "1", margin: "0 auto" }}>
      <span
        style={{
          display: "block",
          position: "absolute",
          inset: "-7%",
          background: "linear-gradient(135deg, #a4743f, #6d4422)",
          border: "3px solid var(--line)",
          borderRadius: 4,
          boxShadow: "inset 0 0 0 6px rgba(26,16,34,0.35), 5px 6px 0 var(--line)",
        }}
      />
      <Image
        src="/art/what-up-world.jpg"
        alt=""
        fill
        sizes="(max-width: 600px) 40vw, 240px"
        style={{ objectFit: "cover", border: "2px solid var(--line)" }}
      />
    </span>
  );
}

export default function MerchArt({ kind, className }: { kind: MerchArtKind; className?: string }) {
  const art = {
    hoodie: <Hoodie />,
    tee: <Tee />,
    "print-cover": <PrintCover />,
    "print-house": <PrintHouse />,
    vinyl: <Vinyl />,
    cassette: <Cassette />,
    "pin-moon": <PinMoon />,
    candle: <Candle />,
  }[kind];
  return (
    <span className={className} style={{ display: "block" }}>
      {art}
    </span>
  );
}
