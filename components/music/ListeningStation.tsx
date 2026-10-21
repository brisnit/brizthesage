"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { catalog, musicCopy, queueFilters, type CatalogTrack } from "@/content/music";
import {
  attachSpotifyHost,
  isActive,
  livePosition,
  next,
  previous,
  seek,
  select,
  toggle,
  trackById,
  usePlayer,
  type PlayerState,
} from "@/lib/player";
import { useReducedMotion } from "@/lib/settings";
import Deck from "./Deck";
import styles from "./Station.module.css";

type Filter = (typeof queueFilters)[number]["id"];

const fmt = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const year = (t: CatalogTrack) => (t.release.releaseDate ? new Date(t.release.releaseDate).getUTCFullYear() : null);
const playableIn = (t: CatalogTrack) => Boolean(t.audioSrc || t.spotifyId);

/** Re-render a few times a second while music plays, so time and seek bar move smoothly. */
function useLivePosition(s: PlayerState) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (s.status !== "playing") return;
    const id = window.setInterval(() => setTick((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, [s.status]);
  return livePosition(s);
}

function Icon({ name }: { name: "play" | "pause" | "prev" | "next" }) {
  const d = {
    play: "M8 5l12 7-12 7z",
    pause: "M7 5h4v14H7zM13 5h4v14h-4z",
    prev: "M6 5h2.5v14H6zM20 5v14L9.5 12z",
    next: "M15.5 5H18v14h-2.5zM4 5v14l10.5-7z",
  }[name];
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/** Three little bars beside the active song: moving while playing, resting while paused. */
function NowIndicator({ playing }: { playing: boolean }) {
  return (
    <span className={styles.bars} data-playing={playing || undefined} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

/**
 * "Now on the turntable": the Listening Room’s one player.
 * Turntable, now playing, controls and the full queue in one composition.
 */
export default function ListeningStation() {
  const s = usePlayer();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const hostRef = useRef<HTMLDivElement>(null);
  const position = useLivePosition(s);

  useEffect(() => {
    attachSpotifyHost(hostRef.current);
    return () => attachSpotifyHost(null);
  }, []);

  const track = trackById(s.currentId) ?? catalog[0];
  const playing = s.status === "playing" && !s.buffering;
  const started = s.status !== "idle";
  const needleDown = isActive(s) && s.status !== "loading";
  const duration = s.duration || 0;
  const shown = catalog.filter((t) => filter === "all" || t.group === filter);
  const spotifyUrl = track.spotifyId ? `https://open.spotify.com/track/${track.spotifyId}` : null;
  const appleUrl = track.release.links.find((l) => l.platform === "Apple Music")?.url ?? null;

  const statusText =
    s.status === "error"
      ? s.error
      : s.needsTap
        ? "Your browser wants one more tap: press play on the Spotify player below."
        : s.status === "loading"
          ? "Dropping the needle…"
          : s.status === "playing"
            ? s.buffering
              ? "Buffering…"
              : `Playing ${track.title}`
            : s.status === "paused"
              ? `Paused: ${track.title}`
              : s.status === "ended"
                ? "That’s the end of the shelf. Pick another record."
                : "Pick a song, or press play.";

  return (
    <section className={styles.station} aria-labelledby="now-title">
      <div className={styles.head}>
        <p className={styles.kicker}>{musicCopy.featuredKicker}</p>
        <h2 id="now-title" className="sr-only">
          {musicCopy.featuredKicker}
        </h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.player}>
          <Deck
            playing={playing}
            needleDown={needleDown}
            artwork={track.release.artwork.src}
            reduced={reduced}
            onToggle={toggle}
            label={`${playing ? "Pause" : "Play"} ${track.title} (the record)`}
          />

          <div className={styles.now}>
            <p className={styles.nowTitle}>{track.title}</p>
            <p className={styles.nowMeta}>
              {track.artist}
              <span aria-hidden="true"> · </span>
              <span className={styles.nowRelease}>
                {track.release.title}
                {year(track) && ` (${year(track)})`}
              </span>
            </p>
          </div>

          <div className={styles.controls} role="group" aria-label="Playback">
            <button type="button" className={styles.ctl} onClick={previous} aria-label="Previous song (or restart)">
              <Icon name="prev" />
            </button>
            <button
              type="button"
              className={`${styles.ctl} ${styles.playBtn}`}
              onClick={toggle}
              aria-label={playing || (s.status === "loading" && !s.needsTap) ? `Pause ${track.title}` : `Play ${track.title}`}
              disabled={!playableIn(track)}
            >
              <Icon name={playing || (s.status === "loading" && !s.needsTap) ? "pause" : "play"} />
            </button>
            <button type="button" className={styles.ctl} onClick={next} aria-label="Next song">
              <Icon name="next" />
            </button>
          </div>

          <div className={styles.seek}>
            <span className={styles.time}>{fmt(started ? position : 0)}</span>
            <input
              type="range"
              className={styles.range}
              min={0}
              max={Math.max(1, duration)}
              step={1000}
              value={started ? Math.min(position, duration) : 0}
              disabled={!started || s.status === "error" || duration === 0}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              aria-valuetext={`${fmt(position)} of ${fmt(duration)}`}
              style={{ "--pct": `${duration ? (Math.min(position, duration) / duration) * 100 : 0}%` } as React.CSSProperties}
            />
            <span className={styles.time}>{started && duration ? fmt(duration) : (track.duration ?? "–:––")}</span>
          </div>

          <p className={styles.status} role="status" aria-live="polite" data-error={s.status === "error" || undefined}>
            {statusText}
          </p>

          <div className={styles.elsewhere}>
            {spotifyUrl && (
              <a href={spotifyUrl} target="_blank" rel="noreferrer">
                Open in Spotify <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {appleUrl && (
              <a href={appleUrl} target="_blank" rel="noreferrer">
                Apple Music <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>

          {/* The real source: Spotify’s own player, created on the first play. */}
          <div className={styles.embed} data-on={(s.source === "spotify" && started) || undefined}>
            <div ref={hostRef} className={styles.embedHost} />
            {s.preview && <p className={styles.embedNote}>Playing a short preview. Signed in to Spotify in this browser? You’ll hear full songs.</p>}
          </div>
        </div>

        <div className={styles.queue}>
          <div className={styles.queueHead}>
            <h3 className={styles.queueTitle}>{musicCopy.queueTitle}</h3>
            <div className={styles.filters} role="group" aria-label="Show songs from">
              {queueFilters.map((f) => (
                <button key={f.id} type="button" className={styles.filter} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <ol className={styles.list}>
            {shown.map((t) => {
              const current = t.id === s.currentId && started;
              const rowPlaying = current && playing;
              const art = (
                <Image src={t.release.artwork.src} alt="" width={48} height={48} sizes="48px" className={styles.art} />
              );
              const text = (
                <span className={styles.rowText}>
                  <span className={styles.rowTitle}>{t.title}</span>
                  <span className={styles.rowArtist}>{t.artist}</span>
                </span>
              );
              return (
                <li key={t.id} className={styles.row} data-current={current || undefined}>
                  {playableIn(t) ? (
                    <button
                      type="button"
                      className={styles.rowButton}
                      aria-current={current ? "true" : undefined}
                      aria-label={`${current ? (rowPlaying ? "Pause" : "Resume") : "Play"} ${t.title} by ${t.artist}${current ? (rowPlaying ? ", now playing" : ", paused") : ""}`}
                      onClick={() => (current ? toggle() : select(t.id))}
                    >
                      {art}
                      {text}
                      <span className={styles.rowEnd}>
                        {current ? <NowIndicator playing={rowPlaying} /> : null}
                        <span className={styles.rowDur}>{t.duration ?? ""}</span>
                      </span>
                    </button>
                  ) : (
                    <div className={styles.rowButton} data-static>
                      {art}
                      {text}
                      {t.release.links[0] && (
                        <a className={styles.rowLink} href={t.release.links[0].url} target="_blank" rel="noreferrer">
                          Listen on {t.release.links[0].platform} <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
