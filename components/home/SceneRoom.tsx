"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { roomCopy, rugCopy } from "@/content/home";
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
import { Hatch, Rug, decor, roomArt } from "@/components/room/RoomArt";
import Skeleton from "@/components/art/Skeleton";
import Dialog from "@/components/ui/Dialog";
import PhoneDialog from "@/components/room/PhoneDialog";
import TvDialog from "@/components/room/TvDialog";
import SageNetDialog from "@/components/room/SageNetDialog";
import styles from "./SceneRoom.module.css";

type Props = { reduced: boolean; onDescend: () => void };

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
 * SCENES 3 + 4 — The living room, and (on desktop) something under the rug.
 * Desktop: one wide room with the rug and hatch on its floor. Once the whole
 * room is on screen it holds in place; scrolling on makes the floor glow, the
 * rug slide aside, the hatch open and the hole swallow the screen.
 * Phones: a tall split-level room that scrolls freely; the rug beat follows in
 * its own close-up (SceneRug). Every object is placed and sized on its own
 * (content/room.ts), so nothing shrinks to fit the screen.
 */
export default function SceneRoom({ reduced, onDescend }: Props) {
  const root = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
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

  // Desktop: the copy overlays the room's empty wall; share its height so the
  // room can make room for it (e.g. with larger text settings).
  useEffect(() => {
    const head = headRef.current;
    const section = root.current;
    if (!head || !section || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => section.style.setProperty("--head-h", `${head.offsetHeight}px`));
    ro.observe(head);
    return () => ro.disconnect();
  }, []);

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

      // Desktop: the rug beat plays in the room itself.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 700px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            // Hold once the whole room is on screen (the stage is at least one screen tall).
            start: "bottom bottom",
            end: "+=170%",
            pin: q("[data-anim='stage']")[0],
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to({}, { duration: 0.1 }, 0)
          .fromTo(q("[data-anim='rug-glow']"), { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.08)
          .fromTo(q("[data-anim='down-hint']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.12)
          .to(q("[data-anim='down-hint']"), { autoAlpha: 0, duration: 0.05 }, 0.26)
          // The corner links step aside, then the rug slides that way, clear of Baboo Baboo.
          .to(q("[data-anim='floor-links']"), { autoAlpha: 0, duration: 0.05 }, 0.22)
          .to(q("[data-anim='rug']"), { xPercent: -46, yPercent: 6, rotate: 8, duration: 0.18, ease: "power2.inOut" }, 0.28)
          .fromTo(q("[data-part='lid']"), { scaleY: 1 }, { scaleY: -0.3, duration: 0.08, ease: "power2.out" }, 0.46)
          .fromTo(q("[data-anim='skeleton']"), { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.1, ease: "back.out(1.6)" }, 0.48)
          .fromTo(q("[data-anim='skeleton'] [data-part='arm']"), { rotate: -14 }, { rotate: 6, duration: 0.05, yoyo: true, repeat: 3, svgOrigin: "118 186" }, 0.58)
          // The intro gives its spot to the rug line.
          .to(q("[data-anim='intro'], [data-anim='head-actions']"), { autoAlpha: 0, duration: 0.06 }, 0.5)
          .fromTo(q("[data-anim='rug-line']"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.56)
          .to(q("[data-anim='rug-line']"), { autoAlpha: 0, duration: 0.05 }, 0.8)
          // Down we go.
          .fromTo(q("[data-anim='hole']"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.04 }, 0.82)
          .to(q("[data-anim='hole']"), { scale: 34, duration: 0.14, ease: "power2.in" }, 0.86);
      });

      return () => mm.revert();
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

      <div className={styles.stage} data-anim="stage">
        <header ref={headRef} className={styles.head}>
          <div data-anim="intro">
            <p className="kicker">{roomCopy.kicker}</p>
            <h2 id="room-title" className={styles.title}>
              {roomCopy.title}
            </h2>
            <p className={styles.hint}>{roomCopy.hint}</p>
          </div>
          {/* Desktop: replaces the intro, in the same spot, as the rug is pulled aside. */}
          <div className={styles.rugLine} data-anim="rug-line" aria-hidden="true">
            <p>{rugCopy.line}</p>
            <p className={styles.hatchCaption}>{rugCopy.hatchCaption}</p>
          </div>
          <div className={styles.headActions} data-anim="head-actions">
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

            {/* Desktop: the rug and the hatch beneath it, on the floor in front of the sofa. */}
            <div className={styles.floorDeco} aria-hidden="true">
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

            {/* Desktop: a nudge toward the rug, and the simplified mode's way down. */}
            <div className={styles.floorCue} data-cta>
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

            <div className={styles.lampLight} aria-hidden="true" />
          </div>

          {/* Desktop: the invitation is a quiet text link on the empty floor, bottom-left
              (the header buttons are used on smaller screens instead). */}
          <div className={styles.floorLinks} data-cta data-anim="floor-links">
            <button type="button" className={styles.exploreLink} onClick={exploreRoom}>
              {roomCopy.exploreLabel}
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className={styles.listLink} onClick={() => setDirectoryOpen(true)}>
              {roomCopy.listLinkLabel}
            </button>
          </div>
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
