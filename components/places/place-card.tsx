"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { StarDisplay } from "@/components/ratings/star-display";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink } from "lucide-react";
import type { PlaceStats } from "@/types";

interface PlaceCardProps {
  place: PlaceStats;
  isNext?: boolean;
  variant?: "roadmap" | "leaderboard";
  rank?: number;
}

const medalColors: Record<number, string> = {
  1: "neon-yellow",
  2: "text-gray-300",
  3: "neon-orange",
};

export function PlaceCard({
  place,
  isNext,
  variant = "roadmap",
  rank,
}: PlaceCardProps) {
  const router = useRouter();

  const statusBadge = place.is_visited ? (
    <Badge variant="visited">Visited</Badge>
  ) : isNext ? (
    <Badge variant="next">Next Stop</Badge>
  ) : (
    <Badge variant="upcoming">Upcoming</Badge>
  );

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/place?id=${place.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/place?id=${place.id}`);
        }
      }}
      className={cn(
        "block rounded-xl border border-surface-border bg-surface p-4 transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] cursor-pointer",
        isNext && "border-neon-orange/50",
      )}
    >
      <div className="flex gap-4">
        {place.image_url ? (
          <img
            src={place.image_url}
            alt={place.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-surface-border flex items-center justify-center flex-shrink-0">
            <MapPin size={24} className="text-muted" />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {variant === "leaderboard" && rank != null && (
                <span
                  className={cn(
                    "text-lg font-bold font-mono",
                    rank <= 3
                      ? medalColors[rank]
                      : "text-muted",
                  )}
                >
                  #{rank}
                </span>
              )}
              <h3 className="font-semibold truncate">{place.name}</h3>
            </div>
            {statusBadge}
          </div>

          <p className="text-sm text-muted truncate flex items-center gap-1">
            <MapPin size={12} />
            {place.address}
          </p>

          {place.avg_rating != null && (
            <div className="flex items-center gap-2">
              <StarDisplay rating={place.avg_rating} />
              <span className="text-sm font-mono text-neon-yellow">
                {place.avg_rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted">
                ({place.rating_count} {place.rating_count === 1 ? "rating" : "ratings"})
              </span>
            </div>
          )}

          {place.google_maps_url && (
            <a
              href={place.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-sm text-neon-cyan hover:underline"
            >
              <ExternalLink size={12} />
              Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
