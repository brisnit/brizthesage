"use client";

import { useRef } from "react";
import { roomCopy, rugCopy } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { Hatch, Rug } from "@/components/room/RoomArt";
import Skeleton from "@/components/art/Skeleton";
import styles from "./SceneRug.module.css";

type Props = { reduced: boolean; onDescend: () => void };

/**
 * SCENE 4 (phones) — Something under the rug.
 * On phones the living-room floor continues into a close-up of the rug.
 * (On desktop the rug is part of the living room; see SceneRoom.) This beat is
 * pinned: the rug glows, slides aside, the hatch opens, Baboo Baboo points
 * down, and the hole swallows the screen on the way under the house.
 */
export default function SceneRug({ reduced, onDescend }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);
      // Phones only: on desktop the rug lives in the living room itself.
      const mm = gsap.matchMedia();
      mm.add("(max-width: 699px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=170%",
            pin: q("[data-anim='stage']")[0],
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(q("[data-anim='rug-glow']"), { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0)
          .to(q("[data-anim='down-hint']"), { opacity: 0, y: -12, duration: 0.06 }, 0.12)
          .to(q("[data-anim='rug']"), { xPercent: 46, yPercent: 8, rotate: -8, duration: 0.18, ease: "power2.inOut" }, 0.18)
          .fromTo(q("[data-part='lid']"), { scaleY: 1 }, { scaleY: -0.3, duration: 0.08, ease: "power2.out" }, 0.36)
          .fromTo(q("[data-anim='skeleton']"), { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.1, ease: "back.out(1.6)" }, 0.38)
          .fromTo(q("[data-anim='skeleton'] [data-part='arm']"), { rotate: -14 }, { rotate: 6, duration: 0.05, yoyo: true, repeat: 3, svgOrigin: "118 186" }, 0.48)
          .fromTo(q("[data-anim='rug-line']"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.08 }, 0.46)
          // down we go
          .to(q("[data-anim='rug-line']"), { opacity: 0, y: -10, duration: 0.05 }, 0.74)
          .fromTo(q("[data-anim='hole']"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.04 }, 0.78)
          .to(q("[data-anim='hole']"), { scale: 34, duration: 0.18, ease: "power2.in" }, 0.82);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={styles.rugScene} aria-label="Under the rug" data-scene="rug">
      <div className={styles.stage} data-anim="stage">
        <div className={styles.copy}>
          <a
            href="#under-the-house"
            className={styles.downHint}
            data-anim="down-hint"
            onClick={(e) => {
              e.preventDefault();
              onDescend();
            }}
          >
            {roomCopy.nextHint} <span aria-hidden="true">↓</span>
          </a>
          <div className={styles.rugLine} data-anim="rug-line">
            <p>{rugCopy.line}</p>
            <p className={styles.hatchCaption}>{rugCopy.hatchCaption}</p>
          </div>
        </div>

        <div className={styles.pitArea} aria-hidden="true">
          <div className={styles.pit}>
            <div className={styles.rugGlow} data-anim="rug-glow" />
            <div className={styles.hatch}>
              <Hatch />
            </div>
            <div className={styles.rug} data-anim="rug">
              <Rug />
            </div>
            <div className={styles.skeleton} data-anim="skeleton">
              <Skeleton pose="point-down" />
            </div>
            <div className={styles.hole} data-anim="hole" />
          </div>
        </div>

        <button type="button" className={`btn btn-teal ${styles.hatchButton}`} onClick={onDescend}>
          {rugCopy.hatchLabel} <span aria-hidden="true">↓</span>
        </button>
      </div>
    </section>
  );
}
