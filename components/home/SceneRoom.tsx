"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { roomCopy, rugCopy } from "@/content/home";
import { directoryBlurbs, roomObjects, type RoomDialog, type RoomObject } from "@/content/room";
import { relics } from "@/content/game";
import { game, useGame } from "@/lib/gameStore";
import { sfx } from "@/lib/audio";
import { gsap, useGSAP } from "@/lib/gsap";
import { Hatch, Rug, decor, roomArt } from "@/components/room/RoomArt";
import Skeleton from "@/components/art/Skeleton";
import Dialog from "@/components/ui/Dialog";
import PhoneDialog from "@/components/room/PhoneDialog";
import TvDialog from "@/components/room/TvDialog";
import SageNetDialog from "@/components/room/SageNetDialog";
import styles from "./SceneRoom.module.css";

type Props = { reduced: boolean; onDescend: () => void };

type Bubble = { id: string; text: string; n: number };

/**
 * SCENES 3 + 4 — The living room, then something under the rug.
 * The room is pinned: the first stretch of scrolling is a deliberate pause to
 * explore; after that the rug slides aside, the hatch opens and we drop through.
 */
export default function SceneRoom({ reduced, onDescend }: Props) {
  const root = useRef<HTMLElement>(null);
  const state = useGame();
  const [dialog, setDialog] = useState<RoomDialog | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [lampOn, setLampOn] = useState(true);
  const [swinging, setSwinging] = useState(false);
  const counts = useRef<Record<string, number>>({});
  const bubbleSeq = useRef(0);

  useEffect(() => {
    if (!bubble) return;
    const t = window.setTimeout(() => setBubble(null), 3800);
    return () => window.clearTimeout(t);
  }, [bubble]);

  const quip = (id: string, text: string) => setBubble({ id, text, n: ++bubbleSeq.current });

  const act = (obj: RoomObject) => {
    const a = obj.action;
    if (a.type === "dialog") {
      setDirectoryOpen(false);
      setDialog(a.dialog);
      return;
    }
    const n = (counts.current[obj.id] = (counts.current[obj.id] ?? 0) + 1);
    if (obj.id === "lamp") {
      setLampOn((v) => !v);
      sfx("tick");
    }
    if (a.type === "quip") {
      quip(obj.id, a.lines[(n - 1) % a.lines.length]);
    } else if (a.type === "relic") {
      setSwinging(true);
      window.setTimeout(() => setSwinging(false), 1600);
      const fresh = !state.found[a.relic];
      quip(obj.id, fresh ? a.quip : "The clock has nothing left to give. It’s still wrong, though.");
      if (fresh) window.setTimeout(() => game.findRelic(a.relic), reduced ? 0 : 700);
    }
  };

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);

      // Step out of the warm doorway light into the room.
      gsap.fromTo(
        q("[data-anim='veil']"),
        { opacity: 1 },
        { opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 45%", end: "top top", scrub: true } },
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=230%",
          pin: q("[data-anim='stage']")[0],
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0 → 0.38: a deliberate pause to explore. Then the floor starts glowing.
      tl.to({}, { duration: 0.38 }, 0)
        .fromTo(q("[data-anim='rug-glow']"), { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.3)
        .to(q("[data-anim='down-hint']"), { opacity: 0, duration: 0.05 }, 0.42)
        .to(q("[data-anim='rug']"), { xPercent: 46, yPercent: 8, rotate: -8, duration: 0.14, ease: "power2.inOut" }, 0.44)
        .fromTo(q("[data-part='lid']"), { scaleY: 1 }, { scaleY: -0.3, duration: 0.08, ease: "power2.out" }, 0.58)
        .fromTo(q("[data-anim='skeleton']"), { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.1, ease: "back.out(1.6)" }, 0.56)
        .fromTo(q("[data-anim='skeleton'] [data-part='arm']"), { rotate: -14 }, { rotate: 6, duration: 0.05, yoyo: true, repeat: 3, svgOrigin: "118 186" }, 0.66)
        .fromTo(q("[data-anim='rug-line']"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.07 }, 0.64)
        .to(q("[data-anim='room-head']"), { opacity: 0, y: -20, duration: 0.06 }, 0.62)
        // down we go
        .to(q("[data-anim='rug-line']"), { opacity: 0, y: -10, duration: 0.05 }, 0.8)
        .fromTo(q("[data-anim='hole']"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.04 }, 0.82)
        .to(q("[data-anim='hole']"), { scale: 34, duration: 0.14, ease: "power2.in" }, 0.85);
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const directory = roomObjects.filter((o) => o.inDirectory);

  return (
    <section
      ref={root}
      id="living-room"
      tabIndex={-1}
      className={styles.room}
      aria-labelledby="room-title"
      data-scene="room"
      data-lamp={lampOn ? "on" : "off"}
    >
      <div className={styles.stage} data-anim="stage">
        <div className={styles.veil} data-anim="veil" aria-hidden="true" />
        <header className={styles.head} data-anim="room-head">
          <p className="kicker">{roomCopy.kicker}</p>
          <h2 id="room-title" className={styles.title}>
            {roomCopy.title}
          </h2>
          <p className={styles.hint}>
            {roomCopy.hint}{" "}
            <button type="button" className={styles.directoryButton} onClick={() => setDirectoryOpen(true)}>
              {roomCopy.directoryTitle}
            </button>
          </p>
        </header>

        <div className={styles.canvasRow}>
          <div className={styles.canvas}>
            <div className={styles.wall} aria-hidden="true" />
            <div className={styles.wainscot} aria-hidden="true" />
            <div className={styles.floor} aria-hidden="true" />

            <div className={styles.window} aria-hidden="true">
              <div className={styles.windowSky}>
                <span className={styles.windowMoon} />
                <span className={styles.windowHill} />
              </div>
              <span className={styles.curtainL} />
              <span className={styles.curtainR} />
            </div>

            <figure className={styles.photo}>
              <Image
                src="/art/briz-hood.jpg"
                alt="A framed photo of Briz the Sage in a hood"
                width={640}
                height={640}
                sizes="(max-width: 699px) 18vw, 8vw"
              />
            </figure>

            {(Object.keys(decor) as (keyof typeof decor)[]).map((k) => (
              <div key={k} className={`${styles.decor} ${styles[`decor-${k}`]}`} aria-hidden="true">
                {decor[k]}
              </div>
            ))}

            <div className={styles.hatch} data-anim="hatch" aria-hidden="true">
              <Hatch />
            </div>
            <div className={styles.rugGlow} data-anim="rug-glow" aria-hidden="true" />
            <div className={styles.rug} data-anim="rug" aria-hidden="true">
              <Rug />
            </div>

            {roomObjects.map((obj) => {
              const Art = roomArt[obj.id];
              const isNav = obj.action.type === "link";
              const isDest = isNav || obj.action.type === "dialog";
              const style = {
                "--x": obj.desktop.x,
                "--y": obj.desktop.y,
                "--w": obj.desktop.w,
                "--mx": obj.mobile.x,
                "--my": obj.mobile.y,
                "--mw": obj.mobile.w,
                zIndex: Math.round(obj.desktop.y) + 10,
              } as React.CSSProperties;
              const extra = {
                "data-id": obj.id,
                "data-dest": isDest || undefined,
                "data-swing": obj.id === "clock" && swinging ? "true" : undefined,
                "data-found": obj.id === "clock" && state.found.key ? "true" : undefined,
              };
              const inner = (
                <>
                  <Art />
                  {isDest && <span className={styles.spark} aria-hidden="true" />}
                  <span className={styles.caption} aria-hidden="true">
                    {obj.caption}
                  </span>
                  {bubble?.id === obj.id && (
                    <span key={bubble.n} className={styles.bubble} aria-hidden="true">
                      {bubble.text}
                    </span>
                  )}
                </>
              );
              return obj.action.type === "link" ? (
                <Link key={obj.id} href={obj.action.href} className={styles.obj} style={style} aria-label={obj.label} {...extra}>
                  {inner}
                </Link>
              ) : (
                <button key={obj.id} type="button" className={styles.obj} style={style} aria-label={obj.label} onClick={() => act(obj)} {...extra}>
                  {inner}
                </button>
              );
            })}

            <div className={styles.skeleton} data-anim="skeleton" aria-hidden="true">
              <Skeleton pose="point-down" />
            </div>
            <div className={styles.lampLight} aria-hidden="true" />
            <div className={styles.hole} data-anim="hole" aria-hidden="true" />
          </div>
        </div>

        <div className={styles.foot}>
          <p className={styles.rugLine} data-anim="rug-line">
            {rugCopy.line}
          </p>
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
          <button type="button" className={`btn btn-teal ${styles.hatchButton}`} onClick={onDescend}>
            {rugCopy.hatchLabel} <span aria-hidden="true">↓</span>
          </button>
        </div>

        {/* Screen-reader announcement for object reactions */}
        <p className="sr-only" aria-live="polite">
          {bubble?.text ?? ""}
        </p>
      </div>

      <Dialog open={directoryOpen} onClose={() => setDirectoryOpen(false)} title={roomCopy.directoryTitle}>
        <p className={styles.dirNote}>{roomCopy.directoryNote}</p>
        <ul className={styles.dirList}>
          {directory.map((obj) => {
            const label = directoryBlurbs[obj.id] ?? obj.caption;
            const name = obj.label.split(":")[0];
            return (
              <li key={obj.id}>
                {obj.action.type === "link" ? (
                  <Link href={obj.action.href} className={styles.dirItem}>
                    <span className={styles.dirName}>{name}</span>
                    <span className={styles.dirWhat}>{label}</span>
                  </Link>
                ) : (
                  <button type="button" className={styles.dirItem} onClick={() => act(obj)}>
                    <span className={styles.dirName}>{name}</span>
                    <span className={styles.dirWhat}>{label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <p className={styles.dirNote}>
          Relic hunting? {relics.filter((r) => state.found[r.id]).length} of {relics.length} found.{" "}
          <Link href="/briz-lore#the-house-remembers">The Archives can help.</Link>
        </p>
      </Dialog>

      <PhoneDialog open={dialog === "phone"} onClose={() => setDialog(null)} />
      <TvDialog open={dialog === "tv"} onClose={() => setDialog(null)} />
      <SageNetDialog open={dialog === "computer"} onClose={() => setDialog(null)} />
    </section>
  );
}
