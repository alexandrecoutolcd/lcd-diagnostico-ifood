"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "./TopBar";
import { LandingScreen } from "./LandingScreen";
import { LeadFormScreen } from "./LeadFormScreen";
import { DataInputScreen } from "./DataInputScreen";
import { ProcessingScreen } from "./ProcessingScreen";
import { ResultsScreen } from "./ResultsScreen";
import { EMPTY_MONTH, EMPTY_UTM, Lead, MonthData, UtmParams } from "@/lib/types";

type Step = "landing" | "lead" | "input" | "processing" | "results";
const ORDER: Step[] = ["landing", "lead", "input", "processing", "results"];

export function DiagnosticoApp() {
  const [step, setStep] = useState<Step>("landing");
  const [lead, setLead] = useState<Lead | null>(null);
  const [utm, setUtm] = useState<UtmParams>(EMPTY_UTM);
  const [months, setMonths] = useState<MonthData[]>([
    { ...EMPTY_MONTH },
    { ...EMPTY_MONTH },
    { ...EMPTY_MONTH },
  ]);

  // Captura Link e UTMs da URL uma única vez, ao carregar a página.
  // Não são preenchidos pelo usuário - vêm de quem trouxe o tráfego.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setUtm({
      link: window.location.href,
      utm_source: params.get("utm_source") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_content: params.get("utm_content") || "",
    });
  }, []);

  const goBack = useCallback(() => {
    const idx = ORDER.indexOf(step);
    if (idx > 0 && step !== "processing" && step !== "results") setStep(ORDER[idx - 1]);
  }, [step]);

  function restart() {
    setMonths([{ ...EMPTY_MONTH }, { ...EMPTY_MONTH }, { ...EMPTY_MONTH }]);
    setStep("input");
  }

  return (
    <>
      <TopBar showBack={step === "lead" || step === "input"} onBack={goBack} />

      {step === "landing" && <LandingScreen onStart={() => setStep("lead")} />}

      {step === "lead" && (
        <LeadFormScreen
          utm={utm}
          onNext={(leadData) => {
            setLead(leadData);
            setStep("input");
          }}
        />
      )}

      {step === "input" && (
        <DataInputScreen months={months} setMonths={setMonths} onNext={() => setStep("processing")} />
      )}

      {step === "processing" && <ProcessingScreen onDone={() => setStep("results")} />}

      {step === "results" && lead && (
        <ResultsScreen lead={lead} months={months} onRestart={restart} />
      )}
    </>
  );
}
