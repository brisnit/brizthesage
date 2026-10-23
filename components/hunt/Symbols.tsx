/** Small illustrated symbols for the hidden trail. */

/** A jar of fog with a tiny record and a crescent moon inside: found in the bottled weather. */
export function WeatherSymbol() {
  return (
    <svg viewBox="0 0 80 96" aria-hidden="true">
      <g stroke="var(--line)" strokeWidth="2.4" strokeLinejoin="round">
        <rect x="22" y="4" width="36" height="10" rx="3" fill="#a86d1f" />
        <path d="M18 14 H62 L66 30 C70 40 70 80 64 88 C56 94 24 94 16 88 C10 80 10 40 14 30 Z" fill="rgba(154,219,208,0.35)" />
        <path d="M18 46 C28 40 36 50 46 44 C54 40 60 46 64 44" fill="none" stroke="#e9dcc0" strokeWidth="2" opacity="0.8" />
        <circle cx="40" cy="64" r="14" fill="#17111d" />
        <circle cx="40" cy="64" r="5" fill="var(--coral-500)" strokeWidth="1.5" />
        <path d="M54 28 C46 30 44 40 50 44 C44 44 40 38 42 32 C44 28 50 26 54 28 Z" fill="var(--moon)" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

/** A tiny gold ear: the pilgrims’ mark. */
export function EarMark({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5.5 1.6M10 9.5a2 2 0 0 1 4 0c0 1.3-1.4 1.6-1.4 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
