export const FATURAMENTO_OPTIONS = [
  "Faturo até 20 mil",
  "Faturo até 50 mil",
  "Faturo até 100 mil",
  "Faturo até 200 mil",
  "Faturo até 300 mil",
  "Faturo até 500 mil",
  "Faturo mais de 500 mil",
] as const;

export type FaturamentoOption = (typeof FATURAMENTO_OPTIONS)[number];

export const FUNCAO_OPTIONS = [
  "Proprietário de delivery",
  "Sócio",
  "Gerente",
  "Gestor de lojas iFood/99",
  "Gestor de tráfego",
  "Outro",
] as const;

export type FuncaoOption = (typeof FUNCAO_OPTIONS)[number];
