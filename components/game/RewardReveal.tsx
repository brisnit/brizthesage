"use client";

import { useEffect, useRef, useState } from "react";
import { puzzleCopy, relics, reward } from "@/content/game";
import { useGame } from "@/lib/gameStore";
import { RelicArt } from "@/components/art/Relics";
import ExplorerCard from "./ExplorerCard";
import styles from "./HouseRemembers.module.css";

let justSolved = false;
/** Call right after a successful attempt so the reveal plays (it stays calm on later visits). */
export const markJustSolved = () => {
  justSolved = true;
};

/** Shown once the puzzle is solved: the relics merge, light pours out, the reward unfolds. */
export default function RewardReveal() {
  const state = useGame();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [celebrate] = useState(() => justSolved);

  useEffect(() => {
    if (!celebrate) return;
    justSolved = false;
    const reduced = document.documentElement.dataset.motion === "reduced";
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.closest("div")?.parentElement?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [celebrate]);

  return (
    <div className={styles.reveal} data-celebrate={celebrate}>
      <div className={styles.stage} aria-hidden="true">
        <span className={styles.rays} />
        <span className={styles.orbit}>
          {relics.map((r, i) => (
            <span key={r.id} className={styles.orbiter} style={{ "--i": i } as React.CSSProperties}>
              <RelicArt id={r.id} size={70} />
            </span>
          ))}
        </span>
        <span className={styles.burst} />
      </div>

      <div className={`paper ${styles.rewardCard}`}>
        <p className={styles.rewardKicker}>Solved</p>
        <h3 ref={headingRef} tabIndex={-1} className={styles.rewardTitle}>
          {puzzleCopy.solved}
        </h3>
        {puzzleCopy.solvedLines.map((l) => (
          <p key={l} className={styles.solvedLine}>
            {l}
          </p>
        ))}
        <RewardPanel />
        <p className={styles.phoneTease}>
          {state.secretCall ? (
            <>☎ Night Line: answered. The house is impressed.</>
          ) : (
            <>P.S. The phone in the living room has been ringing.</>
          )}
        </p>
      </div>
    </div>
  );
}

function RewardPanel() {
  return (
    <div className={styles.rewardBody}>
      <h4 className={styles.rewardName}>{reward.title}</h4>
      <p>{reward.description}</p>

      {reward.kind === "download" && (
        <>
          <ul className={styles.downloads}>
            {reward.files.map((f) => (
              <li key={f.href}>
                <a className="btn btn-gold" href={f.href} download={f.filename}>
                  <DownloadIcon /> {f.label}
                </a>
                <span className={styles.fileNote}>{f.note}</span>
              </li>
            ))}
          </ul>
          {reward.explorerCard && <ExplorerCard keepsakes={reward.files} />}
        </>
      )}

      {reward.kind === "track" && (
        <>
          <audio controls preload="none" src={reward.audioSrc} className={styles.audio}>
            Your browser can’t play this audio.
          </audio>
          {reward.downloadHref && (
            <a className="btn btn-gold" href={reward.downloadHref} download>
              <DownloadIcon /> Download
            </a>
          )}
        </>
      )}

      {reward.kind === "discount" && (
        <>
          <p className={styles.code}>
            Code: <strong>{reward.code}</strong>
          </p>
          <a className="btn btn-gold" href={reward.shopUrl}>
            Visit the shop
          </a>
        </>
      )}

      <p className={styles.localNote}>
        Made just for explorers. This game runs entirely in your browser, so it’s a gift, not a vault: nothing here is secret or limited.
      </p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
