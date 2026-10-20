import type { StreamingLink } from "@/content/music";
import styles from "./Music.module.css";

/** Renders real links as links; missing URLs as honest, disabled "coming soon" tags. */
export default function StreamingLinks({ links, label }: { links: StreamingLink[]; label: string }) {
  return (
    <ul className={styles.links} aria-label={label}>
      {links.map((l) =>
        l.url ? (
          <li key={l.platform}>
            <a className={styles.linkTag} href={l.url} target="_blank" rel="noreferrer">
              {l.platform} <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ) : (
          <li key={l.platform}>
            <span className={styles.linkTag} aria-disabled="true" data-soon="true">
              {l.platform}
              <span className={styles.soonNote}>Link coming soon</span>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
