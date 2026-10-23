"use client";

import { useState } from "react";
import { artifacts } from "@/content/hunt";
import styles from "./Sanctum.module.css";

const INK = "var(--line)";

function ArtifactArt({ art }: { art: (typeof artifacts)[number]["art"] }) {
  const g = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      {art === "staff" && (
        <g {...g}>
          <path d="M40 22v54" stroke="#e3b44a" strokeWidth="6" />
          <circle cx="40" cy="16" r="9" fill="#9adbd0" />
        </g>
      )}
      {art === "jar" && (
        <g {...g}>
          <path d="M26 20h28l4 12v36H22V32z" fill="rgba(154,219,208,0.4)" />
          <rect x="28" y="12" width="24" height="8" rx="2" fill="#a86d1f" />
          <path d="M32 46v-10l10-3v10" fill="none" />
          <ellipse cx="30" cy="47" rx="3.5" ry="2.5" fill={INK} />
        </g>
      )}
      {art === "bills" && (
        <g {...g}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={14 + i * 4} y={24 + i * 6} width="44" height="24" rx="3" fill="#a3b864" transform={`rotate(${-8 + i * 6} 40 40)`} />
          ))}
          <text x="40" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} stroke="none">
            $1
          </text>
        </g>
      )}
      {art === "fork" && (
        <g {...g} fill="none">
          <path d="M32 14v26a8 8 0 0 0 16 0V14" stroke="#c0c6d2" strokeWidth="5" />
          <path d="M40 48v24" stroke="#c0c6d2" strokeWidth="5" />
          <path d="M58 26c4 4 4 12 0 16M64 20c8 8 8 20 0 28" stroke="#e3b44a" />
        </g>
      )}
      {art === "ball" && (
        <g {...g}>
          <path d="M18 66h44" />
          <circle cx="40" cy="44" r="16" fill="#e0505e" />
          <path d="M26 38c8 4 20 4 28 0" fill="none" stroke="#fbf3e4" />
          <path d="M14 66V30a26 26 0 0 1 52 0v36" fill="rgba(198,255,242,0.15)" />
        </g>
      )}
      {art === "map" && (
        <g {...g}>
          <path d="M12 20l18-6 20 6 18-6v46l-18 6-20-6-18 6z" fill="#f3e7cc" />
          <path d="M30 14v46M50 20v46" />
          <path d="M20 40c6-6 12 6 18 0s12-8 16 0" fill="none" stroke="#a8741f" strokeDasharray="3 3" />
        </g>
      )}
      {art === "bell" && (
        <g {...g}>
          <path d="M24 54c0-20 6-32 16-32s16 12 16 32z" fill="#e3b44a" />
          <path d="M20 56h40" />
          <circle cx="40" cy="62" r="4" fill="#a8741f" />
          <path d="M40 14v8" />
        </g>
      )}
      {art === "jewel" && (
        <g {...g}>
          <circle cx="40" cy="40" r="26" fill="#9a6ce0" opacity="0.25" stroke="none" />
          <path d="M40 18l18 18-18 26-18-26z" fill="#9a6ce0" />
          <path d="M22 36h36M40 18l-8 18 8 26 8-26z" fill="none" />
        </g>
      )}
    </svg>
  );
}

/** A cabinet of curious artifacts: each little drawer opens on a short note. */
export default function Cabinet() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className={styles.cabinet} aria-labelledby="cabinet-title">
      <h2 id="cabinet-title" className={styles.sectionTitle}>
        The cabinet of curious artifacts
      </h2>
      <p className={styles.sectionNote}>Please don’t touch the exhibits. (Please do touch the exhibits.)</p>
      <ul className={styles.shelves}>
        {artifacts.map((a) => (
          <li key={a.id} className={styles.artifact} data-open={open === a.id || undefined}>
            <button type="button" className={styles.artifactButton} aria-expanded={open === a.id} aria-controls={`art-${a.id}`} onClick={() => setOpen((v) => (v === a.id ? null : a.id))}>
              <span className={styles.artifactArt}>
                <ArtifactArt art={a.art} />
              </span>
              <span className={styles.artifactName}>{a.name}</span>
            </button>
            <p id={`art-${a.id}`} className={styles.artifactNote} hidden={open !== a.id}>
              {a.note}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
