import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface StatsGridProps {
  children: ReactNode;
  className?: string;
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
