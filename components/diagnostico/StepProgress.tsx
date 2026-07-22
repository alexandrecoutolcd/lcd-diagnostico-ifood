const STEPS = ["Cadastro", "Dados", "Processando", "Resultado"];

export function StepProgress({ current }: { current: number }) {
  return (
    <div className="max-w-md mx-auto flex items-center gap-2 mb-2">
      {STEPS.map((s, i) => (
        <div key={s} className="flex-1">
          <div className="h-1.5 rounded-full overflow-hidden bg-border">
            <div
              className="h-full rounded-full transition-all duration-500 bg-accent-pos"
              style={{ width: i <= current ? "100%" : "0%" }}
            />
          </div>
          <div className="mono-num text-[10px] mt-1.5 text-body uppercase tracking-wide text-center">
            {s}
          </div>
        </div>
      ))}
    </div>
  );
}
