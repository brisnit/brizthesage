/** Small hidden illustrations for the Book of Briz-izm and the cabinet. */
import type { BookPage } from "@/content/hunt";

const INK = "var(--line)";
const S = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function Doodle({ kind }: { kind: BookPage["doodle"] }) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true">
      {kind === "ear" && (
        <g {...S}>
          <path d="M40 40a20 20 0 0 1 40 0c0 12-12 16-12 28a12 12 0 0 1-22 6" />
          <path d="M52 42a8 8 0 0 1 16 0c0 6-6 7-6 12" />
          <path d="M90 30c6 6 6 18 0 24M98 22c10 10 10 30 0 40" stroke="#a8741f" />
        </g>
      )}
      {kind === "moon" && (
        <g {...S}>
          <path d="M66 14a30 30 0 1 0 24 48a24 24 0 1 1-24-48z" fill="#f6dd8a" />
          <path d="M30 70c4-10 10-10 14 0" />
          <circle cx="58" cy="42" r="3" fill={INK} />
        </g>
      )}
      {kind === "hands" && (
        <g {...S}>
          <rect x="34" y="20" width="52" height="40" rx="4" fill="#f3e7cc" />
          <path d="M42 32h30M42 40h24M42 48h34" stroke="#a8741f" />
          <path d="M84 66l14-14 6 6-14 14-8 2z" fill="#e0a23a" />
        </g>
      )}
      {kind === "door" && (
        <g {...S}>
          <path d="M44 80V36a16 16 0 0 1 32 0v44z" fill="#f4cf72" />
          <circle cx="70" cy="58" r="2.5" fill={INK} />
          <path d="M30 80h60" />
          <path d="M88 30l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff8e6" />
        </g>
      )}
      {kind === "rest" && (
        <g {...S}>
          <path d="M20 60c10-14 30-14 40 0M60 60c10-14 30-14 40 0" />
          <path d="M70 22h12l-12 12h12M86 10h8l-8 8h8" stroke="#a8741f" />
        </g>
      )}
      {kind === "oliver" && (
        <g {...S}>
          <path d="M38 40c-2-12 2-24 8-30 6 8 8 16 8 24M82 40c2-12-2-24-8-30-6 8-8 16-8 24" fill="#d98a3d" />
          <path d="M36 46c0-12 10-18 24-18s24 6 24 18-10 22-24 22-24-10-24-22z" fill="#d98a3d" />
          <path d="M56 34c2-3 6-3 8 0l2 18c4 4 2 12-6 12s-10-8-6-12z" fill="#fbf3e4" />
          <circle cx="50" cy="46" r="2.5" fill={INK} />
          <circle cx="70" cy="46" r="2.5" fill={INK} />
        </g>
      )}
    </svg>
  );
}
