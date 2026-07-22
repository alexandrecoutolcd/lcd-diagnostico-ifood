import { Card } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export function KpiCard({ label, value, icon, accentColor }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="mono-num text-[10px] uppercase tracking-wide text-body">{label}</span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center bg-bg"
          style={{ color: accentColor || "var(--accent-pos)" }}
        >
          {icon}
        </div>
      </div>
      <div className="heading text-2xl font-semibold">{value}</div>
    </Card>
  );
}
