"use client";

import { ArrowRight, BadgeCheck, Percent, Play, Store, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-10 md:pt-20 pb-24">
      <div className="df-fadeup">
        <div className="inline-flex items-center gap-2 mono-num text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-7 border border-border text-body">
          <Store size={13} /> Para restaurantes que vendem pelo iFood
        </div>
        <h1 className="heading text-[2.3rem] leading-[1.08] md:text-6xl font-semibold mb-6 max-w-3xl">
          O iFood não é o seu problema. A forma como você usa promoções pode ser.
        </h1>
        <p className="text-body text-lg md:text-xl max-w-2xl leading-relaxed mb-10 normal-case">
          Em 5 minutos, transforme o extrato financeiro do seu restaurante em um diagnóstico que
          mostra exatamente onde seu lucro está sendo consumido — e quanto isso custa por mês.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" onClick={onStart}>
            Iniciar Diagnóstico <ArrowRight size={18} />
          </Button>
          <span className="text-body text-sm">Grátis · leva cerca de 5 minutos</span>
        </div>
      </div>

      <div className="df-fadeup df-delay-1 mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: <Percent size={18} />,
            title: "Sua tese em números",
            text: "Descubra o percentual exato investido em Serviços e Promoções nos últimos 3 meses.",
          },
          {
            icon: <TrendingDown size={18} />,
            title: "O limite invisível",
            text: "Todo investimento em aquisição de clientes precisa de um teto. Mostramos onde está o seu.",
          },
          {
            icon: <BadgeCheck size={18} />,
            title: "Clareza, não planilha",
            text: "Um diagnóstico visual e direto — sem fórmulas, sem células, sem confusão.",
          },
        ].map((f, i) => (
          <Card key={i}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-4 bg-border text-accent-pos">
              {f.icon}
            </div>
            <div className="heading text-sm font-semibold mb-1.5">{f.title}</div>
            <div className="text-body text-sm leading-relaxed normal-case">{f.text}</div>
          </Card>
        ))}
      </div>

      <div className="df-fadeup df-delay-2 mt-16">
        <div className="mono-num text-xs uppercase tracking-wider text-body mb-3">Antes de começar</div>
        <Card className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <button className="group relative w-full md:w-72 aspect-video rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-bg border border-border">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(0,187,249,0.25), transparent 60%)",
              }}
            />
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 bg-heading">
              <Play size={20} className="text-bg" fill="currentColor" />
            </div>
            <span className="absolute bottom-3 left-3 mono-num text-[11px] text-heading">
              1 min · demonstração
            </span>
          </button>
          <div>
            <div className="heading font-semibold text-lg mb-2">Como preencher seus dados</div>
            <p className="text-body text-sm leading-relaxed max-w-md normal-case">
              Assista a uma explicação rápida de onde encontrar cada número dentro do Financeiro do
              iFood. Na próxima etapa, também mostramos um exemplo ilustrado passo a passo.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
