"use client";

import { relics, type RelicId } from "@/content/game";
import { game, useGame } from "@/lib/gameStore";
import { RelicArt } from "@/components/art/Relics";
import styles from "./RelicSpot.module.css";

type Props = {
  relic: RelicId;
  /** Accessible name before discovery (should not spoil the relic). */
  label: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onFound?: () => void;
};

/** A hidden relic. Clicking or tapping it saves the discovery and announces the clue. */
export default function RelicSpot({ relic, label, size = 56, className, style, onFound }: Props) {
  const state = useGame();
  const found = Boolean(state.found[relic]);
  const name = relics.find((r) => r.id === relic)?.name ?? relic;

  return (
    <button
      type="button"
      className={`${styles.spot} ${className ?? ""}`}
      style={style}
      data-found={found}
      aria-label={found ? `${name} (found, show clue again)` : label}
      onClick={() => {
        game.findRelic(relic);
        onFound?.();
      }}
    >
      <span className={styles.twinkle} aria-hidden="true" />
      <RelicArt id={relic} size={size} className={styles.art} />
    </button>
  );
}
