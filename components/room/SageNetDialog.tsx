"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { fragments } from "@/content/lore";
import { artist } from "@/content/site";
import { sagenetCopy } from "@/content/sagenet";
import { isReducedMotion } from "@/lib/settings";
import styles from "./RoomDialogs.module.css";

type Page = "welcome" | "resident" | "notes" | "guestbook" | "lostFound";

const PAGES: { id: Exclude<Page, "welcome">; label: string }[] = [
  { id: "resident", label: sagenetCopy.menu.resident },
  { id: "notes", label: sagenetCopy.menu.notes },
  { id: "guestbook", label: sagenetCopy.menu.guestbook },
  { id: "lostFound", label: sagenetCopy.menu.lostFound },
];

/** SageNet: a fictional dial-up portal holding fragments of house lore. */
export default function SageNetDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [booted, setBooted] = useState(0);
  const [page, setPage] = useState<Page>("welcome");
  const total = sagenetCopy.connecting.length;

  useEffect(() => {
    if (!open) return;
    if (isReducedMotion()) {
      const t = window.setTimeout(() => setBooted(total), 0);
      return () => window.clearTimeout(t);
    }
    const timers = sagenetCopy.connecting.map((_, i) => window.setTimeout(() => setBooted(i + 1), 450 * (i + 1)));
    return () => {
      timers.forEach((t) => clearTimeout(t));
      setBooted(0);
      setPage("welcome");
    };
  }, [open, total]);

  const ready = booted >= total;

  return (
    <Dialog open={open} onClose={onClose} title="SageNet" variant="screen" className={styles.sagenet}>
      {!ready ? (
        <div className={styles.boot} aria-live="polite">
          {sagenetCopy.connecting.slice(0, booted).map((l) => (
            <p key={l}>&gt; {l}</p>
          ))}
          <p className={styles.cursor} aria-hidden="true">
            _
          </p>
          <button type="button" className={styles.termButton} onClick={() => setBooted(total)}>
            [ skip ]
          </button>
        </div>
      ) : (
        <div className={styles.portal}>
          <nav aria-label="SageNet pages">
            <ul className={styles.portalNav}>
              {PAGES.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={styles.termButton}
                    aria-current={page === p.id ? "page" : undefined}
                    onClick={() => setPage(p.id)}
                  >
                    {page === p.id ? `[${p.label}]` : p.label}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className={styles.termButton} onClick={onClose}>
                  {sagenetCopy.menu.logOff}
                </button>
              </li>
            </ul>
          </nav>
          <div className={styles.portalBody} aria-live="polite">
            {page === "welcome" && (
              <div className={styles.welcome}>
                {sagenetCopy.welcome.map((l, i) => (i === 0 ? <p key={i} className={styles.marquee}>{l}</p> : <p key={i}>{l || "\u00a0"}</p>))}
              </div>
            )}
            {page === "resident" && (
              <>
                <p className={styles.fragTitle}>&gt; RESIDENT.TXT</p>
                <p>{artist.shortBio}</p>
                <p>
                  <Link href="/music">&gt;&gt; The Listening Room</Link>
                </p>
              </>
            )}
            {page === "notes" && (
              <ul className={styles.fragList}>
                {fragments
                  .filter((f) => f.fiction)
                  .map((f) => (
                    <li key={f.id}>
                      <p className={styles.fragTitle}>&gt; {f.title}</p>
                      <p>{f.body}</p>
                    </li>
                  ))}
              </ul>
            )}
            {page === "guestbook" && (
              <ul className={styles.fragList}>
                {sagenetCopy.guestbook.map((g) => (
                  <li key={g.name}>
                    <p className={styles.fragTitle}>{g.name} wrote:</p>
                    <p>{g.text}</p>
                  </li>
                ))}
                <li>
                  <p>{sagenetCopy.guestbookNote}</p>
                </li>
              </ul>
            )}
            {page === "lostFound" && (
              <>
                <pre className={styles.hintFile}>{`LOST&FOUND.TXT\n--------------\n${sagenetCopy.lostFound}`}</pre>
                <p>
                  <Link href="/briz-lore#the-house-remembers">&gt;&gt; {sagenetCopy.lostFoundLink}</Link>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
