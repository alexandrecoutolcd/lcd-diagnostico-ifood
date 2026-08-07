"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatBRL } from "@/lib/format";
import { Averages } from "@/lib/types";

export function DistributionPie({ avg }: { avg: Averages }) {
  const raw = [
    { name: "Plataforma", value: Math.max(avg.taxasComissoes, 0), color: "var(--zone-1)" },
    { name: "Promoções", value: Math.max(avg.servicosPromocoes, 0), color: "var(--zone-4)" },
    { name: "Ajustes", value: Math.max(-avg.ajustes, 0), color: "var(--gray-300)" },
    { name: "Receita líquida", value: Math.max(avg.faturamentoLiquido, 0), color: "var(--zone-2)" },
  ];
  const total = raw.reduce((s, d) => s + d.value, 0) || 1;
  const data = raw.map((d) => ({ ...d, pct: (d.value / total) * 100 }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={92} paddingAngle={2}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} stroke="var(--card)" strokeWidth={2} />
          ))}
        </Pie>
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--body)" }} />
        <Tooltip
          formatter={(value: number, name: string, entry: any) => [
            `${formatBRL(value)} · ${entry?.payload?.pct?.toFixed(1)}%`,
            name,
          ]}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            color: "var(--heading)",
          }}
          itemStyle={{ color: "var(--heading)" }}
          labelStyle={{ color: "var(--heading)", fontWeight: 600 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
