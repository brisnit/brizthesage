import Image from "next/image";
import { artist } from "@/content/site";
import { archivesCopy } from "@/content/lore";
import styles from "./Archives.module.css";

/** The factual section: the real biography and the artist portrait. */
export default function RealBriz() {
  return (
    <section id="real-briz" className={styles.section} aria-labelledby="real-briz-title">
      <div className={styles.realGrid}>
        <figure className={styles.portrait}>
          <div className={styles.portraitFrame}>
            <Image
              src="/art/briz-portrait.jpg"
              alt="Artist portrait of Briz the Sage in a hooded jacket with a backpack, standing in a dark blue forest beside Baboo Baboo, a turquoise cartoon skeleton."
              width={1600}
              height={1600}
              sizes="(max-width: 800px) 90vw, 460px"
              className={styles.portraitImg}
            />
          </div>
          <figcaption className={styles.portraitCaption}>{archivesCopy.portraitCaption}</figcaption>
        </figure>

        <div className={`paper ${styles.indexCard}`}>
          <p className={styles.cardTab}>{archivesCopy.realKicker}</p>
          <h2 id="real-briz-title" className={styles.h2Dark}>
            {archivesCopy.realTitle}
          </h2>
          {artist.bio.map((para, i) => (
            <p key={i} className={styles.bio}>
              {para}
            </p>
          ))}
          <p className={styles.small}>
            Everything else in the Archives is house lore: made-up stories about the blue house, Baboo Baboo, and the moon.
          </p>
        </div>
      </div>
    </section>
  );
}
