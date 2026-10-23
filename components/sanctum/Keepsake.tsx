"use client";

import { useEffect, useId, useRef, useState } from "react";
import { keepsakeCopy } from "@/content/hunt";
import styles from "./Sanctum.module.css";

const W = 1800;
const H = 1200;
const NAME_KEY = "bluehouse:pilgrim-name:v1";

const C = {
  paper: "#f3e7cc",
  paperDeep: "#e2cfa4",
  ink: "#1a1022",
  gold: "#c99a3c",
  goldLight: "#f4cf72",
  goldDeep: "#8a5a1c",
  plum: "#3d2147",
  teal: "#4fb3a9",
  tan: "#d98a3d",
  white: "#fbf3e4",
};

function fonts() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => (cs.getPropertyValue(n).trim() ? `${cs.getPropertyValue(n).trim()}, ${f}` : f);
  return { display: v("--font-fraunces", "Georgia, serif"), body: v("--font-karla", "sans-serif"), hand: v("--font-caveat", "cursive") };
}

/** A tiny ear glyph, used as the Order’s mark. */
function ear(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, -3, 7, Math.PI, 0);
  ctx.bezierCurveTo(7, 4, 2, 4, 2, 10);
  ctx.bezierCurveTo(2, 15, -5, 15, -6, 11);
  ctx.moveTo(-3, -3);
  ctx.arc(0, -3, 3, Math.PI, 0);
  ctx.bezierCurveTo(3, 1, 1, 1, 1, 4);
  ctx.stroke();
  ctx.restore();
}

