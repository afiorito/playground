import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  color?: "pink" | "cyan" | "yellow" | "green" | "orange";
  className?: string;
}

const colorMap = {
  pink: "neon-pink",
  cyan: "neon-cyan",
  yellow: "neon-yellow",
  green: "neon-green",
  orange: "neon-orange",
};

export function StatCard({
  label,
  value,
  sublabel,
  color = "cyan",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border bg-surface p-4 text-center",
        className,
      )}
    >
      <div className={cn("text-3xl font-mono font-bold", colorMap[color])}>
        {value}
      </div>
      <div className="text-sm font-medium mt-1">{label}</div>
      {sublabel && <div className="text-xs text-muted mt-0.5">{sublabel}</div>}
    </div>
  );
}
