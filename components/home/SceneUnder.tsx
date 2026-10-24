"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sanctuaryCopy, scraps, undergroundCopy, undergroundFinds, type UndergroundFind } from "@/content/home";
import { Artifact, BuriedRecords, Ceiling, Lantern, Mushrooms, Roots, Sanctuary, Stones, Strata, Teacup, Tunnel } from "@/components/art/Underground";
import Skeleton from "@/components/art/Skeleton";
import RelicSpot from "@/components/game/RelicSpot";
import { gsap, useGSAP } from "@/lib/gsap";
import { discovery, useDiscovery, useSheetMode } from "@/lib/discovery";
import styles from "./SceneUnder.module.css";

type Props = { reduced: boolean; onSurface: () => void };

type Spot = { x: number; y: number; w: number; mx: number; my: number; mw: number };
const vars = (s: Spot) =>
  ({ "--x": s.x, "--y": s.y, "--w": s.w, "--mx": s.mx, "--my": s.my, "--mw": s.mw }) as React.CSSProperties;

/** Where each discovery sits inside its stratum (percentages; desktop then phone). */
const findSpots: Record<string, Spot> = {
  "door-1": { x: 30, y: 20, w: 7, mx: 8, my: 30, mw: 18 },
  teacup: { x: 12, y: 60, w: 7, mx: 62, my: 64, mw: 18 },
  "creature-1": { x: 8, y: 16, w: 15, mx: 4, my: 12, mw: 34 },
  lantern: { x: 47, y: 34, w: 6, mx: 70, my: 36, mw: 15 },
  "door-2": { x: 26, y: 66, w: 7, mx: 18, my: 70, mw: 18 },
  "creature-2": { x: 72, y: 52, w: 14, mx: 58, my: 52, mw: 32 },
  mushrooms: { x: 79, y: 72, w: 15, mx: 58, my: 76, mw: 36 },
};

function FindArt({ find }: { find: UndergroundFind }) {
  if (find.kind === "door")
    return (
      <span className={styles.door} aria-hidden="true">
        <span className={styles.doorLight} />
        <span className={styles.doorPanel}>
          <span className={styles.knob} />
        </span>
      </span>
    );
  if (find.kind === "creature") return <Tunnel hue={find.id === "creature-1" ? "#2a1734" : "#24706f"} />;
  if (find.id === "teacup") return <Teacup />;
  if (find.id === "mushrooms") return <Mushrooms />;
  return <Lantern />;
}

/**
 * One discovery. On phones and tablets its response opens in the shared bottom
 * sheet (rendered outside this parallax scene); on desktop it opens as a bubble
 * beside it, aligned away from the screen edge.
 */
function Find({ find, open, sheet, onToggle }: { find: UndergroundFind; open: boolean; sheet: boolean; onToggle: (el: HTMLElement) => void }) {
  const spot = findSpots[find.id];
  const id = `find-${find.id}`;
  const edge = spot.x < 20 ? "left" : spot.x + spot.w > 80 ? "right" : undefined;
  const tidbitRef = useRef<HTMLDivElement>(null);
  // Desktop bubble: if it opens below the fold (or under the header), bring it into view.
  useEffect(() => {
    if (open && !sheet) tidbitRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open, sheet]);
  return (
    <div className={styles.find} style={vars(spot)} data-kind={find.kind} data-id={find.id} data-open={open} data-edge={edge}>
      <button type="button" className={styles.findButton} aria-expanded={open} aria-controls={sheet ? undefined : id} onClick={(e) => onToggle(e.currentTarget)}>
        <FindArt find={find} />
        <span className="sr-only">{find.label}</span>
      </button>
      {!sheet && (
        <div id={id} ref={tidbitRef} className={styles.tidbit} hidden={!open}>
          {find.sample && <span className={`stamp ${styles.sample}`}>sample</span>}
          <p>{find.tidbit}</p>
        </div>
      )}
    </div>
  );
}

/**
 * SCENE 5 — Under the house.
 * A layered cutaway: far soil moves slowly, roots and scraps drift faster,
 * small discoveries open on tap. It ends at a glowing listening chamber.
 */
