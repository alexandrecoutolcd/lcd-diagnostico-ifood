import { Card } from "@/components/ui/card";

const ROWS = [
  { label: "Total de vendas do período", tag: "Total de Vendas" },
  { label: "Comissão da plataforma", tag: "Taxas e Comissões" },
  { label: "Investimento em campanhas / cupons", tag: "Serviços e Promoções" },
  { label: "Estornos e cancelamentos", tag: "Ajustes" },
  { label: "Valor médio por pedido", tag: "Ticket Médio" },
];

export function FinderIllustration() {
  return (
    <Card className="p-5 md:p-6">
      <div className="heading text-sm font-semibold mb-1">Onde encontrar cada campo</div>
      <p className="text-body text-xs mb-4 leading-relaxed normal-case">
        Exemplo ilustrativo da tela de Financeiro do seu marketplace de entregas. Os nomes exatos
        podem variar um pouco — procure pelos totais equivalentes do período.
      </p>
      <div className="rounded-xl p-4 space-y-2.5 bg-bg">
        {ROWS.map((row) => (
          <div
            key={row.tag}
            className="flex flex-col gap-1.5 rounded-lg px-3 py-2.5 border border-dashed border-border"
          >
            <span className="text-xs text-body normal-case">{row.label}</span>
            <span className="mono-num text-[10px] font-semibold px-2 py-1 rounded self-start bg-accent-pos text-white whitespace-nowrap">
              → {row.tag}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
