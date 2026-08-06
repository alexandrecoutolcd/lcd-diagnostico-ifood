import { z } from "zod";
import { FATURAMENTO_OPTIONS, FUNCAO_OPTIONS } from "./options";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  email: z.string().trim().min(1, "Informe seu e-mail").email("Digite um e-mail válido"),
  phone: z
    .string()
    .trim()
    .min(1, "Informe seu telefone")
    .regex(
      /^[0-9]+$/,
      "Digite apenas números, com DDD e telefone (sem espaços, parênteses ou traços)"
    )
    .length(11, "Informe DDD + telefone com 11 dígitos (ex.: 11987654321)"),
  faturamento: z.enum(FATURAMENTO_OPTIONS, {
    errorMap: () => ({ message: "Selecione uma faixa de faturamento" }),
  }),
  funcao: z.enum(FUNCAO_OPTIONS, {
    errorMap: () => ({ message: "Selecione sua função" }),
  }),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
