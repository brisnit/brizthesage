import type { Metadata } from "next";
import Link from "next/link";
import Shop from "@/components/merch/Shop";
import SiteFooter from "@/components/ui/SiteFooter";
import styles from "@/components/merch/Merch.module.css";

export const metadata: Metadata = {
  title: "The Curiosity Shop",
  description: "A cabinet of strange collectibles from the blue house. Design previews of upcoming BRIZ THE SAGE merch.",
};

export default function MerchPage() {
  return (
    <>
      <main className={styles.shop}>
        <header className={styles.intro}>
          <p className="kicker">The Curiosity Shop</p>
          <h1 className={styles.title}>Odd things, carefully kept.</h1>
          <p className={styles.lede}>Some of these will exist one day. Some of them already rattle.</p>
        </header>

        <aside className={`paper ${styles.notice}`} aria-label="Shop status">
          <span className={styles.noticeIcon} aria-hidden="true">
            ✶
          </span>
          <p>
            <strong>The shop isn’t open yet.</strong> Everything here is a preview or coming soon. Nothing can be
            purchased, and this site never asks for payment details.
          </p>
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
