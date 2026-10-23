"use client";

import { useEffect, useRef, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { phoneCopy, phoneScript, type PhoneLine } from "@/content/phone";
import { relics, secretCall, secretNumber } from "@/content/game";
import { allFound, game, useGame, type GameState } from "@/lib/gameStore";
import { sfx } from "@/lib/audio";
import { hunt } from "@/lib/hunt";
import { isReducedMotion } from "@/lib/settings";
import styles from "./RoomDialogs.module.css";

type Line = { from: "house" | "you" | "narration"; text: string };

/** Game help after the advice line, always matching the real puzzle state. */
function cluesFor(state: GameState): string[] {
  if (state.solved) return [secretCall.hintOnPhone];
  if (allFound(state)) return [phoneCopy.allFound];
  const missing = relics.filter((r) => !state.found[r.id]);
  return [phoneCopy.missingIntro, ...missing.map((r) => `“${r.riddle}”`)];
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

/** The rotary phone: a short, mysterious branching call plus a working dial. */
export default function PhoneDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title={phoneCopy.title} variant="dark" className={styles.phonePanel}>
      {/* Mounted fresh on every open, so each pick-up starts a new call. */}
      <PhoneCall onClose={onClose} />
    </Dialog>
  );
}

function PhoneCall({ onClose }: { onClose: () => void }) {
  const state = useGame();
  const [log, setLog] = useState<Line[]>([]);
  const [node, setNode] = useState<string | null>("start");
  const [dialed, setDialed] = useState("");
  const [spin, setSpin] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLOListElement>(null);

  const say = (lines: PhoneLine[], after?: () => void) => {
    const step = isReducedMotion() ? 0 : 650;
    lines.forEach((line, i) => {
      const entry: Line = typeof line === "string" ? { from: "house", text: line } : { from: "narration", text: line.narration };
      timers.current.push(
        window.setTimeout(() => {
          setLog((l) => [...l, entry]);
          if (i === lines.length - 1) {
            setBusy(false);
            after?.();
          }
        }, step * (i + 1)),
      );
    });
    if (lines.length === 0) timers.current.push(window.setTimeout(() => setBusy(false), 0));
  };

  // Ring, then the house picks up.
  useEffect(() => {
    const pending = timers.current;
    sfx("ring");
    say(phoneScript.start.lines);
    return () => pending.forEach((t) => clearTimeout(t));
  }, []);

  useEffect(() => {
    logRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [log]);

  const choose = (label: string, next: string | null) => {
    setLog((l) => [...l, { from: "you", text: label }]);
    setBusy(true);
    if (next === null) {
      setNode(null);
      say([{ narration: phoneCopy.hangUp }], () => window.setTimeout(onClose, isReducedMotion() ? 0 : 1600));
      return;
    }
    setNode(next);
    if (next === "babooHint") {
      // The newest hint for where the visitor actually is (each ask goes one step plainer).
      const lines = hunt.nextHint();
      say([lines[lines.length - 1]]);
      return;
    }
    if (next === "babooForgetYes") hunt.reset();
    say(next === "advice" ? [...phoneScript.advice.lines, ...cluesFor(state)] : phoneScript[next].lines);
  };

  const dial = (d: string) => {
    if (dialed.length >= 8) return;
    sfx("tick");
    setDialed((v) => v + d);
    setSpin(d);
    window.setTimeout(() => setSpin(null), 450);
  };

  const call = () => {
    if (!dialed) return;
    setLog((l) => [...l, { from: "you", text: `☎ ${dialed}` }]);
    setBusy(true);
    if (dialed === secretNumber) {
      sfx("win");
      game.recordSecretCall();
      say(secretCall.lines);
    } else {
      sfx("thunk");
      say([phoneCopy.wrongNumber[dialed.length % phoneCopy.wrongNumber.length]]);
    }
    setDialed("");
  };

  const options = node ? phoneScript[node].options : [];

  return (
    <>
      <ol ref={logRef} className={styles.callLog} aria-live="polite">
        {log.map((line, i) => (
          <li key={i} data-from={line.from}>
            <span className="sr-only">{line.from === "house" ? "The voice says: " : line.from === "you" ? "You: " : ""}</span>
            {line.text}
          </li>
        ))}
        {busy && (
          <li data-from="house" className={styles.typing} aria-hidden="true">
            <span />
            <span />
            <span />
          </li>
        )}
      </ol>

      {node && !busy && (
        <div className={styles.options} role="group" aria-label="What do you say?">
          {options.map((o) => (
            <button key={o.label} type="button" className="btn btn-ghost" onClick={() => choose(o.label, o.next)}>
              {o.label}
            </button>
          ))}
        </div>
      )}

      <section className={styles.dialArea} aria-labelledby="dial-title">
        <h3 id="dial-title" className={styles.dialTitle}>
          {phoneCopy.dialPrompt}
        </h3>
        <div className={styles.dialRow}>
          <div className={styles.dial} role="group" aria-label="Rotary dial">
            <div className={styles.dialFace} data-spin={spin ?? undefined} aria-hidden="true" />
            {DIGITS.map((d, i) => {
              const a = -60 - i * 30;
              return (
                <button
                  key={d}
                  type="button"
                  className={styles.digit}
                  style={{ "--a": `${a}deg` } as React.CSSProperties}
                  onClick={() => dial(d)}
                  aria-label={`Dial ${d}`}
                >
                  {d}
                </button>
              );
            })}
            <span className={styles.dialStop} aria-hidden="true" />
          </div>
          <div className={styles.dialControls}>
            <output className={styles.dialed} aria-label="Number dialed">
              {dialed || "—"}
            </output>
            <button type="button" className="btn btn-gold" onClick={call} disabled={!dialed || busy}>
              Call
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setDialed("")} disabled={!dialed}>
              Clear
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
