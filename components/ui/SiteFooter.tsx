import Link from "next/link";
import { artist, navItems, site } from "@/content/site";
import PilgrimReturn from "@/components/hunt/PilgrimReturn";
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
      <p className={styles.bio}>{artist.shortBio}</p>
      {artist.socials.length > 0 && (
        <ul className={styles.links} aria-label="Elsewhere">
          {artist.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      {artist.contactEmail && (
        <p>
          <a href={`mailto:${artist.contactEmail}`}>{artist.contactEmail}</a>
        </p>
      )}
      <p className={styles.note}>The house is made up. The music is real.</p>
      <PilgrimReturn />
    </footer>
  );
}
