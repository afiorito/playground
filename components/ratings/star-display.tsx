import { cn } from "@/lib/utils/cn";
import { Star, StarHalf } from "lucide-react";

interface StarDisplayProps {
  rating: number;
  size?: number;
  className?: string;
}

export function StarDisplay({ rating, size = 16, className }: StarDisplayProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="fill-neon-yellow text-neon-yellow"
        />
      ))}
      {hasHalf && (
        <StarHalf
          size={size}
          className="fill-neon-yellow text-neon-yellow"
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-surface-border"
        />
      ))}
    </div>
  );
}
