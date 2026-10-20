"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { fragments } from "@/content/lore";
import { sagenetCopy } from "@/content/sagenet";
import { isReducedMotion } from "@/lib/settings";
import styles from "./RoomDialogs.module.css";

type Page = "home" | "lore" | "guestbook" | "webring" | "hint";

const PAGES: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "lore", label: "Lore" },
  { id: "guestbook", label: "Guestbook" },
  { id: "webring", label: "Webring" },
  { id: "hint", label: "hint.txt" },
];

/** SageNet: a fictional dial-up portal holding fragments of house lore. */
export default function SageNetDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [booted, setBooted] = useState(0);
  const [page, setPage] = useState<Page>("home");
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
      setPage("home");
    };
  }, [open, total]);

  const ready = booted >= total;

  return (
    <Dialog open={open} onClose={onClose} title="SageNet 56k" variant="screen" className={styles.sagenet}>
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
            </ul>
          </nav>
          <div className={styles.portalBody} aria-live="polite">
            {page === "home" && (
              <>
                <p className={styles.marquee}>
                  <span>★ {sagenetCopy.welcome} ★ best viewed at 3am ★ </span>
                </p>
                <p>
                  {sagenetCopy.visitorLine} <span className={styles.counter}>{sagenetCopy.visitorNumber}</span>
                </p>
                <p className={styles.construction}>{sagenetCopy.under}</p>
                <p>Pick a page above. Everything here is house fiction.</p>
              </>
            )}
            {page === "lore" && (
              <ul className={styles.fragList}>
                {fragments.map((f) => (
                  <li key={f.id}>
                    <p className={styles.fragTitle}>
                      &gt; {f.title}
                      {f.sample ? " [SAMPLE]" : f.fiction ? " [FICTION]" : " [TRUE]"}
                    </p>
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
                  <p>(Signing is disabled. The pen is a bone.)</p>
                </li>
              </ul>
            )}
            {page === "webring" && (
              <ul className={styles.fragList}>
                <li>
                  <Link href="/music">&lt;&lt; The Listening Room</Link>
                </li>
                <li>
                  <Link href="/merch">The Curiosity Shop</Link>
                </li>
                <li>
                  <Link href="/briz-lore">The Archives &gt;&gt;</Link>
                </li>
              </ul>
            )}
            {page === "hint" && (
              <pre className={styles.hintFile}>
                {`HINT.TXT\n--------\n${sagenetCopy.hintFile}`}
              </pre>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
