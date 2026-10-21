"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./Station.module.css";

type Props = {
  /** Music is actually playing (from playback events). */
  playing: boolean;
  /** A song is on the platter mid-play (playing or paused): the needle stays down. */
  needleDown: boolean;
  artwork: string;
  label: string;
  reduced: boolean;
  onToggle: () => void;
};

const CX = 170;
const CY = 168;
/** 33⅓ rpm, in degrees per second. */
const RPM_DEG = (100 / 3 / 60) * 360;

/**
 * The Listening Room turntable. Driven entirely by real playback state:
 * the record spins up when music plays, coasts to a stop when it pauses
 * (keeping its angle), and the tonearm lifts when a song ends.
 */
export default function Deck({ playing, needleDown, artwork, label, reduced, onToggle }: Props) {
  const recordRef = useRef<SVGGElement>(null);
  const anim = useRef({ angle: 0, speed: 0, raf: 0, last: 0 });
  const clipId = useId().replace(/:/g, "");

  useEffect(() => {
    const a = anim.current;
    if (reduced) {
      a.speed = 0;
      cancelAnimationFrame(a.raf);
      a.raf = 0;
      return;
    }
    const target = playing ? RPM_DEG : 0;
    const step = (t: number) => {
      const dt = a.last ? Math.min(0.1, (t - a.last) / 1000) : 0;
      a.last = t;
      // Spin up briskly, wind down gently (about two seconds to a stop).
      const ease = target > a.speed ? 3.2 : 2.6;
      a.speed += (target - a.speed) * Math.min(1, dt * ease);
      if (target === 0 && a.speed < 2) a.speed = 0;
      a.angle = (a.angle + a.speed * dt) % 360;
      recordRef.current?.setAttribute("transform", `rotate(${a.angle.toFixed(2)} ${CX} ${CY})`);
      if (a.speed === 0 && target === 0) {
        a.raf = 0;
        a.last = 0;
        return;
      }
      a.raf = requestAnimationFrame(step);
    };
    if (!a.raf) {
      a.last = 0;
      a.raf = requestAnimationFrame(step);
    }
    return () => {
      cancelAnimationFrame(a.raf);
      a.raf = 0;
      a.last = 0;
    };
  }, [playing, reduced]);

  return (
    <div className={styles.deck} data-playing={playing || undefined} data-needle={needleDown || undefined}>
      <svg viewBox="0 0 400 320" className={styles.deckArt} aria-hidden="true">
        <defs>
          <clipPath id={`label-${clipId}`}>
            <circle cx={CX} cy={CY} r="46" />
          </clipPath>
          <radialGradient id={`sheen-${clipId}`} cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="304" rx="186" ry="12" fill="rgba(0,0,0,0.38)" />
        {/* plinth */}
        <rect x="14" y="26" width="372" height="272" rx="18" fill="#7a4a2a" stroke="var(--line)" strokeWidth="3.5" />
        <rect x="14" y="26" width="372" height="272" rx="18" fill="url(#hatch)" />
        <rect x="28" y="40" width="344" height="244" rx="12" fill="#3a2230" stroke="var(--line)" strokeWidth="2.5" />
        {/* platter */}
        <circle cx={CX} cy={CY} r="128" fill="#2a1f22" stroke="var(--line)" strokeWidth="3" />
        {/* the record (rotated by the animation loop) */}
        <g ref={recordRef}>
          <circle cx={CX} cy={CY} r="120" fill="#17111d" stroke="var(--line)" strokeWidth="2" />
          {[108, 96, 84, 72, 60].map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#33283d" strokeWidth="1.2" />
          ))}
          <path d={`M${CX - 96} ${CY - 50} A108 108 0 0 1 ${CX - 50} ${CY - 96}`} stroke="var(--teal-300)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
          <image href={artwork} x={CX - 46} y={CY - 46} width="92" height="92" preserveAspectRatio="xMidYMid slice" clipPath={`url(#label-${clipId})`} />
          <circle cx={CX} cy={CY} r="46" fill="none" stroke="var(--line)" strokeWidth="2.5" />
          <circle cx={CX} cy={CY} r="4" fill="var(--parchment)" stroke="var(--line)" strokeWidth="1.5" />
        </g>
        <circle cx={CX} cy={CY} r="120" fill={`url(#sheen-${clipId})`} pointerEvents="none" />
        {/* tonearm */}
        <g className={styles.arm}>
          <circle cx="345" cy="70" r="16" fill="var(--parchment-dim)" stroke="var(--line)" strokeWidth="3" />
          <circle cx="345" cy="70" r="6" fill="var(--ochre-500)" stroke="var(--line)" strokeWidth="2" />
          <path d="M345 70 L322 200 L262 222" fill="none" stroke="var(--line)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M345 70 L322 200 L262 222" fill="none" stroke="var(--parchment-dim)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="246" y="212" width="22" height="16" rx="3" fill="var(--ochre-500)" stroke="var(--line)" strokeWidth="2.5" transform="rotate(-20 257 220)" />
        </g>
        {/* speed knob + a little speaker grille that breathes while music plays
            (a playback-state animation, not an audio analysis) */}
        <circle cx="352" cy="262" r="9" fill="var(--ochre-300)" stroke="var(--line)" strokeWidth="2" />
        <g className={styles.speaker}>
          <circle cx="312" cy="262" r="14" fill="#2a1f22" stroke="var(--line)" strokeWidth="2" />
          <circle className={styles.cone} cx="312" cy="262" r="7" fill="#4a3b57" stroke="var(--line)" strokeWidth="1.5" />
        </g>
        <circle cx="40" cy="270" r="5" className={styles.pilot} stroke="var(--line)" strokeWidth="1.5" />
      </svg>
      <button type="button" className={styles.recordButton} onClick={onToggle} aria-label={label} />
    </div>
  );
}
