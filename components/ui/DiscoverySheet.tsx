"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { discovery, useDiscovery } from "@/lib/discovery";
import { isReducedMotion } from "@/lib/settings";
import styles from "./DiscoverySheet.module.css";

/**
 * The bottom sheet for discovery responses on phones and tablets.
 * Rendered in a portal (outside every transformed / parallax / clipped scene),
 * above the scenery, below native dialogs. It doesn’t take focus, so the object
 * that opened it stays focused and can be activated again; Escape or the close
 * button dismisses it.
 */
export default function DiscoverySheet() {
  const d = useDiscovery();
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  // A new page means a new room: close.
  useEffect(() => discovery.hide(), [pathname]);

  // Esc closes; the opening object is marked so it stays identifiable.
  useEffect(() => {
    if (!d) return;
    const anchor = d.anchor ?? null;
    anchor?.setAttribute("data-discovering", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) discovery.hide();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      anchor?.removeAttribute("data-discovering");
      document.removeEventListener("keydown", onKey);
    };
  }, [d]);

  // Keep the selected object visible: above the sheet and below the header.
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const root = document.documentElement;
    if (!d || !sheet) {
      root.style.removeProperty("--sheet-h");
      return;
    }
    const h = sheet.getBoundingClientRect().height;
    root.style.setProperty("--sheet-h", `${Math.ceil(h)}px`);
    const a = d.anchor?.getBoundingClientRect();
    if (a) {
      const navH = parseFloat(getComputedStyle(root).getPropertyValue("--nav-h")) || 64;
      const top = navH + 12;
      const bottom = window.innerHeight - h - 12;
      let delta = 0;
      if (a.bottom > bottom) delta = Math.min(a.bottom - bottom, a.top - top);
      else if (a.top < top) delta = a.top - top;
      if (Math.abs(delta) > 2) window.scrollBy({ top: delta, behavior: isReducedMotion() ? "auto" : "smooth" });
    }
  }, [d]);

  if (!mounted) return null;

  const close = () => {
    const anchor = d?.anchor;
    const hadFocus = sheetRef.current?.contains(document.activeElement);
    discovery.hide();
    if (hadFocus && anchor?.isConnected) anchor.focus({ preventScroll: true });
  };

  return createPortal(
    <div className={styles.region} aria-live="polite">
      {d && (
        <div ref={sheetRef} className={styles.sheet} role="dialog" aria-modal="false" aria-labelledby={titleId} data-sheet key={d.key + d.lines.join("|")}>
          <div className={styles.head}>
            <p id={titleId} className={styles.title}>
              {d.title}
            </p>
            <button type="button" className={styles.close} onClick={close} aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className={styles.body}>
            {d.stamp && <span className={`stamp ${styles.stamp}`}>{d.stamp}</span>}
            {d.lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
