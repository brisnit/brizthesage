"use client";

import { catalog } from "@/content/music";
import { select, usePlayer } from "@/lib/player";
import styles from "./Music.module.css";

/** "Play" on a record in the crate: loads its first song into the turntable and brings the player into view. */
export default function PlayReleaseButton({ releaseId, title }: { releaseId: string; title: string }) {
  const s = usePlayer();
  const first = catalog.find((t) => t.release.id === releaseId && (t.audioSrc || t.spotifyId));
  if (!first) return null;
  const onDeck = s.status !== "idle" && catalog.find((t) => t.id === s.currentId)?.release.id === releaseId;
  return (
    <button
      type="button"
      className={styles.cratePlay}
      data-on={onDeck || undefined}
      onClick={() => {
        select(first.id);
        const reduce = document.documentElement.dataset.motion === "reduced";
        document.getElementById("now-title")?.closest("section")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M8 5l12 7-12 7z" fill="currentColor" />
      </svg>
      {onDeck ? "On the turntable" : "Play"}
      <span className="sr-only"> {title} on the turntable</span>
    </button>
  );
}
