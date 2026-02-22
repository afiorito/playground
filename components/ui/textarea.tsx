import { cn } from "@/lib/utils/cn";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted resize-y min-h-[80px]",
        "focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_8px_rgba(0,240,255,0.3)]",
        "transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
