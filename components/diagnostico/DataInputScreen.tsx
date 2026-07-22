"use client";

import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { StepProgress } from "./StepProgress";
import { FinderIllustration } from "./FinderIllustration";
import { monthDerived } from "@/lib/calculations";
import { formatBRL, formatPercentBR } from "@/lib/format";
import { MonthData, SAMPLE_MONTHS } from "@/lib/types";

interface FieldDef {
  key: keyof MonthData;
  label: string;
  help: string;
}

const FIELD_DEFS: FieldDef[] = [
  { key: "totalVendas", label: "Total de Vendas", help: "Soma bruta de tudo que foi vendido no mês." },
  { key: "taxasComissoes", label: "Taxas e Comissões", help: "Valor retido pela plataforma sobre as vendas." },
  { key: "servicosPromocoes", label: "Serviços e Promoções", help: "Valor investido em campanhas, cupons e destaques." },
  { key: "ajustes", label: "Ajustes", help: "Estornos, cancelamentos e outras correções do período." },
  { key: "ticketMedio", label: "Ticket Médio", help: "Valor médio de cada pedido no mês." },
];

const MONTH_LABELS = ["Mês 1 (mais antigo)", "Mês 2", "Mês 3 (mais recente)"];

interface DataInputScreenProps {
  months: MonthData[];
  setMonths: (months: MonthData[]) => void;
  onNext: () => void;
}

export function DataInputScreen({ months, setMonths, onNext }: DataInputScreenProps) {
  const [tab, setTab] = useState(0);
  const derived = monthDerived(months[tab]);
  const allFilled = months.every((m) => m.totalVendas > 0);

  function update(key: keyof MonthData, value: number) {
    const next = [...months];
    next[tab] = { ...next[tab], [key]: value };
    setMonths(next);
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-10 pb-28">
      <StepProgress current={1} />
      <div className="df-fadeup mt-8 flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h2 className="heading text-2xl font-semibold">Seus últimos 3 meses</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMonths(SAMPLE_MONTHS.map((m) => ({ ...m })))}
            >
              Preencher com exemplo
            </Button>
          </div>
          <p className="text-body text-sm mb-2 normal-case">
            Use os dados do Financeiro da sua loja no iFood, mês a mês.
          </p>
          <div className="flex items-start gap-2 text-xs text-body normal-case mb-6 px-3 py-2 rounded-lg bg-bg border border-border">
            <Info size={13} className="mt-0.5 shrink-0 text-accent-pos" />
            Digite apenas números — os centavos são preenchidos automaticamente (ex.: 6200000 se
            torna R$ 62.000,00).
          </div>

          <div className="flex gap-1.5 p-1 rounded-xl mb-6 bg-bg">
            {MONTH_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`flex-1 py-2 text-xs md:text-sm px-2 rounded-lg font-semibold transition-all ${
                  tab === i ? "bg-heading text-bg" : "text-body"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {FIELD_DEFS.map((f) => (
              <div key={f.key}>
                <div className="flex items-baseline justify-between mb-1.5 gap-2">
                  <label className="text-xs font-medium mono-num uppercase tracking-wide text-body">
                    {f.label}
                  </label>
                  <span className="text-body text-[11px] normal-case text-right">{f.help}</span>
                </div>
                <CurrencyInput value={months[tab][f.key]} onChange={(v) => update(f.key, v)} />
              </div>
            ))}
          </div>

          <div className="mt-7 pt-6 grid grid-cols-3 gap-3 border-t border-border">
            <Stat label="Fat. Líquido" value={formatBRL(derived.faturamentoLiquido)} />
            <Stat label="% Taxas" value={formatPercentBR(derived.pctTaxas)} />
            <Stat label="% Promoções" value={formatPercentBR(derived.pctPromocoes)} />
          </div>
        </Card>

        <div className="w-full lg:w-80 flex flex-col gap-4">
          <FinderIllustration />
          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2 heading">
              <Info size={14} /> Por que 3 meses?
            </div>
            <p className="text-body text-xs leading-relaxed normal-case">
              Um único mês pode ser afetado por sazonalidade ou uma campanha pontual. A média de
              três meses revela o padrão real de investimento em aquisição da sua loja.
            </p>
          </Card>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 flex justify-end">
        <Button size="lg" onClick={onNext} disabled={!allFilled}>
          Gerar diagnóstico <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono-num text-[10px] uppercase tracking-wide text-body mb-1">{label}</div>
      <div className="mono-num text-sm font-semibold text-heading">{value}</div>
    </div>
  );
}
