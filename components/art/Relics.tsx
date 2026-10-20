import type { RelicId } from "@/content/game";

type ArtProps = { size?: number; className?: string };

/** The three relics of "The House Remembers", drawn in ink. Distinct shapes, not just colors. */
export function MoonRelicArt({ size = 64, className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="27" fill="url(#glow-amber)" opacity="0.6" />
      <path
        d="M40 9 C26 11 17 22 18 35 C19 47 30 56 43 55 C34 51 28 43 28 32 C28 21 33 13 40 9 Z"
        fill="var(--moon)"
        stroke="var(--line)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M22 30 C24 33 27 33 29 31" fill="none" stroke="var(--line)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="23" cy="40" r="2" fill="var(--coral-500)" />
      <circle cx="40" cy="9" r="2.6" fill="none" stroke="var(--line)" strokeWidth="2" />
    </svg>
  );
}

export function KeyRelicArt({ size = 64, className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="27" fill="url(#glow-amber)" opacity="0.45" />
      <g transform="rotate(-38 32 32)" stroke="var(--line)" strokeWidth="2.4" strokeLinejoin="round">
        <circle cx="16" cy="32" r="9" fill="var(--ochre-500)" />
        <circle cx="16" cy="32" r="3.5" fill="var(--plum-900)" />
        <rect x="24" y="29.5" width="30" height="5" rx="2" fill="var(--ochre-500)" />
        {/* seven teeth */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={30 + i * 3.4} y={34} width="2.4" height={i % 2 ? 4 : 6} fill="var(--ochre-500)" strokeWidth="1.4" />
        ))}
      </g>
    </svg>
  );
}

export function RecordRelicArt({ size = 64, className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="url(#glow-teal)" opacity="0.5" />
      <circle cx="32" cy="32" r="23" fill="#1c1426" stroke="var(--line)" strokeWidth="2.4" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#4a3b57" strokeWidth="1" />
      <circle cx="32" cy="32" r="14" fill="none" stroke="#4a3b57" strokeWidth="1" />
      <circle cx="32" cy="32" r="9" fill="var(--coral-500)" stroke="var(--line)" strokeWidth="1.8" />
      <circle cx="32" cy="32" r="3.5" fill="var(--parchment)" stroke="var(--line)" strokeWidth="1.4" />
      <path d="M16 22 A18 18 0 0 1 26 15" stroke="var(--teal-300)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="32" y="30" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="var(--line)" fontFamily="sans-serif">
        45
      </text>
    </svg>
  );
}

export function RelicArt({ id, ...rest }: ArtProps & { id: RelicId }) {
  if (id === "moon") return <MoonRelicArt {...rest} />;
  if (id === "key") return <KeyRelicArt {...rest} />;
  return <RecordRelicArt {...rest} />;
}