export default function SceneUnder({ reduced, onSurface }: Props) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const sheet = useSheetMode();
  const shown = useDiscovery();
  const finds = (ids: string[]) => undergroundFinds.filter((f) => ids.includes(f.id));

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);
      // Phones: readable things (scraps, the record) stay put and decoration drifts only a
      // little, so nothing slides into text or controls partway through the scroll.
      const phone = window.matchMedia("(max-width: 699px)").matches;
      q("[data-speed]").forEach((el: HTMLElement) => {
        if (phone && el.closest("[data-flow]")) return;
        const speed = Number(el.dataset.speed) * (phone ? 0.3 : 1);
        gsap.fromTo(
          el,
          { y: () => -speed * window.innerHeight * 0.25 },
          {
            y: () => speed * window.innerHeight * 0.25,
            ease: "none",
            scrollTrigger: { trigger: el.closest("[data-block]"), start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      });
      q("[data-reveal]").forEach((el: HTMLElement) => {
        gsap.from(el, {
          opacity: 0,
          y: 34,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
      // Sanctuary skeleton waves hello.
      gsap.to(q("[data-anim='wave'] [data-part='arm']"), {
        rotate: -18,
        svgOrigin: "118 186",
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const toggle = (f: UndergroundFind, el: HTMLElement) => {
    if (sheet) {
      setOpen(null);
      discovery.toggle({ key: `under:${f.id}`, title: f.label, lines: [f.tidbit], stamp: f.sample ? "sample" : undefined, anchor: el });
    } else {
      discovery.hide();
      setOpen((v) => (v === f.id ? null : f.id));
    }
  };
  const isOpen = (id: string) => (sheet ? shown?.key === `under:${id}` : open === id);
  const findList = (ids: string[]) =>
    finds(ids).map((f) => <Find key={f.id} find={f} sheet={sheet} open={isOpen(f.id)} onToggle={(el) => toggle(f, el)} />);

  return (
    <section ref={root} id="under-the-house" className={styles.under} aria-labelledby="under-title" data-scene="under" tabIndex={-1}>
      <div className={styles.strata} aria-hidden="true">
        <Strata />
      </div>

      {/* Stratum 1: arrival */}
      <div className={styles.block} data-block="entry">
        <div className={styles.beam} aria-hidden="true" />
        <div className={styles.ceiling} aria-hidden="true">
          <Ceiling />
        </div>
        <div className={`${styles.artifact} ${styles.artBone}`} data-speed="0.3" aria-hidden="true">
          <Artifact kind="bone" />
        </div>
        <div className={`${styles.artifact} ${styles.artGear}`} data-speed="-0.3" aria-hidden="true">
          <Artifact kind="gear" />
        </div>
        <div className={`${styles.shroomsEntry}`} aria-hidden="true">
          <Mushrooms />
        </div>
        <div className={styles.rootsL} data-speed="-0.5" aria-hidden="true">
          <Roots />
        </div>
        <div className={styles.rootsR} data-speed="0.25" aria-hidden="true">
          <Roots variant={1} />
        </div>
        <div className={styles.stonesFar} data-speed="0.4" aria-hidden="true">
          <Stones />
        </div>
        <div className={styles.entryText} data-flow>
          <p className={styles.depth} data-reveal>
            {undergroundCopy.depthMarkers[0]}
          </p>
          <h2 id="under-title" className={styles.underTitle} data-reveal>
            Under the house
          </h2>
          <p className={styles.intro} data-reveal>
            {undergroundCopy.intro}
          </p>
        </div>
        <div className={styles.scraps} data-flow>
          <p className={`${styles.scrap} ${styles.scrapA}`} data-speed="-0.7" aria-hidden="true">
            {scraps[0]}
          </p>
          <p className={`${styles.scrap} ${styles.scrapE}`} data-speed="-0.5" aria-hidden="true">
            {scraps[4]}
          </p>
        </div>
      </div>

      {/* Stratum 2: buried records */}
      <div className={styles.block} data-block="dig">
        <p className={`${styles.depth} ${styles.depthSide}`} data-reveal data-flow>
          {undergroundCopy.depthMarkers[1]}
        </p>
        <div className={styles.rootsTop} data-speed="0.2" aria-hidden="true">
          <Roots variant={1} />
        </div>
        <div className={styles.records} data-speed="-0.15" data-flow>
          <BuriedRecords />
          <div className={styles.relicRecord}>
            <RelicSpot relic="record" label="One record in the dirt is still spinning" size={64} className={styles.spinning} />
          </div>
        </div>
        <div className={styles.findsRow} data-flow>
          {findList(["door-1", "teacup", "mushrooms"])}
        </div>
        <div className={styles.scraps} data-flow>
          <p className={`${styles.scrap} ${styles.scrapB}`} data-speed="-0.6" aria-hidden="true">
            {scraps[1]}
          </p>
        </div>
        <div className={`${styles.artifact} ${styles.artMic}`} data-speed="-0.35" aria-hidden="true">
          <Artifact kind="mic" />
        </div>
        <div className={`${styles.artifact} ${styles.artFish}`} data-speed="0.25" aria-hidden="true">
          <Artifact kind="fish" />
        </div>
        <div className={`${styles.artifact} ${styles.artCassette}`} data-speed="-0.2" aria-hidden="true">
          <Artifact kind="cassette" />
        </div>
        <div className={styles.stonesMid} data-speed="0.3" aria-hidden="true">
          <Stones />
        </div>
      </div>

      {/* Stratum 3: tunnels */}
      <div className={styles.block} data-block="tunnels">
        <p className={`${styles.depth} ${styles.depthRight}`} data-reveal data-flow>
          {undergroundCopy.depthMarkers[2]}
        </p>
        <div className={styles.findsRow} data-flow>
          {findList(["creature-1", "lantern", "door-2", "creature-2"])}
        </div>
        <div className={styles.scraps} data-flow>
          <p className={`${styles.scrap} ${styles.scrapC}`} data-speed="-0.6" aria-hidden="true">
            {scraps[2]}
          </p>
          <p className={`${styles.scrap} ${styles.scrapD}`} data-speed="-0.4" aria-hidden="true">
            {scraps[3]}
          </p>
          <p className={`${styles.scrap} ${styles.scrapF}`} data-speed="-0.55" aria-hidden="true">
            {scraps[5]}
          </p>
        </div>
        <div className={styles.shroomsL} aria-hidden="true">
          <Mushrooms tone="gold" />
        </div>
        <div className={styles.shroomsMid} aria-hidden="true">
          <Mushrooms />
        </div>
        <div className={`${styles.artifact} ${styles.artHeadphones}`} data-speed="-0.3" aria-hidden="true">
          <Artifact kind="headphones" />
        </div>
        <div className={`${styles.artifact} ${styles.artBottle}`} data-speed="0.2" aria-hidden="true">
          <Artifact kind="bottle" />
        </div>
        <div className={`${styles.artifact} ${styles.artWatch}`} data-speed="-0.25" aria-hidden="true">
          <Artifact kind="watch" />
        </div>
        <div className={styles.stonesLow} data-speed="0.35" aria-hidden="true">
          <Stones />
        </div>
      </div>

      {/* The hidden listening chamber */}
      <div className={`${styles.block} ${styles.sanctuary}`} data-block="sanctuary">
        <div className={styles.rootsTop} data-speed="0.2" aria-hidden="true">
          <Roots />
        </div>
        <p className={`${styles.depth} ${styles.depthCenter}`} data-reveal>
          {undergroundCopy.depthMarkers[3]}
        </p>
        <div className={styles.chamberArt} aria-hidden="true">
          <Sanctuary />
        </div>
        <div className={styles.chamberSkeleton} data-anim="wave" aria-hidden="true">
          <Skeleton pose="wave" />
        </div>
        <div className={styles.chamberText}>
          <p className="kicker" data-reveal>
            {sanctuaryCopy.kicker}
          </p>
          <h2 className={styles.chamberTitle} data-reveal>
            {sanctuaryCopy.title}
          </h2>
          <p className={styles.chamberLine} data-reveal>
            {sanctuaryCopy.line}
          </p>
          <div className={styles.chamberActions} data-reveal>
            <Link href="/music" className={`btn btn-gold ${styles.bigCta}`}>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path d="M5 3l12 7-12 7z" fill="currentColor" />
              </svg>
              {sanctuaryCopy.music}
            </Link>
            <Link href="/briz-lore" className={`btn btn-teal ${styles.archDoor}`}>
              {sanctuaryCopy.lore}
            </Link>
            <button type="button" className="btn btn-ghost" onClick={onSurface}>
              <span className={styles.balloon} aria-hidden="true" />
              {sanctuaryCopy.up}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
