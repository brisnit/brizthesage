"use client";

import { useEffect, useRef, useState } from "react";
import { hints, puzzleCopy, relics, type RelicId } from "@/content/game";
import { allFound, foundCount, game, useGame } from "@/lib/gameStore";
import { sfx } from "@/lib/audio";
import { RelicArt } from "@/components/art/Relics";
import LostAndFound from "./LostAndFound";
import RewardReveal, { markJustSolved } from "./RewardReveal";
import styles from "./HouseRemembers.module.css";

const ordinal = ["First", "Second", "Third"];

/** "The House Remembers": relic shelf, Lost & Found, the final puzzle and the reward. */
export default function HouseRemembers() {
  const state = useGame();
  const count = foundCount(state);
  const ready = allFound(state);

  return (
    <section id="the-house-remembers" className={styles.game} aria-labelledby="game-title">
      <div className={styles.head}>
        <p className="kicker">A small game</p>
        <h2 id="game-title" className={styles.title}>
          {puzzleCopy.title}
        </h2>
        <p className={styles.intro}>{puzzleCopy.intro}</p>
        <p className={styles.saved}>
          <SaveIcon /> {puzzleCopy.savedNote}
        </p>
      </div>

      <h3 className={styles.h3}>
        Relics found: {count} of {relics.length}
      </h3>
      {count > 0 && <p className={styles.progressLine}>{puzzleCopy.progress}</p>}
      <ul className={styles.shelf}>
        {relics.map((r) => {
          const found = Boolean(state.found[r.id]);
          return (
            <li key={r.id} className={styles.relicCard} data-found={found}>
              <div className={styles.relicArt}>
                {found ? <RelicArt id={r.id} size={84} /> : <span className={styles.unknown} aria-hidden="true">?</span>}
              </div>
              {found ? (
                <div className={styles.relicText}>
                  <h4 className={styles.relicName}>{r.name}</h4>
                  <p>{r.description}</p>
                  <p className={styles.clue}>
                    <span className={styles.clueLabel}>Clue</span> “{r.clue}”
                  </p>
                </div>
              ) : (
                <div className={styles.relicText}>
                  <h4 className={styles.relicName}>Not found yet</h4>
                  <p className={styles.riddle}>{r.riddle}</p>
                  <p className={styles.where}>
                    <span className={styles.clueLabel}>Look</span> {r.whereHome}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <LostAndFound />

      {state.solved ? <RewardReveal /> : ready ? <Puzzle hintsShown={state.hintsShown} /> : <Waiting count={count} />}

      <ResetProgress />
    </section>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ verticalAlign: "-3px" }}>
      <path d="M5 3h11l3 3v15H5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 3v6h7V3M8 21v-7h8v7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Waiting({ count }: { count: number }) {
  return (
    <div className={`paper ${styles.puzzle}`}>
      <h3 className={styles.h3Dark}>Wake the relics</h3>
      <p>{puzzleCopy.missing}</p>
      <p className={styles.small}>
        {relics.length - count} still hiding. Explore the blue house, or open the drawers above.
      </p>
    </div>
  );
}

function Puzzle({ hintsShown }: { hintsShown: number }) {
  const [order, setOrder] = useState<RelicId[]>([]);
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(0);
  const wakeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (order.length === relics.length) wakeRef.current?.focus();
  }, [order.length]);

  const place = (id: RelicId) => {
    if (order.includes(id) || order.length >= relics.length) return;
    const next = [...order, id];
    setOrder(next);
    sfx("tick");
    const name = relics.find((r) => r.id === id)!.name;
    setMessage(`${name} placed ${ordinal[next.length - 1].toLowerCase()}.`);
  };

  const wake = () => {
    if (game.attempt(order)) {
      markJustSolved();
      sfx("win");
      // RewardReveal takes over once the store marks the game solved.
    } else {
      sfx("thunk");
      setMessage(puzzleCopy.wrong);
      setShake((s) => s + 1);
    }
  };

  return (
    <div className={`paper ${styles.puzzle}`}>
      <h3 className={styles.h3Dark}>Wake the relics</h3>
      <p>Press the relics in the order the house should wake them. Use the clues.</p>

      <ul className={styles.clueList} aria-label="Your clues">
        {relics.map((r) => (
          <li key={r.id}>“{r.clue}”</li>
        ))}
      </ul>

      <ol className={styles.slots} key={shake} data-shake={shake > 0} aria-label="Activation order">
        {relics.map((_, i) => {
          const id = order[i];
          const r = relics.find((x) => x.id === id);
          return (
            <li key={i} className={styles.slot} data-filled={Boolean(r)}>
              <span className={styles.slotNum}>{ordinal[i]}</span>
              {r ? (
                <>
                  <RelicArt id={r.id} size={64} />
                  <span className={styles.slotName}>{r.name}</span>
                </>
              ) : (
                <span className={styles.slotEmpty}>empty</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className={styles.relicButtons} role="group" aria-label="Relics to place">
        {relics.map((r) => {
          const placed = order.includes(r.id);
          return (
            <button key={r.id} type="button" className={styles.relicButton} onClick={() => place(r.id)} disabled={placed || order.length >= relics.length}>
              <RelicArt id={r.id} size={44} />
              <span>
                {placed ? "Placed: " : "Place "}
                {r.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        {order.length === relics.length && (
          <button ref={wakeRef} type="button" className="btn btn-gold" onClick={wake}>
            Wake the relics
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          disabled={order.length === 0}
          onClick={() => {
            setOrder((o) => o.slice(0, -1));
            setMessage("Took the last relic back.");
          }}
        >
          Undo last
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={order.length === 0}
          onClick={() => {
            setOrder([]);
            setMessage("Cleared. Start again whenever.");
          }}
        >
          Clear
        </button>
      </div>

      <p className={styles.feedback} aria-live="polite" role="status">
        {message}
      </p>

      <div className={styles.hints}>
        {hintsShown > 0 && (
          <ol className={styles.hintList} aria-label="Hints">
            {hints.slice(0, hintsShown).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>
        )}
        {hintsShown < hints.length && (
          <button type="button" className={styles.hintButton} onClick={() => game.showNextHint(hints.length)}>
            {hintsShown === 0 ? puzzleCopy.hintInvite : `Another hint (${hintsShown + 1} of ${hints.length})`}
          </button>
        )}
      </div>
    </div>
  );
}

function ResetProgress() {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className={styles.reset}>
      {confirming ? (
        <div className={styles.confirm} role="group" aria-label="Confirm reset">
          <p>Forget everything the house remembers on this device?</p>
          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-coral"
              onClick={() => {
                game.reset();
                setConfirming(false);
                setDone(true);
              }}
            >
              Yes, reset
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)} autoFocus>
              Keep my progress
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={styles.resetButton}
          onClick={() => {
            setConfirming(true);
            setDone(false);
          }}
        >
          Reset progress
        </button>
      )}
      <p className={styles.small} aria-live="polite">
        {done ? "Progress reset. The relics have wandered back to their hiding places." : ""}
      </p>
    </div>
  );
}
