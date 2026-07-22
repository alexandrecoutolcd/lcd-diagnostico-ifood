"use client";

import { useEffect, useState } from "react";
import { clamp } from "@/lib/calculations";

function scoreColorVar(score: number) {
  if (score >= 75) return "var(--zone-2)";
  if (score >= 50) return "var(--zone-3)";
  if (score >= 30) return "var(--zone-4)";
  return "var(--zone-5)";
}

export function Gauge({ score }: { score: number }) {
  const size = 200;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 180;
  const endAngle = 0;
  const pct = clamp(score, 0, 100) / 100;
  const angle = startAngle + (endAngle - startAngle) * pct;

  const toXY = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
  };
  const [x1, y1] = toXY(startAngle);
  const [x2, y2] = toXY(endAngle);
  const [xEnd, yEnd] = toXY(angle);

  const color = scoreColorVar(score);
  const arcLen = ((startAngle - angle) / 180) * Math.PI * r;
  const fullLen = Math.PI * r;

  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(score * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 24} viewBox={`0 0 ${size} ${size / 2 + 24}`}>
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLen} ${fullLen}`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.16,1,.3,1)" }}
        />
        <circle cx={xEnd} cy={yEnd} r={7} fill={color} stroke="var(--card)" strokeWidth={3} />
      </svg>
      <div className="heading text-4xl font-semibold -mt-3" style={{ color }}>
        {display}
      </div>
      <div className="text-body text-xs uppercase tracking-wide mono-num mt-1">Nota Geral · 0–100</div>
    </div>
  );
}
