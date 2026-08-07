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
  /**
   * Permite valores negativos, com um seletor de sinal (+ / -) ao lado do
   * campo. Usado no campo "Ajustes", que no extrato do iFood pode vir
   * negativo (loja deve à plataforma) ou positivo (plataforma reembolsa).
   */
  allowNegative?: boolean;
}

/**
 * Máscara "estilo cofrinho": o usuário digita apenas números e os dois
 * últimos dígitos se tornam os centavos automaticamente (ex.: 6200000 -> R$ 62.000,00).
 * Isso elimina qualquer ambiguidade entre ponto e vírgula.
 */
export function CurrencyInput({
  value,
  onChange,
  placeholder,
  className,
  id,
  allowNegative = false,
}: CurrencyInputProps) {
  const [digits, setDigits] = React.useState(() => numberToDigits(Math.abs(value || 0)));
  const [negative, setNegative] = React.useState(() => value < 0);
  const isFocused = React.useRef(false);

  React.useEffect(() => {
    if (!isFocused.current) {
      setDigits(numberToDigits(Math.abs(value || 0)));
      setNegative(value < 0);
    }
  }, [value]);

  function emit(nextDigits: string, nextNegative: boolean) {
    const magnitude = digitsToNumber(nextDigits);
    onChange(nextNegative && magnitude > 0 ? -magnitude : magnitude);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    setDigits(raw);
    emit(raw, negative);
  }

  function toggleSign() {
    const next = !negative;
    setNegative(next);
    emit(digits, next);
  }

  return (
    <div className="flex items-stretch gap-2">
      {allowNegative && (
        <button
          type="button"
          onClick={toggleSign}
          aria-pressed={negative}
          aria-label={negative ? "Valor negativo: você deve ao iFood" : "Valor positivo: o iFood reembolsou você"}
          title={negative ? "Negativo — você deve ao iFood" : "Positivo — o iFood reembolsou você"}
          className="mono-num shrink-0 w-12 rounded-xl border text-base font-bold transition-colors"
          style={{
            borderColor: negative ? "var(--accent-neg)" : "var(--accent-pos)",
            color: negative ? "var(--accent-neg)" : "var(--accent-pos)",
            background: negative ? "var(--accent-neg-light)" : "var(--accent-pos-light)",
          }}
        >
          {negative ? "−" : "+"}
        </button>
      )}
      <div className="relative flex-1">
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
    </div>
  );
}
