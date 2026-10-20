import Link from "next/link";
import { artist, navItems, site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}>{site.name}</p>
      <nav aria-label="Footer">
        <ul className={styles.links}>
          {navItems.map((n) => (
            <li key={n.href}>
              <Link href={n.href}>{n.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <ul className={styles.links} aria-label="Elsewhere">
        {artist.socials.map((s) =>
          s.url ? (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ) : (
            <li key={s.label} className={styles.soon}>
              {s.label} <span className="sr-only">(link coming soon)</span>
              <span aria-hidden="true">· soon</span>
            </li>
          ),
        )}
      </ul>
      <p className={styles.note}>The house is made up. The music is real.</p>
    </footer>
  );
}
