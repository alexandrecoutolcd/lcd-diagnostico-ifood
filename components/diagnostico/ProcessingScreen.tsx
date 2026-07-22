"use client";

import { useEffect, useState } from "react";
import { StepProgress } from "./StepProgress";

const MESSAGES = [
  "Lendo os três meses do seu Financeiro...",
  "Calculando faturamento líquido...",
  "Classificando sua estratégia de aquisição...",
  "Montando o seu diagnóstico...",
];

export function ProcessingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 3.2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 350);
          return 100;
        }
        return next;
      });
    }, 90);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const msgIndex = Math.min(MESSAGES.length - 1, Math.floor(progress / (100 / MESSAGES.length)));

  return (
    <div className="max-w-md mx-auto px-5 pt-24 pb-24 text-center">
      <StepProgress current={2} />
      <div className="mt-14 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full mb-7 df-spin border-[3px] border-border" style={{ borderTopColor: "var(--accent-pos)" }} />
        <div className="heading text-xl font-semibold mb-2">Processando seu diagnóstico</div>
        <div className="text-body text-sm mb-8 df-pulse normal-case">{MESSAGES[msgIndex]}</div>
        <div className="w-full h-1.5 rounded-full overflow-hidden bg-border">
          <div
            className="h-full transition-all duration-300 bg-accent-pos"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mono-num text-xs text-body mt-2">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
