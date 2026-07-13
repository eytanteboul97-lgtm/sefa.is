"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  size: number;
};

const WORDMARK = "NATUREL";

/**
 * Opening ritual: silence, then the wordmark gathers itself out of drifting
 * sand grains, breathes for a moment, and dissolves back into grains that
 * scatter to reveal the page. Runs once per mount; skips straight through
 * under prefers-reduced-motion since there is no safe reduced version of a
 * particle formation.
 */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(false);
      onDone();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Sample the wordmark's glyph shapes into a point cloud via an
    // offscreen canvas, so particles have real target positions to gather at.
    const off = document.createElement("canvas");
    const w = window.innerWidth;
    const h = window.innerHeight;
    off.width = w;
    off.height = h;
    const offCtx = off.getContext("2d");
    const particles: Particle[] = [];

    if (offCtx) {
      const fontSize = Math.min(w * 0.11, 150);
      offCtx.fillStyle = "#000";
      offCtx.font = `600 ${fontSize}px var(--font-luxury, serif)`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(WORDMARK, w / 2, h / 2);
      const spacedFontSize = fontSize;
      // letter-spacing approximation: redraw with manual spacing
      offCtx.clearRect(0, 0, w, h);
      offCtx.fillStyle = "#000";
      offCtx.font = `600 ${spacedFontSize}px var(--font-luxury, serif)`;
      const letters = WORDMARK.split("");
      const gap = spacedFontSize * 0.16;
      const widths = letters.map((l) => offCtx.measureText(l).width);
      const totalWidth = widths.reduce((a, b) => a + b, 0) + gap * (letters.length - 1);
      let cursor = w / 2 - totalWidth / 2;
      letters.forEach((l, i) => {
        offCtx.fillText(l, cursor + widths[i] / 2, h / 2);
        cursor += widths[i] + gap;
      });

      const imageData = offCtx.getImageData(0, 0, w, h).data;
      const stride = Math.max(2, Math.floor(w / 480));
      for (let y = 0; y < h; y += stride) {
        for (let x = 0; x < w; x += stride) {
          const alpha = imageData[(y * w + x) * 4 + 3];
          if (alpha > 128) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              originX: Math.random() * w,
              originY: Math.random() * h,
              targetX: x,
              targetY: y,
              size: Math.random() * 1.4 + 0.6,
            });
          }
        }
      }
    }

    const start = performance.now();
    const GATHER_END = 1700;
    const HOLD_END = 2600;
    const SCATTER_END = 3700;
    const FADE_END = 4200;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const draw = (now: number) => {
      if (cancelled) return;
      const t = now - start;
      ctx.clearRect(0, 0, w, h);

      let overlayAlpha = 1;
      if (t > HOLD_END) {
        overlayAlpha = 1 - Math.min(1, (t - HOLD_END) / (FADE_END - HOLD_END));
      }

      for (const p of particles) {
        let px: number;
        let py: number;
        let alpha = 1;

        if (t < GATHER_END) {
          const progress = ease(Math.min(1, t / GATHER_END));
          px = p.originX + (p.targetX - p.originX) * progress;
          py = p.originY + (p.targetY - p.originY) * progress;
        } else if (t < HOLD_END) {
          const breathe = Math.sin((t - GATHER_END) / 260) * 0.6;
          px = p.targetX + breathe * 0.3;
          py = p.targetY + breathe * 0.3;
        } else {
          const progress = ease(Math.min(1, (t - HOLD_END) / (SCATTER_END - HOLD_END)));
          px = p.targetX + (p.originX - p.targetX) * progress * 1.4;
          py = p.targetY + (p.originY - p.targetY) * progress * 1.4;
          alpha = 1 - progress;
        }

        ctx.globalAlpha = Math.max(0, alpha * overlayAlpha);
        ctx.fillStyle = "#b8975c";
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (t < FADE_END) {
        raf = requestAnimationFrame(draw);
      } else {
        setVisible(false);
        onDone();
      }
    };

    raf = requestAnimationFrame(draw);
    document.body.style.overflow = "hidden";

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-naturel-pearl">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
