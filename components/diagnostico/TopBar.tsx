"use client";

import { Gauge, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  showBack?: boolean;
  onBack?: () => void;
}

export function TopBar({ showBack, onBack }: TopBarProps) {
  return (
    <div className="w-full sticky top-0 z-30 backdrop-blur-sm bg-bg/85 border-b border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-heading">
            <Gauge size={16} className="text-bg" />
          </div>
          <span className="heading text-[17px] font-semibold tracking-wide">Diagnóstico Financeiro</span>
        </div>
        {showBack && onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="hidden sm:flex">
            <ArrowLeft size={14} /> Voltar
          </Button>
        )}
      </div>
    </div>
  );
}
