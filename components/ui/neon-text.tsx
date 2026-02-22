import { cn } from "@/lib/utils/cn";

type NeonColor = "pink" | "cyan" | "yellow" | "green" | "orange";

interface NeonTextProps {
  color?: NeonColor;
  children: React.ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export function NeonText({
  color = "pink",
  children,
  className,
  as: Tag = "span",
}: NeonTextProps) {
  return (
    <Tag className={cn(`neon-${color}`, className)}>
      {children}
    </Tag>
  );
}
