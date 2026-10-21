"use client";

import { useState } from "react";
import type { Release, StreamingPlatform } from "@/content/music";
import { setSoundOn } from "@/lib/settings";
import { stopAmbient } from "@/lib/audio";
import styles from "./Music.module.css";

/** Each service's own recommended embed settings. */
const EMBEDS: Partial<Record<StreamingPlatform, { toEmbed: (url: string) => string; height: number; sandbox?: string }>> = {
  Spotify: {
    toEmbed: (url) => `${url.replace("open.spotify.com/", "open.spotify.com/embed/")}?utm_source=generator&theme=0`,
    height: 452,
  },
  "Apple Music": {
    toEmbed: (url) => url.replace("://music.apple.com/", "://embed.music.apple.com/"),
    height: 450,
    sandbox:
      "allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation",
  },
};

/**
 * Play a release right in the Listening Room. The player only loads after the
 * visitor picks one (no third-party requests or autoplay before that).
 * Signed-in listeners hear full songs; everyone else gets the service’s previews.
 */
export default function ListenPanel({ release }: { release: Release }) {
  const players = release.links.filter((l) => EMBEDS[l.platform]);
  const [active, setActive] = useState<StreamingPlatform | null>(null);
  if (players.length === 0) return null;

  const choose = (p: StreamingPlatform) => {
    // Quiet the room tone so it doesn't play over the music.
    setSoundOn(false);
    stopAmbient();
    setActive(p);
  };

  const link = players.find((l) => l.platform === active);
  const embed = active ? EMBEDS[active] : undefined;

  return (
    <section className={styles.listen} aria-labelledby="listen-title">
      <div className={styles.listenHead}>
        <h2 id="listen-title" className={styles.sectionTitle}>
          Play {release.title} here
        </h2>
        <p className={styles.sectionLede}>
          Pick a player. Full songs if you’re signed in to that service; short previews if you’re not.
        </p>
        <div className={styles.listenChoices} role="group" aria-label="Choose a player">
          {players.map((l) => (
            <button
              key={l.platform}
              type="button"
              className={`btn ${active === l.platform ? "btn-gold" : "btn-ghost"}`}
              aria-pressed={active === l.platform}
              onClick={() => choose(l.platform)}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path d="M5 3l12 7-12 7z" fill="currentColor" />
              </svg>
              {l.platform} player
            </button>
          ))}
        </div>
      </div>

      {link && embed ? (
        <div className={styles.playerFrame}>
          <iframe
            key={link.platform}
            src={embed.toEmbed(link.url)}
            title={`${release.title} on ${link.platform}`}
            height={embed.height}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            sandbox={embed.sandbox}
          />
        </div>
      ) : (
        <div className={styles.playerIdle} aria-hidden="true">
          <span className={styles.idleRecord} />
          <p>The needle’s up. Choose a player above.</p>
        </div>
      )}
      <p className={styles.listenNote}>The player is provided by {active ?? "Spotify or Apple Music"} and loads only when you choose it.</p>
    </section>
  );
}
