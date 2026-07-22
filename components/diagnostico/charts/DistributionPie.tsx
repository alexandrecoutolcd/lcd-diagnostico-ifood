"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatBRL } from "@/lib/format";
import { Averages } from "@/lib/types";

export function DistributionPie({ avg }: { avg: Averages }) {
  const data = [
    { name: "Plataforma", value: Math.max(avg.taxasComissoes, 0), color: "var(--zone-1)" },
    { name: "Promoções", value: Math.max(avg.servicosPromocoes, 0), color: "var(--zone-4)" },
    { name: "Ajustes", value: Math.max(avg.ajustes, 0), color: "var(--body)" },
    { name: "Receita líquida", value: Math.max(avg.faturamentoLiquido, 0), color: "var(--zone-2)" },
  ];

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
          formatter={(v: number) => formatBRL(v)}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 12,
            color: "var(--heading)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
