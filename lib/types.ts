import { FaturamentoOption, FuncaoOption } from "./options";

export interface MonthData {
  totalVendas: number;
  taxasComissoes: number;
  servicosPromocoes: number;
  ajustes: number;
  ticketMedio: number;
}

export interface MonthDerived extends MonthData {
  faturamentoLiquido: number;
  pctTaxas: number;
  pctPromocoes: number;
}

export interface Averages {
  totalVendas: number;
  taxasComissoes: number;
  servicosPromocoes: number;
  ajustes: number;
  ticketMedio: number;
  faturamentoLiquido: number;
  pctTaxas: number;
  pctPromocoes: number;
}

export type ClassificationZone = 1 | 2 | 3 | 4 | 5;

export interface Classification {
  key: "conservadora" | "controlada" | "moderada" | "agressiva" | "descontrolada";
  label: string;
  zone: ClassificationZone;
  headline: string;
  detail: string;
}

export interface PlatformReference {
  nome: string;
  valor: number;
  diff: number;
  acimaDaReferencia: boolean;
}

export interface SimulationResult {
  novoServico: number;
  novoFaturamento: number;
  deltaMensal: number;
  deltaAnual: number;
}

export interface Recommendation {
  title: string;
  detail: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  faturamento: FaturamentoOption;
  funcao: FuncaoOption;
}

/** Dados capturados automaticamente da URL, não preenchidos pelo usuário. */
export interface UtmParams {
  link: string;
  utm_source: string;
  utm_campaign: string;
  utm_medium: string;
  utm_content: string;
}

export const EMPTY_UTM: UtmParams = {
  link: "",
  utm_source: "",
  utm_campaign: "",
  utm_medium: "",
  utm_content: "",
};

export const EMPTY_MONTH: MonthData = {
  totalVendas: 0,
  taxasComissoes: 0,
  servicosPromocoes: 0,
  ajustes: 0,
  ticketMedio: 0,
};

export const SAMPLE_MONTHS: MonthData[] = [
  { totalVendas: 62000, taxasComissoes: 9424, servicosPromocoes: 8680, ajustes: 950, ticketMedio: 81 },
  { totalVendas: 65500, taxasComissoes: 9956, servicosPromocoes: 9430, ajustes: 1100, ticketMedio: 83 },
  { totalVendas: 68200, taxasComissoes: 10365, servicosPromocoes: 9750, ajustes: 1020, ticketMedio: 84 },
];
