"use client";

import Link from "next/link";
import Dialog from "@/components/ui/Dialog";
import VideoShelf from "@/components/music/VideoShelf";
import { videos } from "@/content/music";
import styles from "./RoomDialogs.module.css";

/** The CRT television. Shows real videos from content/music.ts, or an honest empty state. */
export default function TvDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Channel 13" variant="dark">
      {videos.length > 0 ? (
        <VideoShelf videos={videos} />
      ) : (
        <div className={styles.tvEmpty}>
          <div className={styles.tvScreen} aria-hidden="true">
            <div className={styles.tvNoise} />
            <span className={styles.tvBars} />
          </div>
          <p className={styles.tvHeadline}>No broadcasts yet.</p>
          <p>
            The TV is warmed up and waiting. When Briz releases videos, they’ll play right here and in the
            Listening Room.
          </p>
          <Link className="btn btn-gold" href="/music">
            Go to the Listening Room
          </Link>
        </div>
      )}
    </Dialog>
  );
}
