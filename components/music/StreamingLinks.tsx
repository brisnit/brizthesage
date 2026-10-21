import type { StreamingLink } from "@/content/music";
import styles from "./Music.module.css";

/** Real streaming links only; platforms without a link aren't listed. */
export default function StreamingLinks({ links, label, small }: { links: StreamingLink[]; label: string; small?: boolean }) {
  if (links.length === 0) return null;
  return (
    <ul className={styles.links} aria-label={label} data-small={small || undefined}>
      {links.map((l) => (
        <li key={l.platform}>
          <a className={styles.linkTag} href={l.url} target="_blank" rel="noreferrer">
            {l.platform} <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
