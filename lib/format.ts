/** Formata um número como moeda brasileira: 62000 -> "R$ 62.000,00" */
export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formata um número com separador de milhar brasileiro, sem o símbolo R$. */
export function formatNumberBR(value: number, decimals = 2): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Formata percentuais com uma casa decimal, no padrão brasileiro (vírgula). */
export function formatPercentBR(value: number): string {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

/**
 * Máscara de moeda "estilo cofrinho": o usuário digita apenas números e os
 * dois últimos dígitos são sempre os centavos - exatamente como em apps
 * bancários brasileiros. Elimina a ambiguidade entre ponto e vírgula.
 *
 * Ex.: digitar "6200000" resulta em "62.000,00".
 */
export function digitsToBRLDisplay(digits: string): string {
  const onlyDigits = digits.replace(/\D/g, "");
  if (!onlyDigits) return "";
  const cents = parseInt(onlyDigits, 10);
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function digitsToNumber(digits: string): number {
  const onlyDigits = digits.replace(/\D/g, "");
  if (!onlyDigits) return 0;
  return parseInt(onlyDigits, 10) / 100;
}

export function numberToDigits(value: number): string {
  return Math.round((Number(value) || 0) * 100).toString();
}
