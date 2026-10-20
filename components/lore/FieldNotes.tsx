import { archivesCopy, fragments } from "@/content/lore";
import styles from "./Archives.module.css";

export default function FieldNotes() {
  return (
    <section id="field-notes" className={styles.section} aria-labelledby="field-notes-title">
      <div className={styles.sectionHead}>
        <h2 id="field-notes-title" className={styles.h2}>
          {archivesCopy.fieldNotesTitle}
        </h2>
        <p className={styles.note}>{archivesCopy.fieldNotesNote}</p>
      </div>
      <ul className={styles.notes}>
        {fragments.map((f) => (
          <li key={f.id} className={`paper ${styles.noteCard}`}>
            <p className={styles.noteKind}>{f.fiction ? "House lore · fiction" : "About Briz · fact"}</p>
            <h3 className={styles.noteTitle}>{f.title}</h3>
            <p>{f.body}</p>
            {f.sample && <span className={`stamp ${styles.noteStamp}`}>Sample</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
