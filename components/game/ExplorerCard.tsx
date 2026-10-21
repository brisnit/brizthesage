"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useGame } from "@/lib/gameStore";
import { explorerCardCopy as card } from "@/content/game";
import styles from "./HouseRemembers.module.css";

const W = 900;
const H = 1260;

const P = {
  plum950: "#120a19",
  plum800: "#2a1734",
  plum700: "#3d2147",
  ink900: "#0e1630",
  teal700: "#24706f",
  teal500: "#4fb3a9",
  teal400: "#6cc8bd",
  teal300: "#9adbd0",
  moss700: "#3f5a26",
  moss500: "#6b8a37",
  moss300: "#a3b864",
  coral600: "#c4664f",
  coral500: "#de8a72",
  coral300: "#efb6a0",
  ochre700: "#9c6419",
  ochre500: "#e0a23a",
  ochre300: "#f4cf72",
  moon: "#f6dd8a",
  parchment: "#f3e7cc",
  line: "#1a1022",
};

function cardNumber(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return `BH-${String(Math.abs(h) % 9000 + 1000)}`;
}

function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function draw(ctx: CanvasRenderingContext2D, opts: { name: string; date: string; number: string; nightLine: boolean }) {
  const display = fontVar("--font-fraunces", "Georgia, serif");
  const body = fontVar("--font-karla", "system-ui, sans-serif");
  const hand = fontVar("--font-caveat", "cursive");
  const r = rng(42);

  const ink = (w = 6) => {
    ctx.strokeStyle = P.line;
    ctx.lineWidth = w;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  };

  // Card body
  const bg = ctx.createRadialGradient(W / 2, H * 0.35, 50, W / 2, H * 0.5, H * 0.75);
  bg.addColorStop(0, P.plum700);
  bg.addColorStop(0.6, P.plum800);
  bg.addColorStop(1, P.ink900);
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 46);
  ctx.fill();

  // Frame
  ctx.beginPath();
  ctx.roundRect(26, 26, W - 52, H - 52, 30);
  ctx.strokeStyle = P.ochre500;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(44, 44, W - 88, H - 88, 22);
  ctx.strokeStyle = P.ochre300;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  for (const [x, y] of [
    [44, 44],
    [W - 44, 44],
    [44, H - 44],
    [W - 44, H - 44],
  ]) {
    star(ctx, x, y, 16, P.ochre300);
  }

  // Title
  ctx.textAlign = "center";
  ctx.fillStyle = P.parchment;
  ctx.font = `700 54px ${display}`;
  ctx.lineWidth = 10;
  ctx.strokeStyle = P.line;
  ctx.strokeText(card.title, W / 2, 132);
  ctx.fillText(card.title, W / 2, 132);
  ctx.font = `700 30px ${body}`;
  ctx.fillStyle = P.ochre300;
  ctx.fillText(card.subtitle.split("").join(" "), W / 2, 178);

  // Illustration window
  const ix = 80,
    iy = 210,
    iw = W - 160,
    ih = 560;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(ix, iy, iw, ih, 26);
  ctx.clip();
  const sky = ctx.createLinearGradient(0, iy, 0, iy + ih);
  sky.addColorStop(0, P.plum950);
  sky.addColorStop(0.6, P.plum800);
  sky.addColorStop(1, P.coral600);
  ctx.fillStyle = sky;
  ctx.fillRect(ix, iy, iw, ih);
  for (let i = 0; i < 70; i++) {
    ctx.globalAlpha = 0.3 + r() * 0.7;
    ctx.fillStyle = P.parchment;
    ctx.beginPath();
    ctx.arc(ix + r() * iw, iy + r() * ih * 0.6, 0.8 + r() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Moon + glow
  const mx = W / 2,
    my = iy + 250,
    mr = 200;
  const glow = ctx.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 1.5);
  glow.addColorStop(0, "rgba(244,207,114,0.5)");
  glow.addColorStop(1, "rgba(244,207,114,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(ix, iy, iw, ih);
  const moonFill = ctx.createRadialGradient(mx - 60, my - 70, 20, mx, my, mr);
  moonFill.addColorStop(0, "#fff2b8");
  moonFill.addColorStop(0.75, P.moon);
  moonFill.addColorStop(1, "#e8bf5e");
  ctx.fillStyle = moonFill;
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.fill();
  ink(7);
  ctx.fillStyle = "rgba(232,191,94,0.55)";
  for (const [dx, dy, rr] of [
    [-70, -40, 24],
    [60, 50, 34],
    [90, -90, 14],
  ]) {
    ctx.beginPath();
    ctx.arc(mx + dx, my + dy, rr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Clouds with sleepy faces
  cloud(ctx, ix + 110, iy + 170, 0.9);
  cloud(ctx, ix + iw - 100, iy + 300, 0.75);

  // Hill
  ctx.fillStyle = P.moss700;
  ctx.beginPath();
  ctx.moveTo(ix - 20, iy + ih + 20);
  ctx.bezierCurveTo(ix + 60, iy + 430, ix + iw - 60, iy + 430, ix + iw + 20, iy + ih + 20);
  ctx.closePath();
  ctx.fill();
  ink(6);

  // House dome
  const hx = W / 2,
    hy = iy + 500;
  ctx.fillStyle = P.teal500;
  ctx.beginPath();
  ctx.moveTo(hx - 150, hy);
  ctx.bezierCurveTo(hx - 175, hy - 120, hx - 140, hy - 240, hx - 60, hy - 270);
  ctx.bezierCurveTo(hx + 20, hy - 300, hx + 120, hy - 250, hx + 150, hy - 150);
  ctx.bezierCurveTo(hx + 165, hy - 90, hx + 160, hy - 40, hx + 150, hy);
  ctx.closePath();
  ctx.fill();
  ink(7);
  // moss cap
  ctx.fillStyle = P.moss500;
  ctx.beginPath();
  ctx.moveTo(hx - 125, hy - 215);
  ctx.bezierCurveTo(hx - 60, hy - 300, hx + 80, hy - 290, hx + 135, hy - 190);
  for (let i = 0; i <= 10; i++) {
    const x = hx + 135 - i * 26;
    ctx.lineTo(x, hy - 190 + (i % 2 ? 30 : -4) + Math.sin(i) * 6);
  }
  ctx.closePath();
  ctx.fill();
  ink(5);
  // round window
  ctx.fillStyle = P.ochre300;
  ctx.beginPath();
  ctx.arc(hx - 85, hy - 130, 26, 0, Math.PI * 2);
  ctx.fill();
  ink(5);
  ctx.beginPath();
  ctx.moveTo(hx - 85, hy - 156);
  ctx.lineTo(hx - 85, hy - 104);
  ctx.moveTo(hx - 111, hy - 130);
  ctx.lineTo(hx - 59, hy - 130);
  ink(4);
  // door
  ctx.fillStyle = P.ochre500;
  ctx.beginPath();
  ctx.moveTo(hx - 55, hy);
  ctx.lineTo(hx - 60, hy - 100);
  ctx.bezierCurveTo(hx - 58, hy - 160, hx + 58, hy - 165, hx + 58, hy - 100);
  ctx.lineTo(hx + 55, hy);
  ctx.closePath();
  ctx.fill();
  ink(6);
  const door = ctx.createRadialGradient(hx, hy - 50, 5, hx, hy - 60, 90);
  door.addColorStop(0, "#fff6cf");
  door.addColorStop(1, P.ochre300);
  ctx.fillStyle = door;
  ctx.beginPath();
  ctx.moveTo(hx - 36, hy);
  ctx.lineTo(hx - 40, hy - 92);
  ctx.bezierCurveTo(hx - 38, hy - 135, hx + 38, hy - 138, hx + 38, hy - 92);
  ctx.lineTo(hx + 36, hy);
  ctx.closePath();
  ctx.fill();
  ink(4);
  // skeleton peeking
  ctx.save();
  ctx.translate(hx + 22, hy - 70);
  ctx.rotate(-0.25);
  ctx.fillStyle = P.teal400;
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ink(4);
  ctx.fillStyle = P.plum950;
  for (const [ex, ey] of [
    [-10, -4],
    [11, -5],
  ]) {
    ctx.beginPath();
    ctx.ellipse(ex, ey, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = P.ochre300;
  ctx.beginPath();
  ctx.arc(-9, -2, 2, 0, Math.PI * 2);
  ctx.arc(12, -3, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-12, 14);
  ctx.quadraticCurveTo(0, 22, 14, 13);
  ink(3);
  ctx.restore();

  // Night Line stamp
  if (opts.nightLine) {
    ctx.save();
    ctx.translate(ix + iw - 110, iy + 100);
    ctx.rotate(-0.22);
    ctx.globalAlpha = 0.92;
    ctx.strokeStyle = P.coral300;
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = P.coral300;
    ctx.font = `800 22px ${body}`;
    ctx.fillText("NIGHT", 0, -6);
    ctx.fillText("LINE", 0, 22);
    ctx.font = `400 18px ${body}`;
    ctx.fillText("☎", 0, -34);
    ctx.restore();
  }
  ctx.restore();
  // window outline
  ctx.beginPath();
  ctx.roundRect(ix, iy, iw, ih, 26);
  ink(6);

  // Relics
  const ry = 860;
  const relicXs = [W / 2 - 170, W / 2, W / 2 + 170];
  relicXs.forEach((x, i) => {
    const g = ctx.createRadialGradient(x, ry, 10, x, ry, 70);
    g.addColorStop(0, "rgba(255,242,184,0.45)");
    g.addColorStop(1, "rgba(255,242,184,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - 70, ry - 70, 140, 140);
    ctx.save();
    ctx.translate(x, ry);
    if (i === 0) drawKey(ctx);
    if (i === 1) drawRecord(ctx);
    if (i === 2) drawMoon(ctx);
    ctx.restore();
  });
  ctx.font = `700 18px ${body}`;
  ctx.fillStyle = P.ochre300;
  ["I", "II", "III"].forEach((n, i) => ctx.fillText(n, relicXs[i], ry + 76));

  // Name
  const name = opts.name.trim() || card.defaultName;
  let size = 86;
  ctx.font = `700 ${size}px ${hand}`;
  while (ctx.measureText(name).width > W - 180 && size > 40) {
    size -= 4;
    ctx.font = `700 ${size}px ${hand}`;
  }
  ctx.fillStyle = P.ochre300;
  ctx.fillText(name, W / 2, 1018);
  ctx.beginPath();
  ctx.moveTo(140, 1038);
  ctx.bezierCurveTo(350, 1028, 560, 1048, W - 140, 1036);
  ctx.strokeStyle = "rgba(243,231,204,0.5)";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = P.parchment;
  ctx.font = `400 italic 27px ${display}`;
  card.lines.forEach((line, i) => ctx.fillText(line, W / 2, 1080 + i * 34, W - 160));
  ctx.font = `700 17px ${body}`;
  ctx.fillStyle = P.teal300;
  ctx.fillText(`${opts.number}  ·  RELICS WOKEN ${opts.date.toUpperCase()}  ·  BRIZ THE SAGE`, W / 2, 1200, W - 140);

  // Grain
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)";
    ctx.fillRect(r() * W, r() * H, 1.6, 1.6);
  }
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 ? s * 0.3 : s;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const puffs = [
    [-70, 10, 34],
    [-35, -14, 44],
    [10, -24, 50],
    [55, -6, 40],
    [80, 16, 30],
    [-20, 22, 38],
    [30, 24, 36],
  ];
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = P.line;
  for (const [px, py, pr] of puffs) {
    ctx.beginPath();
    ctx.arc(px, py, pr + 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = P.coral500;
  for (const [px, py, pr] of puffs) {
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(239,182,160,0.6)";
  for (const [px, py, pr] of puffs.slice(0, 4)) {
    ctx.beginPath();
    ctx.arc(px - pr * 0.2, py - pr * 0.3, pr * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = P.line;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const ex of [-28, 22]) {
    ctx.beginPath();
    ctx.arc(ex, 6, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 26, 7, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  ctx.restore();
}

function drawMoon(ctx: CanvasRenderingContext2D) {
  const p = new Path2D("M20 -50 C-30 -44 -56 -6 -50 30 C-44 64 -6 84 34 76 C6 66 -12 40 -12 10 C-12 -20 0 -40 20 -50 Z");
  ctx.scale(0.75, 0.75);
  ctx.translate(8, -12);
  ctx.fillStyle = P.moon;
  ctx.fill(p);
  ctx.strokeStyle = P.line;
  ctx.lineWidth = 7;
  ctx.lineJoin = "round";
  ctx.stroke(p);
  ctx.beginPath();
  ctx.arc(-30, 8, 7, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.lineWidth = 5;
  ctx.stroke();
}

function drawKey(ctx: CanvasRenderingContext2D) {
  ctx.rotate(-0.5);
  ctx.scale(0.8, 0.8);
  ctx.fillStyle = P.ochre500;
  ctx.strokeStyle = P.line;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(-38, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = P.plum950;
  ctx.beginPath();
  ctx.arc(-38, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = P.ochre500;
  ctx.beginPath();
  ctx.roundRect(-18, -7, 86, 14, 5);
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.rect(8 + i * 8.5, 7, 5.5, i % 2 ? 9 : 14);
    ctx.fill();
    ctx.stroke();
  }
}

function drawRecord(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = P.line;
  ctx.fillStyle = P.plum950;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#4a3b57";
  ctx.lineWidth = 2;
  for (const rr of [40, 31]) {
    ctx.beginPath();
    ctx.arc(0, 0, rr, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = P.coral500;
  ctx.strokeStyle = P.line;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = P.parchment;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = P.teal300;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 44, 1.15 * Math.PI, 1.4 * Math.PI);
  ctx.stroke();
}

type Keepsake = { href: string; filename: string };

/** In-browser, personalised Sage World Explorer card. Nothing is uploaded anywhere. */
export default function ExplorerCard({ keepsakes = [] }: { keepsakes?: Keepsake[] }) {
  const state = useGame();
  const [name, setName] = useState("");
  const [fontsReady, setFontsReady] = useState(false);
  const [status, setStatus] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputId = useId();

  const solvedAt = state.solvedAt ?? new Date().toISOString();
  const date = new Date(solvedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const number = cardNumber(solvedAt);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    draw(ctx, { name, date, number, nightLine: state.secretCall });
  }, [name, date, number, state.secretCall, fontsReady]);

  const download = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) {
        setStatus("Sorry, your browser couldn’t make the image.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = (name.trim() || "explorer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      a.download = `sage-world-explorer-${slug || "explorer"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      // Then the wallpapers, one after another (browsers dislike simultaneous downloads).
      keepsakes.forEach((k, i) =>
        window.setTimeout(() => {
          const w = document.createElement("a");
          w.href = k.href;
          w.download = k.filename;
          document.body.appendChild(w);
          w.click();
          w.remove();
        }, 600 * (i + 1)),
      );
      setStatus(
        keepsakes.length
          ? "Your card and wallpapers are on their way. If your browser asks about multiple downloads, say yes."
          : "Card saved. Keep it somewhere dry.",
      );
    }, "image/png");
  };

  return (
    <div className={styles.explorer}>
      <h4 className={styles.rewardName}>Your Explorer Card</h4>
      <div className={styles.explorerGrid}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={styles.cardCanvas}
          role="img"
          aria-label={`Sage World Explorer card for ${name.trim() || card.defaultName}, number ${number}, relics woken ${date}${state.secretCall ? ", with the Night Line stamp" : ""}.`}
        />
        <div className={styles.explorerForm}>
          <label htmlFor={inputId} className={styles.fieldLabel}>
            Name on the card
          </label>
          <input
            id={inputId}
            className={styles.input}
            type="text"
            maxLength={28}
            autoComplete="nickname"
            placeholder={card.defaultName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className={styles.small}>Made in your browser. Your name never leaves this device.</p>
          <button type="button" className="btn btn-gold" onClick={download}>
            {card.collect}
          </button>
          <p className={styles.small} aria-live="polite">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