/** The gold seal: the blue house, with Oliver’s head peeking over the rim. */
function seal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, body: string) {
  ctx.save();
  ctx.translate(x, y);
  // scalloped edge
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const rr = r + (i % 2 ? 10 : 0);
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 10, 0, 0, r + 10);
  g.addColorStop(0, C.goldLight);
  g.addColorStop(0.6, C.gold);
  g.addColorStop(1, C.goldDeep);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = C.ink;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r - 22, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.goldDeep;
  ctx.stroke();
  // text around the rim
  ctx.fillStyle = C.goldDeep;
  ctx.font = `800 20px ${body}`;
  const label = "· OLIVER APPROVED · THE OPEN EAR ";
  for (let i = 0; i < label.length; i++) {
    const a = -Math.PI / 2 + (i / label.length) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(label[i], -5, -(r - 34));
    ctx.restore();
  }
  // the blue house
  ctx.fillStyle = C.teal;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-48, 34);
  ctx.bezierCurveTo(-52, -6, -30, -36, 0, -38);
  ctx.bezierCurveTo(30, -36, 52, -6, 48, 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = C.goldLight;
  ctx.beginPath();
  ctx.moveTo(-10, 34);
  ctx.lineTo(-10, 12);
  ctx.arc(0, 12, 10, Math.PI, 0);
  ctx.lineTo(10, 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Oliver peeking over the right side: tan head, white blaze, big ears
  ctx.save();
  ctx.translate(40, -22);
  ctx.fillStyle = C.tan;
  for (const dx of [-12, 12]) {
    ctx.beginPath();
    ctx.moveTo(dx - 7, -4);
    ctx.lineTo(dx, -26);
    ctx.lineTo(dx + 7, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.ellipse(0, 4, 20, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = C.white;
  ctx.beginPath();
  ctx.ellipse(0, 10, 9, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(-7, 1, 2.4, 0, Math.PI * 2);
  ctx.arc(7, 1, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, 9, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function draw(ctx: CanvasRenderingContext2D, name: string, date: string) {
  const f = fonts();
  // paper
  const bg = ctx.createRadialGradient(W * 0.4, H * 0.35, 100, W / 2, H / 2, W * 0.75);
  bg.addColorStop(0, "#fbf3e0");
  bg.addColorStop(0.6, C.paper);
  bg.addColorStop(1, C.paperDeep);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // worn grain
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(90,50,20,0.07)";
    ctx.fillRect(r() * W, r() * H, 2, 2);
  }
  // gold double frame
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 14;
  ctx.strokeRect(50, 50, W - 100, H - 100);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(42, 42, W - 84, H - 84);
  ctx.strokeRect(80, 80, W - 160, H - 160);
  // corner symbols: ear, moon, record, star
  ear(ctx, 130, 140, 3, C.goldDeep);
  ctx.fillStyle = C.goldLight;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W - 130, 140, 30, 0.35 * Math.PI, 1.65 * Math.PI);
  ctx.arc(W - 118, 140, 24, 1.6 * Math.PI, 0.4 * Math.PI, true);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(130, H - 140, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#de8a72";
  ctx.beginPath();
  ctx.arc(130, H - 140, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = C.plum;
  ctx.font = `800 30px ${f.body}`;
  ctx.fillText("✶  SAGE WORLD  ✶", W / 2, 190);
  ctx.fillStyle = C.ink;
  ctx.font = `700 92px ${f.display}`;
  ctx.fillText(keepsakeCopy.heading, W / 2, 300, W - 300);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 360, 340);
  ctx.lineTo(W / 2 + 360, 340);
  ctx.stroke();

  // body
  const display = name.trim() || keepsakeCopy.defaultName;
  let y = 430;
  for (const line of keepsakeCopy.body) {
    if (line === "{name}") {
      let size = 130;
      ctx.font = `700 ${size}px ${f.hand}`;
      while (ctx.measureText(display).width > W - 420 && size > 60) {
        size -= 6;
        ctx.font = `700 ${size}px ${f.hand}`;
      }
      ctx.fillStyle = C.plum;
      ctx.fillText(display, W / 2, y + 70);
      ctx.strokeStyle = "rgba(26,16,34,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 480, y + 96);
      ctx.lineTo(W / 2 + 480, y + 96);
      ctx.stroke();
      y += 160;
    } else {
      ctx.fillStyle = C.ink;
      ctx.font = `400 italic 44px ${f.display}`;
      ctx.fillText(line, W / 2, y);
      y += 58;
    }
  }

  // closing
  ctx.textAlign = "left";
  ctx.fillStyle = C.ink;
  ctx.font = `700 34px ${f.hand}`;
  keepsakeCopy.closing.forEach((l, i) => ctx.fillText(l, 196, H - 250 + i * 44));
  ctx.font = `700 22px ${f.body}`;
  ctx.fillStyle = C.goldDeep;
  ctx.fillText(`ENTERED THE SANCTUARY · ${date.toUpperCase()}`, 196, H - 110);

  seal(ctx, W - 300, H - 280, 130, f.body);
}

/** The Pilgrim’s keepsake: a certificate of the Order of the Open Ear, made in the browser. */
export default function Keepsake({ unlockedAt }: { unlockedAt: string | null }) {
  const [name, setName] = useState("");
  const [skipped, setSkipped] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [status, setStatus] = useState("");
  const [printUrl, setPrintUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = useId();
  const [today] = useState(() => new Date().toISOString());
  const date = new Date(unlockedAt ?? today).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    let alive = true;
    try {
      const saved = window.localStorage.getItem(NAME_KEY);
      if (saved) queueMicrotask(() => alive && setName(saved));
    } catch {}
    document.fonts.ready.then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx, name, date);
  }, [name, date, fontsReady, skipped]);

  const remember = (v: string) => {
    setName(v);
    try {
      window.localStorage.setItem(NAME_KEY, v);
    } catch {}
  };

  const download = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return setStatus("Sorry, your browser couldn’t make the image.");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = (name.trim() || "pilgrim").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      a.download = `order-of-the-open-ear-${slug || "pilgrim"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      setStatus("Saved. Oliver has stamped it.");
    }, "image/png");
  };

  const print = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    setPrintUrl(url);
    const done = () => {
      document.documentElement.classList.remove("printing-keepsake");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    document.documentElement.classList.add("printing-keepsake");
    window.setTimeout(() => window.print(), 50);
  };

  if (skipped)
    return (
      <section className={styles.keepsake} aria-labelledby="keepsake-title">
        <h2 id="keepsake-title" className={styles.sectionTitle}>
          {keepsakeCopy.title}
        </h2>
        <p className={styles.sectionNote}>
          No keepsake, no problem. Oliver remembers you anyway.{" "}
          <button type="button" className={styles.toolLink} onClick={() => setSkipped(false)}>
            Changed your mind?
          </button>
        </p>
      </section>
    );

  return (
    <section className={styles.keepsake} aria-labelledby="keepsake-title">
      <h2 id="keepsake-title" className={styles.sectionTitle}>
        {keepsakeCopy.title}
      </h2>
      <p className={styles.sectionNote}>{keepsakeCopy.intro}</p>
      <div className={styles.keepsakeGrid}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={styles.certificate}
          role="img"
          aria-label={`Certificate of the Order of the Open Ear for ${name.trim() || keepsakeCopy.defaultName}: found the hidden Sage, followed the sound, and pledged to leave room for the strange. Witnessed by Briz the Sage, approved by Oliver, filed incorrectly by Baboo Baboo.`}
        />
        <div className={styles.keepsakeForm}>
          <label htmlFor={id} className={styles.fieldLabel}>
            Your name, as you’d like it written
          </label>
          <input id={id} className={styles.input} type="text" maxLength={32} autoComplete="nickname" placeholder={keepsakeCopy.defaultName} value={name} onChange={(e) => remember(e.target.value)} />
          <p className={styles.small}>Made in your browser. Your name stays on this device; nothing is sent anywhere.</p>
          <div className={styles.keepsakeActions}>
            <button type="button" className="btn btn-gold" onClick={download}>
              Download (PNG)
            </button>
            <button type="button" className="btn btn-ghost" onClick={print}>
              Print
            </button>
            <button type="button" className={styles.toolLink} onClick={() => setSkipped(true)}>
              {keepsakeCopy.skip}
            </button>
          </div>
          <p className={styles.small} aria-live="polite">
            {status}
          </p>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- print-only copy of the canvas */}
      {printUrl && <img src={printUrl} alt="" className={`${styles.printOnly} keepsake-print`} />}
    </section>
  );
}
