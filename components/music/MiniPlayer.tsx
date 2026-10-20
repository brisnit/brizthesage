"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MiniPlayer.module.css";

export type PlayableTrack = { title: string; release: string; src: string };

/**
 * Persistent mini-player. Only rendered by the music page when real audio
 * exists (a track with `audioSrc` in content/music.ts). Never autoplays.
 */
export default function MiniPlayer({ tracks }: { tracks: PlayableTrack[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = tracks[index];

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      if (index < tracks.length - 1) setIndex(index + 1);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, [index, tracks.length]);

  if (!track) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  return (
    <div className={styles.player} role="region" aria-label="Mini player">
      <audio ref={audioRef} src={track.src} preload="none" />
      <button type="button" className={styles.play} onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
        {playing ? "❚❚" : "▶"}
      </button>
      <div className={styles.meta}>
        <p className={styles.title}>{track.title}</p>
        <p className={styles.release}>{track.release}</p>
        <div className={styles.bar} aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
      {tracks.length > 1 && (
        <div className={styles.skip}>
          <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous track">
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(tracks.length - 1, i + 1))}
            disabled={index === tracks.length - 1}
            aria-label="Next track"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
