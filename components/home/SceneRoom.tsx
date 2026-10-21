"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { roomCopy } from "@/content/home";
import {
  directoryBlurbs,
  roomDecor,
  roomLevels,
  roomObjects,
  type Placement,
  type RoomDecorId,
  type RoomDialog,
  type RoomLevel,
  type RoomObject,
} from "@/content/room";
import { relics } from "@/content/game";
import { game, useGame } from "@/lib/gameStore";
import { sfx } from "@/lib/audio";
import { gsap, useGSAP } from "@/lib/gsap";
import { decor, roomArt } from "@/components/room/RoomArt";
import Dialog from "@/components/ui/Dialog";
import PhoneDialog from "@/components/room/PhoneDialog";
import TvDialog from "@/components/room/TvDialog";
import SageNetDialog from "@/components/room/SageNetDialog";
import styles from "./SceneRoom.module.css";

type Props = { reduced: boolean };

type Bubble = { id: string; text: string; n: number };

/** Placement as CSS variables: desktop (--x/--y/--w) and phone (--mx/--my/--mw). Hidden when null. */
function placeVars(desktop: Placement | null, mobile: Placement | null) {
  const d = desktop ?? { x: 0, y: 0, w: 0 };
  const m = mobile ?? { x: 0, y: 0, w: 0 };
  return {
    "--x": d.x,
    "--y": d.y,
    "--w": d.w,
    "--mx": m.x,
    "--my": m.y,
    "--mw": m.w,
    // Things lower in the room stand in front.
    "--z": Math.round(d.y) + 10,
    "--mz": Math.round(m.y) + 10,
  } as React.CSSProperties;
}

/** Which way captions/reactions open so they stay on screen and clear of the intro copy. */
function edge(p: Placement, left: number, right: number) {
  return p.x < left ? "left" : p.x + p.w > right ? "right" : undefined;
}

/** Wall-mounted decor drifts a little as you scroll (subtle parallax). */
const PARALLAX: Partial<Record<RoomDecorId, number>> = { window: 1, photo: 0.6, shelf: 0.8, hanger: 1.2 };

function DecorArt({ id }: { id: RoomDecorId }) {
  if (id === "window")
    return (
      <div className={styles.window}>
        <div className={styles.windowSky}>
          <span className={styles.windowMoon} />
          <span className={styles.windowHill} />
        </div>
        <span className={styles.curtainL} />
        <span className={styles.curtainR} />
      </div>
    );
  if (id === "photo")
    return (
      <figure className={styles.photo}>
        <Image src="/art/briz-hood.jpg" alt="" width={640} height={640} sizes="(max-width: 699px) 14vw, 6vw" />
      </figure>
    );
  if (id === "stairs-1" || id === "stairs-2") return decor.stairs;
  return decor[id];
}

function Levels({ levels, which }: { levels: RoomLevel[]; which: "desktop" | "mobile" }) {
  return (
    <div className={styles.levels} data-layout={which} aria-hidden="true">
      {levels.map((l, i) => (
        <div key={i}>
          <div className={styles.wainscot} style={{ top: `${l.wainscot}%`, height: `${l.floor - l.wainscot}%` }} />
          <div
            className={styles.floor}
            data-last={i === levels.length - 1 || undefined}
            style={{ top: `${l.floor}%`, height: `${l.end - l.floor}%` }}
          />
          {i < levels.length - 1 && <div className={styles.ledge} style={{ top: `${l.end}%` }} />}
        </div>
      ))}
    </div>
  );
}

/**
 * SCENE 3 — The living room.
 * The room scrolls with the page: intro copy first, then a tall canvas that
 * visitors explore at their own pace. Desktop is one wide room; phones get a
 * split-level room in three staggered groups. Every object is placed and sized
 * on its own (content/room.ts), so nothing shrinks to fit the screen.
 */
export default function SceneRoom({ reduced }: Props) {
  const root = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
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

  /** "Explore the room": bring the room to the top of the screen and move focus into it. */
  const exploreRoom = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64;
    const top = scene.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    scene.focus({ preventScroll: true });
    scene.dataset.flash = "true";
    window.setTimeout(() => delete scene.dataset.flash, 1400);
  };

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

      // Subtle parallax: wall-mounted decor drifts against the scroll. Objects stay put,
      // so every hotspot stays exactly on its drawing.
      q("[data-speed]").forEach((el: HTMLElement) => {
        const amount = Number(el.dataset.speed) * 28;
        gsap.fromTo(
          el,
          { y: -amount },
          { y: amount, ease: "none", scrollTrigger: { trigger: sceneRef.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
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
      <div className={styles.veil} data-anim="veil" aria-hidden="true" />

      <header className={styles.head}>
        <p className="kicker">{roomCopy.kicker}</p>
        <h2 id="room-title" className={styles.title}>
          {roomCopy.title}
        </h2>
        <p className={styles.hint}>{roomCopy.hint}</p>
        <div className={styles.headActions}>
          <button type="button" className={styles.directoryButton} data-primary onClick={exploreRoom}>
            {roomCopy.exploreLabel} <span aria-hidden="true">↓</span>
          </button>
          <button type="button" className={styles.directoryButton} onClick={() => setDirectoryOpen(true)}>
            {roomCopy.listLabel}
          </button>
        </div>
      </header>

      <div ref={sceneRef} id="room-scene" className={styles.scene} role="group" aria-label={roomCopy.sceneLabel} tabIndex={-1}>
        <div className={styles.canvas}>
          <Levels levels={roomLevels.desktop} which="desktop" />
          <Levels levels={roomLevels.mobile} which="mobile" />

          {roomDecor.map((d) => (
            <div
              key={d.id}
              className={styles.decor}
              data-id={d.id}
              data-hide-desktop={!d.desktop || undefined}
              data-hide-mobile={!d.mobile || undefined}
              data-speed={PARALLAX[d.id]}
              style={placeVars(d.desktop, d.mobile)}
              aria-hidden="true"
            >
              <DecorArt id={d.id} />
            </div>
          ))}

          {roomObjects.map((obj) => {
            const Art = roomArt[obj.id];
            const isDest = obj.action.type === "link" || obj.action.type === "dialog";
            const extra = {
              "data-id": obj.id,
              "data-dest": isDest || undefined,
              // Near the top of the room, captions and reactions open downward, away from the intro copy.
              "data-top": obj.desktop.y < 30 || undefined,
              "data-top-m": obj.mobile.y < 10 || undefined,
              "data-edge": edge(obj.desktop, 12, 88),
              "data-edge-m": edge(obj.mobile, 20, 80),
              "data-swing": obj.id === "clock" && swinging ? "true" : undefined,
              "data-found": obj.id === "clock" && state.found.key ? "true" : undefined,
            };
            const inner = (
              <>
                <Art />
                <span className={styles.spark} aria-hidden="true" />
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
            const style = placeVars(obj.desktop, obj.mobile);
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

          <div className={styles.lampLight} aria-hidden="true" />
        </div>
      </div>

      {/* Screen-reader announcement for object reactions */}
      <p className="sr-only" aria-live="polite">
        {bubble?.text ?? ""}
      </p>

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
