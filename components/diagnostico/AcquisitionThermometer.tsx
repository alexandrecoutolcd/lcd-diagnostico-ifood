import { clamp } from "@/lib/calculations";

interface AcquisitionThermometerProps {
  value: number;
  max?: number;
  markers?: number[];
  height?: number;
  showMarkerLabel?: boolean;
}

/**
 * Barra segmentada nas 5 zonas de aquisição (conservadora -> descontrolada).
 * É o elemento de assinatura do produto: aparece na classificação e
 * reaparece, com o mesmo espectro de cores, como o próprio controle do simulador.
 */
export function AcquisitionThermometer({
  value,
  max = 30,
  markers = [5, 7, 11, 15],
  height = 14,
  showMarkerLabel = true,
}: AcquisitionThermometerProps) {
  const pct = clamp((value / max) * 100, 0, 100);
  const gradient = `linear-gradient(to right,
    var(--zone-1) 0%, var(--zone-1) ${(5 / max) * 100}%,
    var(--zone-2) ${(5 / max) * 100}%, var(--zone-2) ${(7 / max) * 100}%,
    var(--zone-3) ${(7 / max) * 100}%, var(--zone-3) ${(11 / max) * 100}%,
    var(--zone-4) ${(11 / max) * 100}%, var(--zone-4) ${(15 / max) * 100}%,
    var(--zone-5) ${(15 / max) * 100}%, var(--zone-5) 100%)`;

  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-full overflow-hidden"
        style={{ height, background: gradient }}
      >
        {markers.map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 w-px bg-white/40"
            style={{ left: `${(m / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="relative w-full h-0">
        <div
          className="df-thermo-marker absolute -top-[22px] flex flex-col items-center"
          style={{ left: `calc(${pct}% - 1px)`, transform: "translateX(-50%)" }}
        >
          {showMarkerLabel && (
            <div className="mono-num text-[11px] font-semibold px-1.5 py-0.5 rounded mb-1 whitespace-nowrap bg-heading text-bg">
              {value.toFixed(1)}%
            </div>
          )}
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "6px solid var(--heading)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
