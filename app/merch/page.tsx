import type { Metadata } from "next";
import Link from "next/link";
import Shop from "@/components/merch/Shop";
import { shopCopy } from "@/content/merch";
import SiteFooter from "@/components/ui/SiteFooter";
import styles from "@/components/merch/Merch.module.css";

export const metadata: Metadata = {
  title: "The Curiosity Shop",
  description: "A few things you might want to take home: design previews of possible Briz the Sage merch.",
};

export default function MerchPage() {
  return (
    <>
      <main className={styles.shop}>
        <header className={styles.intro}>
          <p className="kicker">{shopCopy.kicker}</p>
          <h1 className={styles.title}>{shopCopy.title}</h1>
          <p className={styles.lede}>{shopCopy.intro}</p>
        </header>

        <aside className={`paper ${styles.notice}`} aria-label="Shop status">
          <span className={styles.noticeIcon} aria-hidden="true">
            ✶
          </span>
          <p>{shopCopy.notice}</p>
        </aside>

        <Shop />

        <nav className={styles.doors} aria-label="Other rooms">
          <Link href="/music" className="btn btn-gold">
            Hear the music →
          </Link>
          <Link href="/" className="btn btn-ghost">
            ← Back to the blue house
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
