"use client";

import { cn } from "@/lib/utils/cn";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function StarRating({ value, onChange, className }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={28}
            className={cn(
              "transition-colors",
              (hovered || value) >= star
                ? "fill-neon-yellow text-neon-yellow"
                : "text-surface-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}
