"use client";

/**
 * Optional "room tone" for the blue house, synthesised live with WebAudio.
 * It is ambience (a low hum, vinyl crackle, a few far-off chimes), not music,
 * and never presented as Briz’s music. It only starts after a visitor clicks
 * the sound toggle, and stops the moment it’s toggled off.
 */

import { getSoundOn } from "./settings";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let running: { stop: () => void } | null = null;

function context() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  return { ctx: ctx!, master: master! };
}

const PENTA = [220, 247.5, 277.2, 330, 370.7, 440, 495, 554.4];

export function startAmbient() {
  const { ctx, master } = context();
  void ctx.resume();
  if (running) return;

  const nodes: AudioNode[] = [];
  const timers: number[] = [];

  // Warm hum: two detuned low oscillators through a soft low-pass.
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.16;
  lp.connect(humGain).connect(master);
  for (const [freq, type] of [
    [55, "triangle"],
    [82.6, "sine"],
    [110.4, "sine"],
  ] as const) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.connect(lp);
    o.start();
    nodes.push(o);
  }
  // Slow breathing on the hum.
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain).connect(humGain.gain);
  lfo.start();
  nodes.push(lfo);

  // Vinyl crackle: sparse clicks in a looping noise buffer.
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.012 + (Math.random() < 0.0007 ? (Math.random() * 2 - 1) * 0.5 : 0);
  }
  const crackle = ctx.createBufferSource();
  crackle.buffer = buf;
  crackle.loop = true;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1200;
  const crackleGain = ctx.createGain();
  crackleGain.gain.value = 0.35;
  crackle.connect(hp).connect(crackleGain).connect(master);
  crackle.start();
  nodes.push(crackle);

  // Far-off chimes, now and then.
  const chime = () => {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = PENTA[Math.floor(Math.random() * PENTA.length)] * 2;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 3.3);
    timers.push(window.setTimeout(chime, 3500 + Math.random() * 6000));
  };
  timers.push(window.setTimeout(chime, 1800));

  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.6);

  running = {
    stop() {
      timers.forEach((t) => clearTimeout(t));
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      const toStop = nodes.slice();
      window.setTimeout(() => {
        toStop.forEach((n) => {
          try {
            (n as OscillatorNode).stop();
          } catch {}
          n.disconnect();
        });
      }, 700);
    },
  };
}

export function stopAmbient() {
  running?.stop();
  running = null;
}

type Sfx = "tick" | "chime" | "thunk" | "ring" | "win";

/** Tiny UI sounds. Silent unless the visitor has turned sound on. */
export function sfx(name: Sfx) {
  if (!getSoundOn()) return;
  const { ctx, master } = context();
  const t = ctx.currentTime;
  const tone = (freq: number, start: number, dur: number, vol: number, type: OscillatorType = "sine") => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t + start);
    g.gain.linearRampToValueAtTime(vol, t + start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
    o.connect(g).connect(master);
    o.start(t + start);
    o.stop(t + start + dur + 0.05);
  };
  master.gain.setTargetAtTime(0.9, t, 0.05);
  switch (name) {
    case "tick":
      tone(1800, 0, 0.03, 0.08, "square");
      break;
    case "thunk":
      tone(90, 0, 0.25, 0.3, "triangle");
      break;
    case "chime":
      [660, 880, 1320].forEach((f, i) => tone(f, i * 0.09, 1.4, 0.08));
      break;
    case "ring":
      for (let i = 0; i < 6; i++) tone(i % 2 ? 480 : 440, i * 0.05, 0.05, 0.05, "square");
      break;
    case "win":
      [440, 554.4, 659.3, 880, 1108.7].forEach((f, i) => tone(f, i * 0.12, 1.8, 0.07, "triangle"));
      break;
  }
}
