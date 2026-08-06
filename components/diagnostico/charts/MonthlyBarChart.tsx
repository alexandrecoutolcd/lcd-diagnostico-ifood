"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthsWithDerived } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";
import { MonthData } from "@/lib/types";

export function MonthlyBarChart({ months }: { months: MonthData[] }) {
  const data = monthsWithDerived(months).map((m, i) => ({
    name: `Mês ${i + 1}`,
    Taxas: Math.round(m.taxasComissoes),
    Promoções: Math.round(m.servicosPromocoes),
    "Receita Líquida": Math.round(m.faturamentoLiquido),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "var(--body)" }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11, fill: "var(--body)" }} axisLine={false} tickLine={false} width={56} />
        <Tooltip
          formatter={(v: number) => formatBRL(v)}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            color: "var(--heading)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--body)" }} />
        <Bar dataKey="Taxas" fill="var(--zone-1)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Promoções" fill="var(--zone-4)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Receita Líquida" fill="var(--zone-2)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
