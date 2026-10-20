import Image from "next/image";
import { artist } from "@/content/site";
import { archivesCopy } from "@/content/lore";
import styles from "./Archives.module.css";

/** The factual section. Shows the real bio only when one has been written. */
export default function RealBriz() {
  return (
    <section id="real-briz" className={styles.section} aria-labelledby="real-briz-title">
      <div className={styles.realGrid}>
        <figure className={styles.portrait}>
          <div className={styles.portraitFrame}>
            <Image
              src="/art/briz-portrait.jpg"
              alt="Briz the Sage in a hooded jacket with a backpack, standing in a dark blue forest beside a painted turquoise skeleton."
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
          {artist.bio ? (
            artist.bio.split(/\n{2,}/).map((para, i) => (
              <p key={i} className={styles.bio}>
                {para}
              </p>
            ))
          ) : (
            <div className={styles.placeholder}>
              <span className="stamp">Sample</span>
              <p className={styles.bio}>{archivesCopy.realPlaceholder}</p>
              <p className={styles.small}>Edit <code>artist.bio</code> in content/site.ts.</p>
            </div>
          )}
          <p className={styles.small}>
            Everything else in the Archives is house lore: made-up stories about the blue house, its skeleton, and its moon.
          </p>
        </div>
      </div>
    </section>
  );
}
