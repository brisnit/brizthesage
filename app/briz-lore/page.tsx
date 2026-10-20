import type { Metadata } from "next";
import Link from "next/link";
import RealBriz from "@/components/lore/RealBriz";
import Exhibits from "@/components/lore/Exhibits";
import FieldNotes from "@/components/lore/FieldNotes";
import ArchiveDecor from "@/components/lore/ArchiveDecor";
import HouseRemembers from "@/components/game/HouseRemembers";
import SiteFooter from "@/components/ui/SiteFooter";
import { archivesCopy } from "@/content/lore";
import styles from "@/components/lore/Archives.module.css";

export const metadata: Metadata = {
  title: "Briz Lore",
  description: "The Archives of the blue house, and a small game: The House Remembers.",
};

export default function BrizLorePage() {
  return (
    <>
      <main className={styles.page}>
        <header className={styles.header}>
          <ArchiveDecor />
          <p className="kicker">{archivesCopy.kicker}</p>
          <h1 className={styles.title}>{archivesCopy.title}</h1>
          <p className={styles.intro}>{archivesCopy.intro}</p>
          <nav aria-label="On this page" className={styles.toc}>
            <a href="#real-briz">Real biography</a>
            <a href="#exhibits">Exhibits</a>
            <a href="#field-notes">Field notes</a>
            <a href="#the-house-remembers">Play: The House Remembers</a>
          </nav>
        </header>

        <RealBriz />
        <Exhibits />
        <FieldNotes />
        <HouseRemembers />

        <nav aria-label="Leave the archives" className={styles.exits}>
          <Link href="/" className="btn btn-teal">
            Back to the blue house
          </Link>
          <Link href="/music" className="btn btn-gold">
            Go listen
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
