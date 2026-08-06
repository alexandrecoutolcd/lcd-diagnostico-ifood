"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  Flame,
  Gauge as GaugeIcon,
  Info,
  MessageCircle,
  Percent,
  Sparkles,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepProgress } from "./StepProgress";
import { KpiCard } from "./KpiCard";
import { AcquisitionThermometer } from "./AcquisitionThermometer";
import { MonthlyBarChart } from "./charts/MonthlyBarChart";
import { DistributionPie } from "./charts/DistributionPie";
import { TimelineChart } from "./charts/TimelineChart";
import {
  acquisitionCost,
  autoSimulationScenarios,
  averages,
  classify,
  monthsWithDerived,
  platformReference,
  recommendations,
  simulate,
} from "@/lib/calculations";
import { formatBRL, formatPercentBR } from "@/lib/format";
import { Lead, MonthData } from "@/lib/types";

const ZONE_COLORS: Record<number, string> = {
  1: "var(--zone-1)",
  2: "var(--zone-2)",
  3: "var(--zone-3)",
  4: "var(--zone-4)",
  5: "var(--zone-5)",
};

// Link do botão de CTA "Quero falar com um consultor".
// Troque pela URL real (WhatsApp, Calendly, formulário, etc.).
const CONSULTANT_LINK = "https://wa.me/55XXXXXXXXXXX";

interface ResultsScreenProps {
  lead: Lead;
  months: MonthData[];
  onRestart: () => void;
}

