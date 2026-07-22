"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowRight, ClipboardList, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepProgress } from "./StepProgress";
import { leadSchema, type LeadFormValues } from "@/lib/validation";
import { FATURAMENTO_OPTIONS, FUNCAO_OPTIONS } from "@/lib/options";
import { EMPTY_UTM, Lead, UtmParams } from "@/lib/types";

interface LeadFormScreenProps {
  utm: UtmParams;
  onNext: (lead: Lead) => void;
}

export function LeadFormScreen({ utm, onNext }: LeadFormScreenProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  async function onSubmit(values: LeadFormValues) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...(utm || EMPTY_UTM) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao enviar seus dados.");
      }
      onNext(values);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Não foi possível salvar seus dados agora."
      );
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-10 pb-24">
      <StepProgress current={0} />
      <Card className="df-fadeup mt-8 p-7 md:p-9">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5 bg-border text-accent-pos">
          <ClipboardList size={18} />
        </div>
        <h2 className="heading text-2xl font-semibold mb-2">Antes de começar, quem é você?</h2>
        <p className="text-body text-sm mb-7 normal-case">
          Usamos isso apenas para te enviar o diagnóstico e, se fizer sentido, uma conversa com
          nossa consultoria.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Nome" error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 text-sm bg-bg border border-border rounded-xl text-heading focus:outline-none focus:border-accent-pos focus:ring-2 focus:ring-accent-pos/20"
            />
          </Field>

          <Field label="E-mail" error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              placeholder="voce@seurestaurante.com"
              className="w-full px-4 py-3 text-sm bg-bg border border-border rounded-xl text-heading focus:outline-none focus:border-accent-pos focus:ring-2 focus:ring-accent-pos/20"
            />
          </Field>

          <Field label="Telefone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              inputMode="numeric"
              placeholder="11 98765-4321"
              className="w-full px-4 py-3 text-sm bg-bg border border-border rounded-xl text-heading focus:outline-none focus:border-accent-pos focus:ring-2 focus:ring-accent-pos/20"
            />
            <div className="flex items-start gap-1.5 mt-1.5 text-[11px] text-body normal-case">
              <Info size={12} className="mt-0.5 shrink-0 text-accent-pos" />
              Apenas DDD + número, sem o +55 (ex.: 11 98765-4321).
            </div>
          </Field>

          <Field label="Faturamento" error={errors.faturamento?.message}>
            <select
              {...register("faturamento")}
              defaultValue=""
              className="w-full px-4 py-3 text-sm bg-bg border border-border rounded-xl text-heading focus:outline-none focus:border-accent-pos focus:ring-2 focus:ring-accent-pos/20 appearance-none"
            >
              <option value="" disabled>
                Selecione sua faixa de faturamento
              </option>
              {FATURAMENTO_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Função" error={errors.funcao?.message}>
            <select
              {...register("funcao")}
              defaultValue=""
              className="w-full px-4 py-3 text-sm bg-bg border border-border rounded-xl text-heading focus:outline-none focus:border-accent-pos focus:ring-2 focus:ring-accent-pos/20 appearance-none"
            >
              <option value="" disabled>
                Selecione sua função
              </option>
              {FUNCAO_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          {submitError && (
            <div className="text-sm flex items-start gap-2 text-accent-neg normal-case">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {submitError}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-3">
            {isSubmitting ? "Enviando..." : "Continuar"} <ArrowRight size={16} />
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium mono-num uppercase tracking-wide text-body mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <div className="text-accent-neg text-xs mt-1 normal-case">{error}</div>}
    </div>
  );
}
