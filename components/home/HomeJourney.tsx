"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/settings";
import { ScrollTrigger } from "@/lib/gsap";
import SceneOutside from "./SceneOutside";
import SceneRoom from "./SceneRoom";
import SceneUnder from "./SceneUnder";

/**
 * "What’s down inside the blue house?"
 * Outside → approach → living room → under the rug → under the house.
 * Each scene owns its own ScrollTrigger timeline; this component wires the
 * shortcuts between them and pauses ambient animation in off-screen scenes.
 */
export default function HomeJourney() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  // Pause CSS ambient animation for scenes that are off screen.
  useEffect(() => {
    const scenes = root.current?.querySelectorAll<HTMLElement>("[data-scene]");
    if (!scenes || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => ((e.target as HTMLElement).dataset.active = String(e.isIntersecting))),
      { rootMargin: "25% 0px" },
    );
    scenes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Layout can shift once fonts and images settle; re-measure the scroll scenes.
  useEffect(() => {
    let cancelled = false;
    const refresh = () => !cancelled && ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("load", refresh);
    };
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Pinned scenes add spacer elements; measure the live position.
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    el.focus?.({ preventScroll: true });
  };

  return (
    <div ref={root}>
      <SceneOutside reduced={reduced} onEnter={() => goTo("living-room")} />
      <SceneRoom reduced={reduced} onDescend={() => goTo("under-the-house")} />
      <SceneUnder
        reduced={reduced}
        onSurface={() => {
          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
          document.getElementById("home-title")?.focus({ preventScroll: true });
        }}
      />
    </div>
  );
}
