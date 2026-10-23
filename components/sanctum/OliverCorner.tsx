"use client";

import { useState } from "react";
import { oliverActions, sanctumCopy } from "@/content/hunt";
import Oliver from "./Oliver";
import styles from "./Sanctum.module.css";

/** Oliver’s corner: a warm spot by the throne and a very good dog. */
export default function OliverCorner() {
  const [caption, setCaption] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const react = (id: string, text: string) => {
    setCaption(text);
    setMood(id);
    window.setTimeout(() => setMood(null), 1600);
  };
  return (
    <section className={styles.corner} aria-labelledby="corner-title">
      <h2 id="corner-title" className={styles.sectionTitle}>
        Oliver’s corner
      </h2>
      <p className={styles.sectionNote}>A warm spot, a water bowl, and a dog who has heard every speech.</p>
      <div className={styles.cornerGrid}>
        <button type="button" className={styles.cornerOliver} data-mood={mood ?? undefined} aria-label="Oliver" onClick={() => react("tap", sanctumCopy.oliverCaption)}>
          <span className={styles.cushion} aria-hidden="true" />
          <Oliver className={styles.cornerArt} />
        </button>
        <div className={styles.cornerActions}>
          {oliverActions.map((a) => (
            <button key={a.id} type="button" className="btn btn-ghost" onClick={() => react(a.id, a.caption)}>
              {a.label}
            </button>
          ))}
          <p className={styles.cornerCaption} role="status">
            {caption ?? ""}
          </p>
        </div>
      </div>
    </section>
  );
}
