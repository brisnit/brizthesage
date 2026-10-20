import styles from "./Archives.module.css";

/** Candles and a sagging shelf of books framing the Archives header. Decorative. */
export default function ArchiveDecor() {
  const books = [
    { w: 22, h: 92, c: "var(--coral-600)" },
    { w: 16, h: 80, c: "var(--teal-700)" },
    { w: 26, h: 100, c: "var(--plum-600)" },
    { w: 18, h: 86, c: "var(--moss-500)" },
    { w: 24, h: 74, c: "var(--ochre-700)", tilt: 12 },
    { w: 20, h: 96, c: "var(--ink-500)" },
    { w: 28, h: 88, c: "var(--rose-500)" },
  ];
  let x = 18;
  return (
    <div className={styles.decor} aria-hidden="true">
      <svg viewBox="0 0 260 160" className={styles.shelf}>
        {books.map((b, i) => {
          const el = (
            <g key={i} transform={`translate(${x} ${130 - b.h}) rotate(${b.tilt ?? 0} ${b.w} ${b.h})`}>
              <rect width={b.w} height={b.h} rx="3" fill={b.c} stroke="var(--line)" strokeWidth="3" />
              <path d={`M4 14 H${b.w - 4} M4 ${b.h - 16} H${b.w - 4}`} stroke="var(--ochre-300)" strokeWidth="2" opacity="0.7" />
            </g>
          );
          x += b.w + 3;
          return el;
        })}
        <circle cx="236" cy="104" r="22" fill="var(--teal-500)" stroke="var(--line)" strokeWidth="3" />
        <ellipse cx="228" cy="100" rx="5" ry="6" fill="var(--plum-950)" />
        <ellipse cx="244" cy="100" rx="5" ry="6" fill="var(--plum-950)" />
        <path d="M228 114 h16" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
        <path d="M6 132 C80 140 180 140 256 130" stroke="var(--line)" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M6 132 C80 140 180 140 256 130" stroke="var(--ochre-700)" strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
      {[0, 1, 2].map((i) => (
        <span key={i} className={styles.candle} data-i={i}>
          <span className={styles.flame} />
        </span>
      ))}
    </div>
  );
}
