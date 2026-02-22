import { cn } from "@/lib/utils/cn";

type BadgeVariant = "visited" | "next" | "upcoming" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  visited:
    "bg-neon-green/15 text-neon-green border-neon-green/40",
  next:
    "bg-neon-orange/15 text-neon-orange border-neon-orange/40 animate-neon-pulse",
  upcoming:
    "bg-surface-border/50 text-muted border-surface-border",
  default:
    "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
