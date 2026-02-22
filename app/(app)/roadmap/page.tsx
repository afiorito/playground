"use client";

import { usePlaceStats } from "@/lib/hooks/use-place-stats";
import { PlaceCard } from "@/components/places/place-card";
import { PlaceTimeline } from "@/components/places/place-timeline";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function RoadmapPage() {
  const { stats, isLoading } = usePlaceStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Find the first unvisited place (the "next stop")
  const nextIndex = stats.findIndex((s) => !s.is_visited);

  return (
    <div className="space-y-2">
      <h1 className="font-display text-2xl sm:text-3xl neon-cyan mb-6">
        The Roadmap
      </h1>

      {stats.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-4">🌭</p>
          <p className="text-lg">No stops on the roadmap yet!</p>
          <p>The trip organizer needs to add some hot dog destinations.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {stats.map((place, index) => (
            <div key={place.id} className="flex gap-4">
              <PlaceTimeline
                isVisited={place.is_visited}
                isNext={index === nextIndex}
                isFirst={index === 0}
                isLast={index === stats.length - 1}
              />
              <div className="flex-1 pb-4">
                <PlaceCard
                  place={place}
                  isNext={index === nextIndex}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
