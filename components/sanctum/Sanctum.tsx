"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sanctumCopy } from "@/content/hunt";
import { hunt, useHunt } from "@/lib/hunt";
import { useReducedMotion } from "@/lib/settings";
import { gsap, useGSAP } from "@/lib/gsap";
import ThroneScene, { type SageState } from "./ThroneScene";
import AskSage from "./AskSage";
import BookOfBrizIzm from "./BookOfBrizIzm";
import Cabinet from "./Cabinet";
import OliverCorner from "./OliverCorner";
import Keepsake from "./Keepsake";
import styles from "./Sanctum.module.css";

/** The secret sanctuary of Briz the Sage. Loaded only for pilgrims who found the door. */
export default function Sanctum({ onEnter }: { onEnter?: () => void }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => onEnter?.(), [onEnter]);
  const reduced = useReducedMotion();
  const h = useHunt();
  const [sage, setSage] = useState<SageState>("idle");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // Subtle depth: the far glow and the smoke drift slower than the throne as you scroll.
  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);
      gsap.to(q("[data-depth='far']"), { y: 60, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(q("[data-layer='near']"), { y: -40, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <main ref={root} className={styles.sanctum}>
      <div className={styles.haze} aria-hidden="true" />
      <div className={styles.candles} data-layer="near" aria-hidden="true">
        {[8, 18, 82, 92].map((x, i) => (
          <span key={x} className={styles.candle} style={{ left: `${x}%`, animationDelay: `${-i * 0.6}s` }} />
        ))}
      </div>

      <header className={styles.intro}>
        <p className="kicker">{sanctumCopy.kicker}</p>
        <h1 className={styles.title}>{sanctumCopy.title}</h1>
        <p className={styles.lede}>{sanctumCopy.intro}</p>
      </header>

      <section className={styles.hall} aria-labelledby="throne-title">
        <div className={styles.hallScene}>
          <h2 id="throne-title" className={styles.sectionTitle}>
            {sanctumCopy.throneTitle}
          </h2>
          <p className={styles.sectionNote}>{sanctumCopy.throneNote}</p>
          <ThroneScene state={sage} />
        </div>
        <AskSage onState={setSage} />
      </section>

      <BookOfBrizIzm />
      <Cabinet />
      <OliverCorner />
      <Keepsake unlockedAt={h.unlockedAt} />

      <footer className={styles.exit}>
        <Link href="/" className="btn btn-teal">
          Back up to the blue house
        </Link>
        <Link href="/music" className="btn btn-gold">
          Go listen
        </Link>
        {resetDone ? (
          <p className={styles.small} role="status">
            {sanctumCopy.resetDone}
          </p>
        ) : confirmReset ? (
          <div className={styles.confirm} role="group" aria-label="Confirm">
            <p>{sanctumCopy.resetConfirm}</p>
            <button
              type="button"
              className="btn btn-coral"
              onClick={() => {
                hunt.reset();
                setResetDone(true);
              }}
            >
              Yes, forget it
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
              Keep it
            </button>
          </div>
        ) : (
          <button type="button" className={styles.toolLink} onClick={() => setConfirmReset(true)}>
            {sanctumCopy.reset}
          </button>
        )}
      </footer>
    </main>
  );
}