export function ResultsScreen({ lead, months, onRestart }: ResultsScreenProps) {
  const avg = useMemo(() => averages(months), [months]);
  const classification = useMemo(() => classify(avg.pctPromocoes), [avg]);
  const platformRef = useMemo(() => platformReference(avg.pctTaxas), [avg]);
  const cost = useMemo(() => acquisitionCost(avg.ticketMedio, avg.pctPromocoes), [avg]);
  const recs = useMemo(
    () => recommendations(avg, classification, platformRef),
    [avg, classification, platformRef]
  );
  const scenarios = useMemo(() => autoSimulationScenarios(avg), [avg]);

  const [simPct, setSimPct] = useState(Math.min(avg.pctPromocoes, 30));
  useEffect(() => setSimPct(Math.min(avg.pctPromocoes, 30)), [avg.pctPromocoes]);
  const sim = useMemo(() => simulate(avg, simPct), [avg, simPct]);
  const [sent, setSent] = useState(false);

  const monthRows = useMemo(() => monthsWithDerived(months), [months]);

  const zoneColor = ZONE_COLORS[classification.zone];
  const firstName = lead.name.split(" ")[0] || "tudo bem";

  const analysisText = `Nos últimos três meses, sua empresa investiu em média ${formatPercentBR(
    avg.pctPromocoes
  )} em Serviços e Promoções. Esse percentual é considerado uma ${classification.label.toLowerCase()}. Empresas maduras normalmente trabalham entre 5% e 7%. ${
    classification.zone >= 3
      ? "Isso indica que existe uma probabilidade relevante de parte do seu lucro estar sendo consumida pela estratégia de aquisição utilizada dentro do iFood."
      : "Isso mostra uma estratégia de aquisição enxuta — com espaço para investir mais, se houver retorno comprovado."
  }`;

  const taxesText = platformRef.acimaDaReferencia
    ? `Seu percentual de taxas (${formatPercentBR(
        avg.pctTaxas
      )}) está acima da referência do ${platformRef.nome} (${platformRef.valor.toFixed(
        1
      )}%). Vale confirmar as condições do seu plano.`
    : `Seu percentual de taxas (${formatPercentBR(
        avg.pctTaxas
      )}) está dentro da média esperada para o ${
        platformRef.nome
      }. O principal ponto de atenção não está na plataforma, e sim no investimento realizado em promoções.`;

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-8 pb-28">
      <div className="print:hidden">
        <StepProgress current={3} />
      </div>

      <div className="mb-6">
        <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
      </div>

      <div className="df-fadeup flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
        <div>
          <div className="mono-num text-xs uppercase tracking-wide text-body mb-1.5">
            Diagnóstico da sua loja
          </div>
          <h1 className="heading text-3xl font-semibold">
            Olá, {firstName}. Aqui está o retrato dos últimos 3 meses.
          </h1>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.print()}
          className="print:hidden shrink-0 shadow-lg shadow-brand/20"
        >
          <Download size={16} /> Baixar PDF
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 df-fadeup df-delay-1">
        <KpiCard label="Total Vendido (média)" value={formatBRL(avg.totalVendas)} icon={<Wallet size={14} />} />
        <KpiCard
          label="Faturamento Líquido"
          value={formatBRL(avg.faturamentoLiquido)}
          icon={<CheckCircle2 size={14} />}
          accentColor={avg.faturamentoLiquido >= 0 ? "var(--accent-big-pos)" : "var(--accent-neg)"}
        />
        <KpiCard label="% Taxas (média)" value={formatPercentBR(avg.pctTaxas)} icon={<Percent size={14} />} />
        <KpiCard
          label="% Promoções (média)"
          value={formatPercentBR(avg.pctPromocoes)}
          icon={<TrendingDown size={14} />}
          accentColor={zoneColor}
        />
        <KpiCard
          label="Classificação"
          value={classification.label.replace("Aquisição ", "")}
          icon={<GaugeIcon size={14} />}
          accentColor={zoneColor}
        />
      </div>

      {/* Termômetro / classificação */}
      <Card className="p-6 md:p-8 mb-6 df-fadeup df-delay-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
          <div className="heading text-xl font-semibold" style={{ color: zoneColor }}>
            {classification.label}
          </div>
          <div className="mono-num text-xs text-body">
            Termômetro de Aquisição · % Promoções sobre vendas
          </div>
        </div>
        <div className="pt-6 pb-2">
          <AcquisitionThermometer value={avg.pctPromocoes} />
        </div>
        <div className="flex justify-between mono-num text-[10px] text-body mt-2 mb-5">
          <span>0%</span>
          <span>5%</span>
          <span>7%</span>
          <span>11%</span>
          <span>15%</span>
          <span>30%+</span>
        </div>
        <p className="text-body text-sm leading-relaxed normal-case">
          {classification.headline} {classification.detail}
        </p>
      </Card>

      {/* Simulador — em destaque, logo após a classificação */}
      <Card className="p-6 md:p-8 mb-6 df-fadeup df-delay-2 border-2 border-brand relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-16 translate-x-16 bg-brand-xlight" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 mono-num text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full mb-4 bg-brand text-white">
            <Flame size={12} /> Simule o impacto agora
          </div>
          <div className="heading text-2xl font-semibold mb-1">
            E se você reduzisse as promoções?
          </div>
          <p className="text-body text-sm mb-7 normal-case">
            Compare abaixo alguns cenários automáticos ou arraste o controle para simular você
            mesmo um novo percentual de investimento em promoções.
          </p>

          {scenarios.length > 0 && (
            <div className="mb-8">
              <div className="mono-num text-[11px] uppercase tracking-wide text-body mb-3">
                Comparando com o que você gasta hoje ({formatPercentBR(avg.pctPromocoes)})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {scenarios.map((s) => (
                  <div key={s.target} className="rounded-xl p-4 bg-card-secondary border border-divider">
                    <div className="mono-num text-[11px] uppercase tracking-wide text-body mb-2">
                      Se reduzir para{" "}
                      <span className="font-semibold" style={{ color: ZONE_COLORS[classify(s.target).zone] }}>
                        {s.target}%
                      </span>
                    </div>
                    <div className="text-[11px] text-body mb-0.5">Por mês</div>
                    <div
                      className="heading text-base font-semibold mb-2"
                      style={{ color: s.deltaMensal >= 0 ? "var(--accent-big-pos)" : "var(--accent-neg)" }}
                    >
                      {s.deltaMensal >= 0 ? "+" : ""}
                      {formatBRL(s.deltaMensal)}
                    </div>
                    <div className="text-[11px] text-body mb-0.5">Por ano</div>
                    <div
                      className="heading text-base font-semibold"
                      style={{ color: s.deltaAnual >= 0 ? "var(--accent-big-pos)" : "var(--accent-neg)" }}
                    >
                      {s.deltaAnual >= 0 ? "+" : ""}
                      {formatBRL(s.deltaAnual)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mono-num text-[11px] uppercase tracking-wide text-body mb-3">
            Ou ajuste você mesmo
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="mono-num text-xs text-body">Novo % de Promoções</span>
            <span
              className="mono-num text-xl font-bold"
              style={{ color: ZONE_COLORS[classify(simPct).zone] }}
            >
              {simPct.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={0.1}
            value={simPct}
            onChange={(e) => setSimPct(parseFloat(e.target.value))}
            className="df-slider w-full mb-2 print:hidden"
          />
          <div className="flex justify-between mono-num text-[10px] text-body mb-8">
            <span>0%</span>
            <span>5%</span>
            <span>7%</span>
            <span>11%</span>
            <span>15%</span>
            <span>30%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4 bg-card-secondary border border-divider">
              <div className="mono-num text-[10px] uppercase tracking-wide text-body mb-1">
                Novo faturamento líquido / mês
              </div>
              <div className="heading text-xl font-semibold">{formatBRL(sim.novoFaturamento)}</div>
            </div>
            <div className="rounded-xl p-4 bg-card-secondary border border-divider">
              <div className="mono-num text-[10px] uppercase tracking-wide text-body mb-1">
                Diferença por mês
              </div>
              <div
                className="heading text-xl font-semibold"
                style={{ color: sim.deltaMensal >= 0 ? "var(--accent-big-pos)" : "var(--accent-neg)" }}
              >
                {sim.deltaMensal >= 0 ? "+" : ""}
                {formatBRL(sim.deltaMensal)}
              </div>
            </div>
            <div className="rounded-xl p-4 bg-card-secondary border border-divider">
              <div className="mono-num text-[10px] uppercase tracking-wide text-body mb-1">
                Diferença por ano
              </div>
              <div
                className="heading text-xl font-semibold"
                style={{ color: sim.deltaAnual >= 0 ? "var(--accent-big-pos)" : "var(--accent-neg)" }}
              >
                {sim.deltaAnual >= 0 ? "+" : ""}
                {formatBRL(sim.deltaAnual)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráficos */}
      <Card className="p-6 mb-6 df-fadeup df-delay-2">
        <div className="heading font-semibold mb-1">Taxas, Promoções e Receita Líquida por mês</div>
        <div className="text-body text-xs mb-2 normal-case">
          Comparação mês a mês dos três principais indicadores.
        </div>
        <MonthlyBarChart months={months} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card className="p-6 df-fadeup df-delay-3">
          <div className="heading font-semibold mb-1">Para onde vai o seu faturamento</div>
          <div className="text-body text-xs mb-2 normal-case">
            Distribuição média do total vendido nos 3 meses. Passe o mouse para ver o percentual
            de cada fatia.
          </div>
          <DistributionPie avg={avg} />
        </Card>
        <Card className="p-6 df-fadeup df-delay-3">
          <div className="heading font-semibold mb-1">Evolução dos 3 meses</div>
          <div className="text-body text-xs mb-2 normal-case">
            Faturamento líquido vs. % investido em promoções.
          </div>
          <TimelineChart months={months} />
        </Card>
      </div>

      {/* Análise inteligente */}
      <Card className="p-6 md:p-8 mb-6 df-fadeup df-delay-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-accent-pos" />
          <div className="heading text-lg font-semibold">Análise Inteligente</div>
        </div>
        <p className="text-body text-sm leading-relaxed mb-3 normal-case">{analysisText}</p>
        <p className="text-body text-sm leading-relaxed normal-case">{taxesText}</p>
      </Card>

      {/* Segunda análise */}
      <Card className="p-6 md:p-8 mb-6 df-fadeup df-delay-4">
        <div className="heading font-semibold mb-4">Quanto custa gerar uma venda</div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 grid grid-cols-3 gap-4 w-full">
            <div className="text-center">
              <div className="mono-num text-[10px] uppercase tracking-wide text-body mb-1">Ticket Médio</div>
              <div className="heading text-2xl font-semibold">{formatBRL(avg.ticketMedio)}</div>
            </div>
            <div className="text-center flex flex-col items-center justify-center text-body text-2xl">
              ×
            </div>
            <div className="text-center">
              <div className="mono-num text-[10px] uppercase tracking-wide text-body mb-1">% Promoções</div>
              <div className="heading text-2xl font-semibold" style={{ color: zoneColor }}>
                {formatPercentBR(avg.pctPromocoes)}
              </div>
            </div>
          </div>
          <ChevronRight className="hidden md:block shrink-0 text-body" size={22} />
          <div className="text-center shrink-0">
            <div className="mono-num text-[10px] uppercase tracking-wide text-body mb-1">Custo por venda</div>
            <div className="heading text-3xl font-semibold text-accent-neg">{formatBRL(cost)}</div>
          </div>
        </div>
        <p className="text-body text-xs leading-relaxed mt-5 normal-case">
          Para cada venda de {formatBRL(avg.ticketMedio)}, aproximadamente {formatBRL(cost)} são
          gastos apenas em Serviços e Promoções — antes de considerar taxas, ingredientes ou
          qualquer outro custo.
        </p>
      </Card>

      {/* Dados informados — tabela de conferência */}
      <Card className="p-6 md:p-8 mb-6 df-fadeup df-delay-4">
        <div className="heading font-semibold mb-1">Dados informados</div>
        <div className="text-body text-xs mb-4 normal-case">
          Os números que você preencheu em cada mês, para você conferir e ter segurança no que
          está sendo calculado.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-body font-medium text-xs uppercase tracking-wide">
                  Campo
                </th>
                <th className="text-right py-2 px-3 text-body font-medium text-xs uppercase tracking-wide">
                  Mês 1
                </th>
                <th className="text-right py-2 px-3 text-body font-medium text-xs uppercase tracking-wide">
                  Mês 2
                </th>
                <th className="text-right py-2 pl-3 text-body font-medium text-xs uppercase tracking-wide">
                  Mês 3
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Total de Vendas", format: (m: (typeof monthRows)[number]) => formatBRL(m.totalVendas) },
                { label: "Taxas e Comissões", format: (m: (typeof monthRows)[number]) => formatBRL(m.taxasComissoes) },
                { label: "Serviços e Promoções", format: (m: (typeof monthRows)[number]) => formatBRL(m.servicosPromocoes) },
                { label: "Ajustes", format: (m: (typeof monthRows)[number]) => formatBRL(m.ajustes) },
                { label: "Ticket Médio", format: (m: (typeof monthRows)[number]) => formatBRL(m.ticketMedio) },
                {
                  label: "Faturamento Líquido (calculado)",
                  format: (m: (typeof monthRows)[number]) => formatBRL(m.faturamentoLiquido),
                },
                {
                  label: "% Taxas (calculado)",
                  format: (m: (typeof monthRows)[number]) => formatPercentBR(m.pctTaxas),
                },
                {
                  label: "% Promoções (calculado)",
                  format: (m: (typeof monthRows)[number]) => formatPercentBR(m.pctPromocoes),
                },
              ].map((row) => (
                <tr key={row.label} className="border-b border-divider">
                  <td className="py-2 pr-4 text-heading font-medium whitespace-nowrap">{row.label}</td>
                  {monthRows.map((m, i) => (
                    <td key={i} className="text-right py-2 px-3 mono-num text-body whitespace-nowrap">
                      {row.format(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recomendações */}
      <Card className="p-6 md:p-8 mb-6 df-fadeup df-delay-4">
        <div className="heading font-semibold mb-4">Recomendações para os próximos 90 dias</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recs.map((r, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl bg-card-secondary border border-divider">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-accent-pos" />
              <div>
                <div className="text-sm font-semibold mb-0.5 text-heading">{r.title}</div>
                <div className="text-body text-xs leading-relaxed normal-case">{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA consultoria */}
      <Card className="p-8 md:p-10 text-center df-fadeup df-delay-4 border-none" style={{ background: "var(--brand)" }}>
        {!sent ? (
          <>
            <div className="heading text-2xl font-semibold mb-2 text-[#f9f9f9]">
              Quer transformar este diagnóstico em um plano de ação?
            </div>
            <p className="text-sm mb-6 max-w-lg mx-auto text-white/85 normal-case">
              Nossa consultoria ajuda restaurantes a encontrar o ponto ideal de investimento em
              promoções dentro do iFood — sem abrir mão de volume de vendas.
            </p>
            <Button
              variant="dark"
              size="lg"
              onClick={() => {
                window.open(CONSULTANT_LINK, "_blank");
                setSent(true);
              }}
              className="mx-auto print:hidden"
            >
              <MessageCircle size={16} /> Quero falar com um consultor
            </Button>
          </>
        ) : (
          <>
            <CheckCircle2 size={28} className="mx-auto mb-3 text-white" />
            <div className="heading text-xl font-semibold mb-1 text-white">
              Recebemos seu pedido, {firstName}.
            </div>
            <p className="text-sm text-white/85 normal-case">
              Nosso time vai te procurar pelo telefone {lead.phone} em breve.
            </p>
          </>
        )}
      </Card>

      <div className="flex items-start gap-2.5 mt-6 p-4 rounded-xl bg-card-secondary border border-divider">
        <Info size={14} className="mt-0.5 shrink-0 text-muted" />
        <p className="text-[11px] leading-relaxed text-body-secondary normal-case">
          Este diagnóstico tem caráter informativo e educacional, elaborado exclusivamente a
          partir dos dados informados por você. Ele não substitui uma consultoria contábil,
          financeira ou jurídica. Não nos responsabilizamos por decisões, mudanças operacionais ou
          resultados financeiros decorrentes de ações tomadas com base apenas neste relatório, sem
          acompanhamento profissional adequado.
        </p>
      </div>

      <div className="text-center mt-8 print:hidden">
        <Button variant="ghost" size="sm" onClick={onRestart}>
          Refazer diagnóstico
        </Button>
      </div>
    </div>
  );
}
