"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { askCopy, houseTales } from "@/content/hunt";
import { isReducedMotion } from "@/lib/settings";
import type { SageState } from "./ThroneScene";
import styles from "./Sanctum.module.css";

type Msg = { role: "user" | "assistant"; text: string; interrupted?: boolean };
type Mode = "checking" | "live" | "demo";
type Status = "idle" | "thinking" | "answering" | "error";

const ERROR_MARK = "\u0000";

/**
 * Ask the Sage: an imaginative AI version of Briz the Sage.
 * Streams answers from /api/sage when a provider is configured; otherwise offers
 * authored “House tales”. Reports its real lifecycle to the throne animation.
 */
export default function AskSage({ onState }: { onState: (s: SageState) => void }) {
  const [mode, setMode] = useState<Mode>("checking");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [voice, setVoice] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const lastQuestion = useRef<string | null>(null);

  // Is a live provider configured? (No key = honest demo mode.)
  useEffect(() => {
    let alive = true;
    fetch("/api/sage", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { live: false }))
      .then((d: { live?: boolean }) => alive && setMode(d.live ? "live" : "demo"))
      .catch(() => alive && setMode("demo"));
    return () => {
      alive = false;
    };
  }, []);

  // Drive the throne: thinking → answering (text arriving or being read aloud) → idle.
  useEffect(() => {
    onState(status === "thinking" ? "thinking" : status === "answering" || speaking ? "answering" : "idle");
  }, [status, speaking, onState]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, status]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  // Stop everything if the visitor leaves.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      clearTimers();
      stopSpeech();
    },
    [stopSpeech],
  );

  const speak = useCallback(
    (text: string) => {
      if (!voice || !("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.pitch = 0.9;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    },
    [voice],
  );

  /** Show `text` arriving bit by bit (demo mode), so the answering animation matches delivery. */
  const deliver = (text: string) => {
    setStatus("answering");
    const step = isReducedMotion() ? text.length : 3;
    let i = 0;
    const tick = () => {
      i = Math.min(text.length, i + step);
      setMsgs((m) => [...m.slice(0, -1), { role: "assistant", text: text.slice(0, i) }]);
      if (i < text.length) timers.current.push(window.setTimeout(tick, 22));
      else {
        setStatus("idle");
        speak(text);
      }
    };
    setMsgs((m) => [...m, { role: "assistant", text: "" }]);
    tick();
  };

  const ask = async (question: string, history: Msg[]) => {
    const q = question.trim().slice(0, askCopy.maxLength);
    if (!q || status === "thinking" || status === "answering") return;
    stopSpeech();
    setError(null);
    lastQuestion.current = q;
    const next: Msg[] = [...history, { role: "user", text: q }];
    setMsgs(next);
    setInput("");
    setStatus("thinking");

    if (mode !== "live") {
      const tale = houseTales[q];
      timers.current.push(window.setTimeout(() => deliver(tale ?? ""), isReducedMotion() ? 0 : 900));
      return;
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let answer = "";
    try {
      const res = await fetch("/api/sage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-8).map((m) => ({ role: m.role, content: m.text })) }),
        signal: ctrl.signal,
      });
      if (res.status === 503) {
        setMode("demo");
        setMsgs(history);
        setStatus("idle");
        return;
      }
      if (!res.ok || !res.body) {
        const d = (await res.json().catch(() => ({}))) as { retryAfter?: number };
        throw new Error(
          res.status === 429
            ? `The Sage needs a breather. Try again in ${d.retryAfter && d.retryAfter < 120 ? `${d.retryAfter} seconds` : "a little while"}.`
            : "The Sage lost his train of thought.",
        );
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setMsgs((m) => [...m, { role: "assistant", text: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const markAt = chunk.indexOf(ERROR_MARK);
        answer += markAt >= 0 ? chunk.slice(0, markAt) : chunk;
        if (answer) setStatus("answering");
        setMsgs((m) => [...m.slice(0, -1), { role: "assistant", text: answer }]);
        if (markAt >= 0) {
          const kind = chunk.slice(markAt + 1);
          throw new Error(kind.startsWith("busy") ? "The house is very busy. Try again in a moment." : "The Sage lost his train of thought.");
        }
      }
      if (!answer.trim()) throw new Error("The Sage stayed silent. Try asking again.");
      setStatus("idle");
      speak(answer);
    } catch (e) {
      if (ctrl.signal.aborted) return; // handled by stop()
      // Drop a half-finished answer so retry starts clean.
      setMsgs((m) => (m[m.length - 1]?.role === "assistant" && !m[m.length - 1].interrupted ? m.slice(0, -1) : m));
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    } finally {
      if (abortRef.current === ctrl) abortRef.current = null;
    }
  };

  /** Interrupt: stop the request, the delivery and the voice; keep what arrived. */
  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    clearTimers();
    stopSpeech();
    setMsgs((m) => {
      const last = m[m.length - 1];
      if (last?.role === "assistant") return [...m.slice(0, -1), { ...last, interrupted: true }];
      return m.slice(0, -1); // stopped while thinking: withdraw the question
    });
    setStatus("idle");
  };

  const retry = () => {
    const q = lastQuestion.current;
    if (!q) return;
    const history = msgs[msgs.length - 1]?.role === "user" ? msgs.slice(0, -1) : msgs;
    void ask(q, history);
  };

  const reset = () => {
    abortRef.current?.abort();
    clearTimers();
    stopSpeech();
    setMsgs([]);
    setError(null);
    setStatus("idle");
    lastQuestion.current = null;
  };

  const busy = status === "thinking" || status === "answering";
  const suggestions = mode === "demo" ? Object.keys(houseTales) : askCopy.suggestions;

  return (
    <section className={styles.ask} aria-labelledby="ask-title">
      <div className={styles.askHead}>
        <h2 id="ask-title" className={styles.sectionTitle}>
          {mode === "demo" ? askCopy.demoTitle : askCopy.title}
        </h2>
        <p className={styles.askLabel}>{askCopy.label}</p>
      </div>

      <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-busy={busy}>
        {askCopy.greeting.map((g) => (
          <p key={g} className={styles.sageLine}>
            {g}
          </p>
        ))}
        {mode === "demo" && <p className={styles.demoNote}>{askCopy.demoNote}</p>}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className={styles.userLine}>
              <span className="sr-only">You asked: </span>
              {m.text}
            </p>
          ) : (
            <div key={i} className={styles.sageLine}>
              <span className="sr-only">The Sage: </span>
              {m.text.split(/\n{2,}/).map((para, j) => (
                <p key={j}>{para}</p>
              ))}
              {m.interrupted && <p className={styles.interrupted}>(interrupted)</p>}
            </div>
          ),
        )}
        {status === "thinking" && (
          <p className={styles.thinking} aria-hidden="true">
            <span />
            <span />
            <span />
          </p>
        )}
      </div>

      {status === "error" && (
        <div className={styles.askError} role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-gold" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      <div className={styles.suggestions} role="group" aria-label="Questions to ask">
        {suggestions.map((s) => (
          <button key={s} type="button" className={styles.suggestion} disabled={busy || mode === "checking"} onClick={() => void ask(s, msgs)}>
            {s}
          </button>
        ))}
      </div>

      {mode === "live" && (
        <form
          className={styles.askForm}
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input, msgs);
          }}
        >
          <label htmlFor="ask-input" className="sr-only">
            Your question for the Sage
          </label>
          <textarea
            id="ask-input"
            className={styles.askInput}
            rows={2}
            maxLength={askCopy.maxLength}
            value={input}
            placeholder="Ask the Sage anything…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(input, msgs);
              }
            }}
          />
          <span className={styles.counter} aria-hidden="true">
            {input.length}/{askCopy.maxLength}
          </span>
          <button type="submit" className="btn btn-gold" disabled={busy || !input.trim()}>
            Ask
          </button>
        </form>
      )}

      <div className={styles.askTools}>
        {(busy || speaking) && (
          <button type="button" className="btn btn-ghost" onClick={stop}>
            Stop
          </button>
        )}
        <button type="button" className={styles.toolLink} onClick={reset} disabled={msgs.length === 0 && !busy}>
          Start a new conversation
        </button>
        <label className={styles.voiceToggle}>
          <input
            type="checkbox"
            checked={voice}
            onChange={(e) => {
              setVoice(e.target.checked);
              if (!e.target.checked) stopSpeech();
            }}
          />
          Read answers aloud (a generic synthetic voice)
        </label>
      </div>
      <p className={styles.disclaimer}>{askCopy.disclaimer}</p>
    </section>
  );
}
