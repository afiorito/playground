import { cn } from "@/lib/utils/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-neon-pink text-white hover:shadow-[0_0_15px_var(--neon-pink)] active:shadow-[0_0_25px_var(--neon-pink)] disabled:opacity-50",
  secondary:
    "border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_10px_var(--neon-cyan)] disabled:opacity-50",
  ghost:
    "text-muted hover:text-foreground hover:bg-surface disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
