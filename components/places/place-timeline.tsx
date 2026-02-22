import { cn } from "@/lib/utils/cn";

interface PlaceTimelineProps {
  isVisited: boolean;
  isNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export function PlaceTimeline({
  isVisited,
  isNext,
  isFirst,
  isLast,
}: PlaceTimelineProps) {
  return (
    <div className="flex flex-col items-center">
      {!isFirst && (
        <div
          className={cn(
            "w-0.5 h-6",
            isVisited ? "bg-neon-green" : "bg-surface-border",
          )}
        />
      )}
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 flex-shrink-0",
          isVisited
            ? "bg-neon-green border-neon-green shadow-[0_0_8px_var(--neon-green)]"
            : isNext
              ? "bg-neon-orange border-neon-orange shadow-[0_0_8px_var(--neon-orange)]"
              : "bg-surface border-surface-border",
        )}
      />
      {!isLast && (
        <div
          className={cn(
            "w-0.5 flex-1 min-h-6",
            isVisited ? "bg-neon-green" : "bg-surface-border",
          )}
        />
      )}
    </div>
  );
}
