"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { sanctumCopy } from "@/content/hunt";
import { FINAL_STEP, useHunt, useHuntReady } from "@/lib/hunt";
import styles from "./Sanctum.module.css";

/** Set once the sanctuary has opened on this visit, so a reset inside it doesn’t yank the room away. */
const visit = { inside: false };
const markInside = () => {
  visit.inside = true;
};

// The sanctuary’s code and artwork load only for pilgrims who found the door.
const Sanctum = dynamic(() => import("./Sanctum"), { ssr: false, loading: () => <div className={styles.loading} aria-busy="true" /> });

/**
 * The door. Pilgrims who found their way here (saved in this browser) go in;
 * everyone else finds a door with no handle. An Easter egg, not a lock.
 */
export default function SanctumGate() {
  const ready = useHuntReady();
  const h = useHunt();
  if (!ready) return <div className={styles.loading} aria-busy="true" />;
  // Stay inside after a reset on this visit, so the confirmation can be read.
  if (h.stage >= FINAL_STEP || visit.inside) return <Sanctum onEnter={markInside} />;
  return (
    <main className={styles.sealed}>
      <div className={styles.sealedDoor} aria-hidden="true" />
      <h1 className={styles.sealedTitle}>{sanctumCopy.sealed.title}</h1>
      <p className={styles.lede}>{sanctumCopy.sealed.line}</p>
      <Link href="/" className="btn btn-teal">
        {sanctumCopy.sealed.back}
      </Link>
    </main>
  );
}
