import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted",
        "focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_8px_rgba(0,240,255,0.3)]",
        "transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
