"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  showBack?: boolean;
  onBack?: () => void;
}

export function TopBar({ showBack, onBack }: TopBarProps) {
  return (
    <div className="w-full sticky top-0 z-30 backdrop-blur-sm bg-bg/85 border-b border-border print:hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
        {showBack && onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="hidden sm:flex">
            <ArrowLeft size={14} /> Voltar
          </Button>
        )}
      </div>
    </div>
  );
}
