"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems, site } from "@/content/site";
import { setReducedMotion, setSoundOn, useReducedMotion, useSoundOn } from "@/lib/settings";
import { startAmbient, stopAmbient } from "@/lib/audio";
import styles from "./SiteNav.module.css";

function HouseMark() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" className={styles.mark}>
      <circle cx="26" cy="13" r="9" fill="var(--moon)" stroke="var(--line)" strokeWidth="2" />
      <path
        d="M6 35 C5 24 8 15 17 12 C26 10 33 18 34 26 C35 31 34 34 34 35 Z"
        fill="var(--teal-500)"
        stroke="var(--line)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M17 35 V27 C17 23.5 23 23.5 23 27 V35" fill="var(--ochre-300)" stroke="var(--line)" strokeWidth="2" />
      <path d="M7 30 C10 28 12 31 15 29" fill="none" stroke="var(--moss-500)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function Toggles() {
  const sound = useSoundOn();
  const reduced = useReducedMotion();

  const toggleSound = () => {
    const next = !sound;
    setSoundOn(next);
    if (next) startAmbient();
    else stopAmbient();
  };

  return (
    <div className={styles.toggles}>
      <button
        type="button"
        className={styles.toggle}
        aria-pressed={sound}
        onClick={toggleSound}
        title={sound ? "Mute the room tone" : "Play quiet room tone (ambient hum, not music)"}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          {sound ? (
            <path d="M16 8.5c1.6 1.8 1.6 5.2 0 7M18.5 6c3 3.2 3 8.8 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
        <span>{sound ? "Sound on" : "Sound off"}</span>
      </button>
      <button
        type="button"
        className={styles.toggle}
        aria-pressed={reduced}
        onClick={() => setReducedMotion(!reduced)}
        title="Simplified experience: calmer scenes, no camera movement"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M3 12h4M10 12h4M17 12h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          {!reduced && <path d="M5 7c4-3 10-3 14 0M5 17c4 3 10 3 14 0" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />}
        </svg>
        <span>Simplified</span>
      </button>
    </div>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile panel whenever the route changes.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={styles.bar}>
      <Link href="/" className={styles.brand} aria-label={`${site.name}: home`}>
        <HouseMark />
        <span className={styles.wordmark}>{site.name}</span>
      </Link>

      <nav aria-label="Main" className={styles.desktopNav}>
        <ul className={styles.links}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.link} aria-current={isCurrent(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Toggles />
      </nav>

      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="rooms-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.menuIcon} aria-hidden="true" data-open={open} />
        Rooms
      </button>

      <div id="rooms-panel" ref={panelRef} className={styles.panel} hidden={!open}>
        <nav aria-label="Main (mobile)">
          <ul className={styles.panelLinks}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.panelLink} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  <span className={styles.panelLabel}>{item.label}</span>
                  <span className={styles.panelRoom}>{item.room}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Toggles />
      </div>
    </header>
  );
}
