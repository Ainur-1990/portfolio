"use client";

import { useEffect, useRef } from "react";
import type { AuraState } from "./brain";

const COLORS: Record<AuraState, [number, number, number]> = {
  idle: [34, 211, 238], // циан — ожидание
  care: [52, 211, 153], // зелёный — забота
  alert: [248, 113, 113], // красный — тревога
  thinking: [165, 243, 252], // яркое свечение — обработка
};

export default function Sphere({ state }: { state: AuraState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<AuraState>(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // равномерное распределение точек по сфере (спираль Фибоначчи)
    const N = 480;
    const pts: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = golden * i;
      pts.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r });
    }

    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const pz = new Float32Array(N);
    const cur: [number, number, number] = [...COLORS.idle];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let t = 0;
    let angle = 0;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      const st = stateRef.current;
      const target = COLORS[st];
      for (let i = 0; i < 3; i++) {
        cur[i] += (target[i] - cur[i]) * Math.min(1, dt * 3);
      }
      const [r, g, b] = [Math.round(cur[0]), Math.round(cur[1]), Math.round(cur[2])];

      const speed = reduced ? 0 : st === "thinking" ? 1.5 : 0.35;
      const period = st === "thinking" ? 1.1 : 3.4;
      const pulse = reduced ? 1 : 1 + 0.05 * Math.sin((t * Math.PI * 2) / period);
      angle += dt * speed;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.34 * pulse;
      const tilt = 0.42;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // центральное свечение
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
      glow.addColorStop(0, `rgba(${r},${g},${b},0.30)`);
      glow.addColorStop(0.45, `rgba(${r},${g},${b},0.08)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // проекция точек
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;
        const persp = 2.2 / (2.2 - z2);
        px[i] = cx + x1 * R * persp;
        py[i] = cy + y2 * R * persp;
        pz[i] = z2;
      }

      // нити между соседними точками
      ctx.lineWidth = 1;
      for (let i = 0; i < N - 1; i++) {
        const front = Math.max(0, (pz[i] + pz[i + 1]) / 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(0.03 + 0.09 * front).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(px[i], py[i]);
        ctx.lineTo(px[i + 1], py[i + 1]);
        ctx.stroke();
      }

      // точки: передние крупнее и ярче
      for (let i = 0; i < N; i++) {
        const front = (pz[i] + 1) / 2;
        ctx.fillStyle = `rgba(${r},${g},${b},${(0.15 + 0.85 * front).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px[i], py[i], 0.8 + 1.9 * front, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="aspect-square w-full max-w-[340px] select-none"
      role="img"
      aria-label="Пульсирующая 3D-сфера AURA"
    />
  );
}
