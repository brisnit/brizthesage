"use client";

import { useState } from "react";
import type { Video } from "@/content/music";
import styles from "./Music.module.css";

/** Lightweight YouTube embed: shows a thumbnail until the visitor asks to play. */
function LiteVideo({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const id = encodeURIComponent(video.youtubeId);
  return (
    <figure className={styles.video}>
      <div className={styles.videoFrame}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className={styles.videoPoster} onClick={() => setPlaying(true)}>
            {/* External thumbnail; plain img avoids configuring remote image domains. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" width={480} height={360} />
            <span className={styles.playBadge} aria-hidden="true">
              ▶
            </span>
            <span className="sr-only">Play video: {video.title}</span>
          </button>
        )}
      </div>
      <figcaption>{video.title}</figcaption>
    </figure>
  );
}

export default function VideoShelf({ videos }: { videos: Video[] }) {
  return (
    <div className={styles.videoGrid}>
      {videos.map((v) => (
        <LiteVideo key={v.youtubeId} video={v} />
      ))}
    </div>
  );
}
