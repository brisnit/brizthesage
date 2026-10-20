"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./Dialog.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it stays the accessible name). */
  hideTitle?: boolean;
  /** Visual skin. */
  variant?: "paper" | "dark" | "screen";
  /** Extra class for the inner panel. */
  className?: string;
  children: React.ReactNode;
};

/**
 * Accessible modal built on the native <dialog> element:
 * focus is trapped and restored by the browser, Esc closes it,
 * and clicking the dimmed backdrop closes it too.
 */
export default function Dialog({ open, onClose, title, hideTitle, variant = "paper", className, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // The native "close" event can arrive after the parent already moved on
  // (e.g. opened a different dialog); only report it while we're meant to be open.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.classList.add("dialog-open");
    } else if (!open && el.open) {
      el.close();
    }
    return () => document.documentElement.classList.remove("dialog-open");
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      data-variant={variant}
      aria-labelledby={titleId}
      onClose={() => {
        if (openRef.current) onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className={`${styles.panel} ${className ?? ""}`}>
          <div className={styles.head}>
            <h2 id={titleId} className={hideTitle ? "sr-only" : styles.title}>
              {title}
            </h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
