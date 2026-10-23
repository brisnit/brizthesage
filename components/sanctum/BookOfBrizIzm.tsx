"use client";

import { useState } from "react";
import { bookPages } from "@/content/hunt";
import { Doodle } from "./Doodles";
import styles from "./Sanctum.module.css";

/** The Book of Briz-izm: playful creative principles of this world, one per page. */
export default function BookOfBrizIzm() {
  const [i, setI] = useState(0);
  const [margin, setMargin] = useState(false);
  const [doodle, setDoodle] = useState(false);
  const page = bookPages[i];
  const go = (d: number) => {
    setI((v) => (v + d + bookPages.length) % bookPages.length);
    setMargin(false);
    setDoodle(false);
  };

  return (
    <section className={styles.book} aria-labelledby="book-title">
      <h2 id="book-title" className={styles.sectionTitle}>
        The Book of Briz-izm
      </h2>
      <p className={styles.sectionNote}>Playful principles from this world. Fiction, mostly. Good advice, possibly.</p>

      <div
        className={styles.bookSpread}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <article className={styles.page} key={page.n} aria-live="polite" aria-label={`Page ${i + 1} of ${bookPages.length}`}>
          <p className={styles.pageNum}>{page.n}</p>
          <h3 className={styles.principle}>{page.principle}</h3>
          <p className={styles.gloss}>{page.gloss}</p>

          <div className={styles.marginArea}>
            <button type="button" className={styles.marginButton} aria-expanded={margin} onClick={() => setMargin((v) => !v)}>
              {page.margin.label}
            </button>
            {margin && <p className={styles.marginNote}>{page.margin.note}</p>}
          </div>

          <button type="button" className={styles.doodleSpot} aria-expanded={doodle} onClick={() => setDoodle((v) => !v)}>
            <span className="sr-only">{doodle ? "Hide the faint drawing" : "A faint drawing in the corner"}</span>
            <span className={styles.doodle} data-shown={doodle || undefined}>
              <Doodle kind={page.doodle} />
            </span>
          </button>
        </article>
      </div>

      <div className={styles.bookNav}>
        <button type="button" className="btn btn-ghost" onClick={() => go(-1)} aria-label="Previous page">
          ← Back
        </button>
        <p className={styles.pageCount} aria-hidden="true">
          {i + 1} / {bookPages.length}
        </p>
        <button type="button" className="btn btn-ghost" onClick={() => go(1)} aria-label="Next page">
          Turn the page →
        </button>
      </div>
    </section>
  );
}
