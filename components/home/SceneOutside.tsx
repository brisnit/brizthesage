"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { approachCopy, outsideCopy } from "@/content/home";
import { Branch, Cloud, Foliage, House, Moon, Mountains, Stars, TealPlanet } from "@/components/art/Outside";
import Skeleton from "@/components/art/Skeleton";
import RelicSpot from "@/components/game/RelicSpot";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./SceneOutside.module.css";

type Props = { reduced: boolean; onEnter: () => void };

/**
 * SCENES 1 + 2 — The world outside, and the approach.
 * One pinned stage: scrolling moves the camera toward the crooked door.
 * Foreground layers move fastest, the moon barely moves, and the door light
 * finally swallows the screen as we step inside.
 */
export default function SceneOutside({ reduced, onEnter }: Props) {
  const root = useRef<HTMLElement>(null);
  const [mailOpen, setMailOpen] = useState(false);

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);

      // Intro: letters drop in, world settles.
      gsap.from(q("[data-letter]"), {
        yPercent: -60,
        rotate: () => gsap.utils.random(-25, 25),
        opacity: 0,
        duration: 1.1,
        ease: "back.out(1.8)",
        stagger: 0.06,
        delay: 0.15,
      });
      gsap.from(q("[data-anim='intro-fade']"), { opacity: 0, y: 16, duration: 1, stagger: 0.15, delay: 0.7 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          pin: q("[data-anim='stage']")[0],
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(q("[data-anim='title']"), { yPercent: -70, opacity: 0, duration: 0.25 }, 0)
        .to(q("[data-anim='cta']"), { y: 40, opacity: 0, duration: 0.12 }, 0)
        .to(q("[data-anim='stars']"), { yPercent: 6, duration: 1 }, 0)
        .to(q("[data-anim='moon']"), { yPercent: -10, scale: 1.08, duration: 1 }, 0)
        .to(q("[data-anim='planet']"), { yPercent: -40, xPercent: -30, duration: 1 }, 0)
        .to(q("[data-anim='small-moon']"), { yPercent: -30, duration: 0.6 }, 0)
        .to(q("[data-anim='cloud-back-l']"), { xPercent: -45, duration: 0.7 }, 0)
        .to(q("[data-anim='cloud-back-r']"), { xPercent: 45, duration: 0.7 }, 0)
        .to(q("[data-anim='cloud-l']"), { xPercent: -95, yPercent: -10, duration: 0.6 }, 0.05)
        .to(q("[data-anim='cloud-r']"), { xPercent: 95, yPercent: -12, duration: 0.6 }, 0.05)
        .to(q("[data-anim='mtn-l']"), { xPercent: -25, scale: 1.12, duration: 0.8 }, 0)
        .to(q("[data-anim='mtn-r']"), { xPercent: 25, scale: 1.12, duration: 0.8 }, 0)
        .to(q("[data-anim='branch']"), { yPercent: -120, xPercent: 20, duration: 0.45 }, 0)
        .to(q("[data-anim='fg-l']"), { xPercent: -80, yPercent: 20, scale: 1.5, duration: 0.5 }, 0)
        .to(q("[data-anim='fg-r']"), { xPercent: 80, yPercent: 20, scale: 1.5, duration: 0.5 }, 0)
        // walking up to the door
        .fromTo(
          q("[data-anim='house']"),
          { scale: 1, yPercent: 0 },
          { scale: () => (window.innerWidth < 700 ? 2.3 : 2.7), yPercent: 8, duration: 0.8, ease: "power1.in" },
          0.08,
        )
        .fromTo(q("[data-anim='door-glow']"), { opacity: 0.35, scale: 0.8 }, { opacity: 1, scale: 1.4, duration: 0.5 }, 0.3)
        .fromTo(q("[data-anim='whisper']"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.15 }, 0.22)
        .to(q("[data-anim='whisper']"), { opacity: 0, y: -20, duration: 0.12 }, 0.6)
        .fromTo(q("[data-anim='peek'] svg"), { xPercent: 70 }, { xPercent: 8, duration: 0.18, ease: "back.out(2)" }, 0.42)
        .to(q("[data-anim='peek'] svg"), { rotate: -10, duration: 0.08, yoyo: true, repeat: 1 }, 0.62)
        .fromTo(q("[data-anim='door-line']"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.1 }, 0.6)
        .to(q("[data-anim='door-line']"), { opacity: 0, duration: 0.06 }, 0.8)
        // through the doorway: warm light fills the screen
        .to(q("[data-anim='small-moon']"), { opacity: 0, duration: 0.05 }, 0.74)
        .set(q("[data-anim='house']"), { zIndex: 20 }, 0.8)
        .fromTo(q("[data-anim='door-light']"), { opacity: 0, scale: 1 }, { opacity: 1, scale: 1.3, duration: 0.06 }, 0.82)
        .to(q("[data-anim='door-light']"), { scale: 26, duration: 0.14, ease: "power2.in" }, 0.86);
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={styles.outside} aria-labelledby="home-title" data-scene="outside">
      <div className={styles.stage} data-anim="stage">
        <div className={styles.sky} aria-hidden="true" />
        <div className={styles.stars} data-anim="stars" aria-hidden="true">
          <Stars />
        </div>
        <div className={styles.planet} data-anim="planet" aria-hidden="true">
          <TealPlanet />
        </div>
        <div className={styles.moon} data-anim="moon" aria-hidden="true">
          <Moon />
        </div>
        <div className={styles.cloudBackL} data-anim="cloud-back-l" aria-hidden="true">
          <Cloud tone="dusk" face={false} />
        </div>
        <div className={styles.cloudBackR} data-anim="cloud-back-r" aria-hidden="true">
          <Cloud tone="dusk" face={false} flip />
        </div>
        <div className={styles.mtnL} data-anim="mtn-l" aria-hidden="true">
          <Mountains side="left" />
        </div>
        <div className={styles.mtnR} data-anim="mtn-r" aria-hidden="true">
          <Mountains side="right" />
        </div>
        <div className={styles.sea} aria-hidden="true" />

        {/* The interactive part of the scene. On phones this is its own box between
            the title and the buttons, so copy never covers the mailbox or the relic. */}
        <div className={styles.scene}>
          <div className={styles.smallMoon} data-anim="small-moon">
            <div className={styles.smallMoonDrift}>
              <RelicSpot relic="moon" label="Something small and shiny drifting near the moon" size={46} />
            </div>
          </div>
          <div className={styles.house} data-anim="house">
            <House className={styles.houseArt} />
            <div className={styles.doorGlow} data-anim="door-glow" aria-hidden="true" />
            <div className={styles.peek} data-anim="peek" aria-hidden="true">
              <Skeleton pose="peek" headOnly />
            </div>
            <p className={styles.doorLine} data-anim="door-line">
              {approachCopy.doorLine}
            </p>
            <button
              type="button"
              className={styles.mailbox}
              aria-label="A crooked mailbox"
              aria-expanded={mailOpen}
              onClick={() => setMailOpen((v) => !v)}
              data-open={mailOpen}
            >
              <svg viewBox="0 0 60 90" aria-hidden="true">
                <path d="M27 88 L29 46 L35 46 L33 88 Z" fill="#6f3f39" stroke="var(--line)" strokeWidth="2.5" />
                <path d="M8 48 L8 30 C8 18 18 12 30 12 C42 12 52 18 52 30 L52 48 Z" fill="var(--coral-500)" stroke="var(--line)" strokeWidth="3" />
                <path d="M8 48 L8 30 C8 22 13 17 20 15 C14 20 14 26 14 30 L14 48 Z" fill="var(--coral-600)" />
                <g className={styles.flag}>
                  <path d="M52 34 L58 34 L58 14 L66 14 L66 22 L58 22" fill="var(--ochre-300)" stroke="var(--line)" strokeWidth="2.5" strokeLinejoin="round" />
                </g>
                {mailOpen && <path d="M14 30 L22 18 L46 22 L42 34 Z" fill="var(--parchment)" stroke="var(--line)" strokeWidth="2" />}
              </svg>
            </button>
            {mailOpen && (
              <p className={styles.mailNote} role="status">
                A postcard: “{outsideCopy.postcard}”
              </p>
            )}
            <div className={styles.doorLight} data-anim="door-light" aria-hidden="true" />
          </div>
        </div>

        <p className={`${styles.whisper} ${styles.whisperA}`} data-anim="whisper">
          {approachCopy.whispers[0]}
        </p>
        <p className={`${styles.whisper} ${styles.whisperB}`} data-anim="whisper">
          {approachCopy.whispers[1]}
        </p>

        <div className={styles.cloudL} data-anim="cloud-l" aria-hidden="true">
          <Cloud tone="pink" />
        </div>
        <div className={styles.cloudR} data-anim="cloud-r" aria-hidden="true">
          <Cloud tone="coral" flip />
        </div>
        <div className={styles.branch} data-anim="branch" aria-hidden="true">
          <Branch />
        </div>
        <div className={styles.fgL} data-anim="fg-l" aria-hidden="true">
          <Foliage side="left" />
        </div>
        <div className={styles.fgR} data-anim="fg-r" aria-hidden="true">
          <Foliage side="right" />
        </div>

        <div className={styles.titleBlock} data-anim="title">
          <h1 id="home-title" tabIndex={-1} className={styles.title} aria-label={outsideCopy.title.map((l) => l.text).join(" ")}>
            {outsideCopy.title.map((line, w) => (
              <span key={line.text} className={styles.word} data-small={line.small || undefined} aria-hidden="true">
                {line.small ? (
                  <span className={styles.letter} data-letter>
                    {line.text}
                  </span>
                ) : (
                  line.text.split("").map((ch, i) => (
                    <span key={i} className={styles.letter} data-letter style={{ "--i": i, "--w": w } as React.CSSProperties}>
                      {ch}
                    </span>
                  ))
                )}
              </span>
            ))}
          </h1>
        </div>

        <div className={styles.cta} data-anim="cta">
          <p className={styles.cue} data-anim="intro-fade">
            {outsideCopy.scrollCue}{" "}
            <span className={styles.cueArrow} aria-hidden="true">
              ↓
            </span>
          </p>
          <button type="button" className="btn" onClick={onEnter} data-anim="intro-fade">
            {outsideCopy.cta}
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M10 3v13M4 10l6 6 6-6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link href="/music" className="btn btn-gold" data-anim="intro-fade">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M5 3l12 7-12 7z" fill="currentColor" />
            </svg>
            {outsideCopy.listen}
          </Link>
        </div>
      </div>
    </section>
  );
}
