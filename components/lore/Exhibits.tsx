import Image from "next/image";
import { archivesCopy, exhibits } from "@/content/lore";
import styles from "./Archives.module.css";

export default function Exhibits() {
  return (
    <section id="exhibits" className={styles.section} aria-labelledby="exhibits-title">
      <div className={styles.sectionHead}>
        <h2 id="exhibits-title" className={styles.h2}>
          {archivesCopy.exhibitsTitle}
        </h2>
        <p className={styles.note}>{archivesCopy.exhibitsNote}</p>
      </div>
      <ul className={styles.exhibits}>
        {exhibits.map((ex, i) => (
          <li key={ex.id} className={styles.exhibit} style={{ "--tilt": `${[-1.6, 1.2, -0.8, 1.8][i % 4]}deg` } as React.CSSProperties}>
            <figure>
              <div className={styles.specimen}>
                <Image
                  src={ex.image.src}
                  alt={ex.image.alt}
                  width={ex.image.width}
                  height={ex.image.height}
                  sizes="(max-width: 700px) 80vw, 280px"
                  loading="lazy"
                  className={styles.specimenImg}
                />
                <span className={styles.pin} aria-hidden="true" />
              </div>
              <figcaption className={styles.label}>
                <span className={styles.catalogue}>{ex.catalogue}</span>
                <strong className={styles.exTitle}>{ex.title}</strong>
                <span>{ex.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
