"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthsWithDerived } from "@/lib/calculations";
import { MonthData } from "@/lib/types";

export function TimelineChart({ months }: { months: MonthData[] }) {
  const data = monthsWithDerived(months).map((m, i) => ({
    name: `Mês ${i + 1}`,
    "Faturamento Líquido": Math.round(m.faturamentoLiquido),
    "% Promoções": Number(m.pctPromocoes.toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "var(--body)" }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: "var(--body)" }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: "var(--body)" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            color: "var(--heading)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--body)" }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="Faturamento Líquido"
          stroke="var(--zone-2)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="% Promoções"
          stroke="var(--zone-4)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          strokeDasharray="4 3"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
