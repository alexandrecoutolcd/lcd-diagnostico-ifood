import { z } from "zod";
import { FATURAMENTO_OPTIONS, FUNCAO_OPTIONS } from "./options";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  email: z.string().trim().min(1, "Informe seu e-mail").email("Digite um e-mail válido"),
  phone: z
    .string()
    .trim()
    .min(1, "Informe seu telefone")
    .refine((v) => {
      const digits = onlyDigits(v);
      return digits.length === 10 || digits.length === 11;
    }, "Informe DDD + telefone, sem o +55 (10 ou 11 números)"),
  faturamento: z.enum(FATURAMENTO_OPTIONS, {
    errorMap: () => ({ message: "Selecione uma faixa de faturamento" }),
  }),
  funcao: z.enum(FUNCAO_OPTIONS, {
    errorMap: () => ({ message: "Selecione sua função" }),
  }),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
