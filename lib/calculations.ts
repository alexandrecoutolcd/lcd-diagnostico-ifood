import {
  Averages,
  Classification,
  MonthData,
  MonthDerived,
  PlatformReference,
  Recommendation,
  SimulationResult,
} from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Faturamento Líquido, % Taxas e % Promoções de um único mês. */
export function monthDerived(month: MonthData): Omit<MonthDerived, keyof MonthData> {
  const { totalVendas, taxasComissoes, servicosPromocoes, ajustes } = month;
  const faturamentoLiquido = totalVendas - taxasComissoes - servicosPromocoes - ajustes;
  const pctTaxas = totalVendas > 0 ? (taxasComissoes / totalVendas) * 100 : 0;
  const pctPromocoes = totalVendas > 0 ? (servicosPromocoes / totalVendas) * 100 : 0;
  return { faturamentoLiquido, pctTaxas, pctPromocoes };
}

export function monthsWithDerived(months: MonthData[]): MonthDerived[] {
  return months.map((m) => ({ ...m, ...monthDerived(m) }));
}

/** Médias dos três meses - base de todo o restante do diagnóstico. */
export function averages(months: MonthData[]): Averages {
  const derived = monthsWithDerived(months);
  const avg = (key: keyof MonthDerived) =>
    derived.reduce((sum, m) => sum + (Number(m[key]) || 0), 0) / derived.length;

  return {
    totalVendas: avg("totalVendas"),
    taxasComissoes: avg("taxasComissoes"),
    servicosPromocoes: avg("servicosPromocoes"),
    ajustes: avg("ajustes"),
    ticketMedio: avg("ticketMedio"),
    faturamentoLiquido: avg("faturamentoLiquido"),
    pctTaxas: avg("pctTaxas"),
    pctPromocoes: avg("pctPromocoes"),
  };
}

/** Classificação da estratégia de aquisição, com base no %Promoções médio. */
export function classify(pctPromocoes: number): Classification {
  if (pctPromocoes <= 5) {
    return {
      key: "conservadora",
      label: "Aquisição Conservadora",
      zone: 1,
      headline: "Pouco investimento em aquisição.",
      detail:
        "Existe espaço para crescer investindo mais em Serviços e Promoções, se for feito com estratégia.",
    };
  }
  if (pctPromocoes <= 7) {
    return {
      key: "controlada",
      label: "Aquisição Controlada",
      zone: 2,
      headline: "Faixa considerada saudável.",
      detail:
        "Equivalente ao investimento de marketing utilizado por empresas maduras. Essa é a referência ideal.",
    };
  }
  if (pctPromocoes <= 11) {
    return {
      key: "moderada",
      label: "Aquisição Moderada",
      zone: 3,
      headline: "Investimento elevado, porém ainda controlado.",
      detail:
        "A empresa ainda possui espaço para crescer, mas o indicador exige acompanhamento constante.",
    };
  }
  if (pctPromocoes <= 15) {
    return {
      key: "agressiva",
      label: "Aquisição Agressiva",
      zone: 4,
      headline: "Investimento muito elevado.",
      detail:
        "Só faz sentido quando a loja é recém-aberta, está em expansão acelerada ou seguindo estratégia temporária. Caso contrário, começa a destruir margem.",
    };
  }
  return {
    key: "descontrolada",
    label: "Aquisição Descontrolada",
    zone: 5,
    headline: "O restaurante provavelmente está pagando para vender.",
    detail:
      "Grande parte do lucro está sendo consumida por Serviços e Promoções. Este é o principal alerta do diagnóstico.",
  };
}

/** Compara o %Taxas médio com os dois planos de referência do iFood. */
export function platformReference(pctTaxas: number): PlatformReference {
  const basico = 15.2;
  const full = 26.2;
  const nearest =
    Math.abs(pctTaxas - basico) <= Math.abs(pctTaxas - full)
      ? { nome: "Plano Básico", valor: basico }
      : { nome: "Plano Full", valor: full };
  const diff = pctTaxas - nearest.valor;
  return { ...nearest, diff, acimaDaReferencia: diff > 1.5 };
}

/** Quanto custa, em R$, gerar uma venda de ticket médio ao %Promoções atual. */
export function acquisitionCost(ticketMedio: number, pctPromocoes: number): number {
  return (Number(ticketMedio) || 0) * ((Number(pctPromocoes) || 0) / 100);
}

/** Simulador: recalcula o faturamento líquido para um novo %Promoções hipotético. */
export function simulate(avg: Averages, novoPctPromocoes: number): SimulationResult {
  const novoServico = avg.totalVendas * (novoPctPromocoes / 100);
  const novoFaturamento = avg.totalVendas - avg.taxasComissoes - novoServico - avg.ajustes;
  const deltaMensal = novoFaturamento - avg.faturamentoLiquido;
  return {
    novoServico,
    novoFaturamento,
    deltaMensal,
    deltaAnual: deltaMensal * 12,
  };
}

/**
 * Cenários automáticos do simulador: compara o %Promoções atual com alguns
 * patamares de referência mais baixos, mostrando de cara o quanto isso
 * mudaria o resultado - sem a pessoa precisar arrastar nada.
 */
export function autoSimulationScenarios(avg: Averages): (SimulationResult & { target: number })[] {
  const CANDIDATE_TARGETS = [10, 8, 5];
  const targets = CANDIDATE_TARGETS.filter((t) => t < avg.pctPromocoes - 0.05).slice(0, 3);
  return targets.map((target) => ({ target, ...simulate(avg, target) }));
}

/** Recomendações automáticas com base nos indicadores calculados. */
export function recommendations(
  avg: Averages,
  classification: Classification,
  platformRef: PlatformReference
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (classification.zone >= 4) {
    recs.push({
      title: "Repensar o investimento em promoções",
      detail:
        "Vale estruturar um plano para reavaliar, com calma, o quanto está sendo investido em campanhas e cupons — e se esse patamar ainda faz sentido para o momento atual do negócio.",
    });
    recs.push({
      title: "Revisar o cardápio",
      detail:
        "Itens com margem baixa sustentados por promoções pesadas costumam ser os principais responsáveis pela erosão do lucro. Reavalie preços, porções e o mix de produtos.",
    });
    recs.push({
      title: "Revisitar a gestão de CMV e financeira do restaurante",
      detail:
        "Antes de investir mais em aquisição, confirme se o Custo da Mercadoria Vendida e o controle financeiro do dia a dia estão saudáveis — promoção não corrige margem quebrada.",
    });
  }
  if (classification.zone >= 3) {
    recs.push({
      title: "Acompanhar o CAC mensalmente",
      detail:
        "Trate o valor investido em promoções por pedido como um Custo de Aquisição de Cliente — e defina um limite máximo aceitável.",
    });
    recs.push({
      title: "Revisar as campanhas ativas",
      detail:
        "Identifique quais promoções trazem clientes recorrentes e quais apenas subsidiam pedidos pontuais.",
    });
  }
  recs.push({
    title: "Migrar parte das vendas para canal próprio",
    detail: "Cada pedido feito fora do marketplace elimina a taxa e a promoção associadas a ele.",
  });
  if (avg.ticketMedio < 60) {
    recs.push({
      title: "Aumentar o ticket médio",
      detail: "Combos e itens de maior valor diluem o custo fixo da plataforma sobre cada pedido.",
    });
  }
  if (platformRef.acimaDaReferencia) {
    recs.push({
      title: "Revisar o plano contratado no iFood",
      detail: `Seu percentual de taxas está destoando da referência do ${platformRef.nome}. Vale confirmar as condições atuais.`,
    });
  }
  return recs;
}
