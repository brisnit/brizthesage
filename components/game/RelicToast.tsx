"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { relics, type RelicId } from "@/content/game";
import { foundCount, game, useGame } from "@/lib/gameStore";
import { sfx } from "@/lib/audio";
import { RelicArt } from "@/components/art/Relics";
import styles from "./RelicToast.module.css";

/** Announces relic discoveries anywhere on the site. Mounted once in the root layout. */
export default function RelicToast() {
  const [shown, setShown] = useState<RelicId | null>(null);
  const state = useGame();

  useEffect(
    () =>
      game.onDiscovery((id) => {
        setShown(id);
        sfx("chime");
      }),
    [],
  );

  useEffect(() => {
    if (!shown) return;
    const t = window.setTimeout(() => setShown(null), 14000);
    return () => window.clearTimeout(t);
  }, [shown]);

  const relic = relics.find((r) => r.id === shown);
  const count = foundCount(state);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {relic && (
        <div className={styles.toast} key={relic.id}>
          <div className={styles.art}>
            <RelicArt id={relic.id} size={72} />
          </div>
          <div className={styles.body}>
            <p className={styles.kicker}>Relic found · {count} of {relics.length}</p>
            <p className={styles.name}>{relic.name}</p>
            <p className={styles.desc}>{relic.description}</p>
            <p className={styles.clue}>
              <span className="sr-only">Clue: </span>“{relic.clue}”
            </p>
            <p className={styles.saved}>
              Saved on this device.{" "}
              <Link href="/briz-lore#the-house-remembers" onClick={() => setShown(null)}>
                {count === relics.length ? "Wake the relics in the Archives" : "See your relics in the Archives"}
              </Link>
            </p>
          </div>
          <button type="button" className={styles.close} onClick={() => setShown(null)} aria-label="Dismiss relic message">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
