"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { HUNT_PATH, huntCopy } from "@/content/hunt";
import { isReducedMotion } from "@/lib/settings";
import styles from "./Hunt.module.css";

/**
 * Crossing into the sanctuary: the hidden door swings open, warm light and smoke
 * pour out, then we step through. A short fade in the simplified experience.
 */
export default function Threshold({ onDone }: { onDone?: () => void }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(HUNT_PATH);
    const t = window.setTimeout(() => {
      router.push(HUNT_PATH);
      onDone?.();
    }, isReducedMotion() ? 450 : 2600);
    return () => window.clearTimeout(t);
  }, [router, onDone]);

  return createPortal(
    <div className={styles.threshold} role="status" aria-live="assertive">
      <div className={styles.thDoor} aria-hidden="true">
        <span className={styles.thLight} />
        <span className={styles.thLeaf} />
      </div>
      <span className={styles.thSmoke} aria-hidden="true" />
      <span className={`${styles.thSmoke} ${styles.thSmoke2}`} aria-hidden="true" />
      <p className={styles.thLine}>{huntCopy.door.threshold}</p>
    </div>,
    document.body,
  );
}
