"use client";

import * as React from "react";
import { digitsToBRLDisplay, digitsToNumber, numberToDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Máscara "estilo cofrinho": o usuário digita apenas números e os dois
 * últimos dígitos se tornam os centavos automaticamente (ex.: 6200000 -> R$ 62.000,00).
 * Isso elimina qualquer ambiguidade entre ponto e vírgula.
 */
export function CurrencyInput({ value, onChange, placeholder, className, id }: CurrencyInputProps) {
  const [digits, setDigits] = React.useState(() => (value ? numberToDigits(value) : ""));
  const isFocused = React.useRef(false);

  React.useEffect(() => {
    if (!isFocused.current) {
      setDigits(value ? numberToDigits(value) : "");
    }
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    setDigits(raw);
    onChange(digitsToNumber(raw));
  }

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body text-sm">R$</span>
      <input
        id={id}
        inputMode="numeric"
        value={digitsToBRLDisplay(digits)}
        onChange={handleChange}
        onFocus={() => (isFocused.current = true)}
        onBlur={() => (isFocused.current = false)}
        placeholder={placeholder ?? "0,00"}
        className={cn(
          "mono-num w-full pl-11 pr-4 py-3 text-sm bg-bg border border-border rounded-xl text-heading",
          "focus:outline-none focus:border-accent-pos focus:ring-2 focus:ring-accent-pos/20",
          className
        )}
      />
    </div>
  );
}
