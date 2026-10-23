"use client";

import { useState } from "react";
import { relics } from "@/content/game";
import { cabinetCopy, drawers } from "@/content/lore";
import { game, useGame } from "@/lib/gameStore";
import { sfx } from "@/lib/audio";
import { huntCopy } from "@/content/hunt";
import { hunt, useHunt } from "@/lib/hunt";
import { WeatherSymbol } from "@/components/hunt/Symbols";
import { RelicArt } from "@/components/art/Relics";
import styles from "./HouseRemembers.module.css";

/** Accessible alternative to hunting on the homepage: drawers that hold the relics. */
export default function LostAndFound() {
  const state = useGame();
  const trail = useHunt();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  // Remembers which relics were taken from a drawer during this visit, for the message.
  const [justTaken, setJustTaken] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    const d = drawers.find((x) => x.id === id)!;
    const opening = !open[id];
    setOpen((o) => ({ ...o, [id]: opening }));
    sfx("thunk");
    // The hidden trail: Baboo Baboo’s record is in the bottled weather (once the portrait has been noticed).
    if (opening && d.id === "weather") hunt.reach(2);
    if (opening && d.relic && !state.found[d.relic]) {
      game.findRelic(d.relic);
      setJustTaken((t) => ({ ...t, [id]: true }));
    }
  };

  return (
    <div className={styles.cabinet}>
      <h3 className={styles.h3}>{cabinetCopy.title}</h3>
      <p className={styles.cabinetIntro}>{cabinetCopy.intro}</p>
      <ul className={styles.drawers}>
        {drawers.map((d) => {
          const isOpen = Boolean(open[d.id]);
          const relic = d.relic ? relics.find((r) => r.id === d.relic) : undefined;
          return (
            <li key={d.id} className={styles.drawer} data-open={isOpen}>
              <button
                type="button"
                className={styles.drawerFront}
                aria-expanded={isOpen}
                aria-controls={`drawer-${d.id}`}
                onClick={() => toggle(d.id)}
              >
                <span className={styles.drawerLabel}>{d.label}</span>
                <span className={styles.knob} aria-hidden="true" />
              </button>
              <div id={`drawer-${d.id}`} className={styles.drawerInside} hidden={!isOpen}>
                {relic ? (
                  justTaken[d.id] ? (
                    <p className={styles.drawerRelic}>
                      <RelicArt id={relic.id} size={44} />
                      <span>
                        You found <strong>{relic.name}</strong>!
                      </span>
                    </p>
                  ) : (
                    <p>{state.found[relic.id] ? `An empty velvet outline. You already have ${relic.name}.` : d.note}</p>
                  )
                ) : d.id === "weather" && trail.stage >= 2 ? (
                  <div className={styles.weatherFind}>
                    <WeatherSymbol />
                    <p>{huntCopy.weather.reveal}</p>
                    <p className={styles.weatherTag}>“{huntCopy.weather.tag}”</p>
                  </div>
                ) : (
                  <p>{d.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
