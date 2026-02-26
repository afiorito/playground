"use client";

import { PlaceCard } from "@/components/places/place-card";
import { PlaceTimeline } from "@/components/places/place-timeline";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePlaceStats } from "@/lib/hooks/use-place-stats";
import { ExternalLink } from "lucide-react";

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
      <h1 className="font-display text-2xl sm:text-3xl neon-cyan mb-2">
        The Roadmap
      </h1>

      <div className="text-sm text-muted mb-6">
        <a
          href="https://maps.app.goo.gl/jGt9iruDxP4QrstF7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
        >
          <ExternalLink size={12} />
          Hot Diggity Map
        </a>
      </div>

      {stats.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-4">🌭</p>
          <p className="text-lg">No stops on the roadmap yet!</p>
          <p>The trip organizer needs to add some hot dog destinations.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {stats.map((place, index) => (
            <div key={place.id} className="flex gap-3">
              <PlaceTimeline
                isVisited={place.is_visited}
                isNext={index === nextIndex}
                isFirst={index === 0}
                isLast={index === stats.length - 1}
              />
              <div className="flex-1 min-w-0 pb-4">
                <PlaceCard place={place} isNext={index === nextIndex} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
