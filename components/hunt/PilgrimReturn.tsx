"use client";

import Link from "next/link";
import { HUNT_PATH, huntCopy } from "@/content/hunt";
import { FINAL_STEP, useHunt } from "@/lib/hunt";
import { EarMark } from "./Symbols";
import styles from "./Hunt.module.css";

/** A tiny gold ear in the footer, shown only to pilgrims who already found the Sage. */
export default function PilgrimReturn() {
  const h = useHunt();
  if (h.stage < FINAL_STEP) return null;
  return (
    <Link href={HUNT_PATH} className={styles.return} aria-label={huntCopy.returnLabel} title={huntCopy.returnLabel}>
      <EarMark />
    </Link>
  );
}
