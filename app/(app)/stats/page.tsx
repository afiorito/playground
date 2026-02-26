"use client";

import { usePlaceStats } from "@/lib/hooks/use-place-stats";
import { useUserStats } from "@/lib/hooks/use-user-stats";
import { computeTripStats } from "@/lib/utils/stats";
import { StatCard } from "@/components/stats/stat-card";
import { StatsGrid } from "@/components/stats/stats-grid";
import { TripSummaryCard } from "@/components/stats/trip-summary-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function StatsPage() {
  const { stats: placeStats, isLoading: placesLoading } = usePlaceStats();
  const { stats: userStats, isLoading: usersLoading } = useUserStats();

  if (placesLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const tripStats = computeTripStats(placeStats, userStats);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl sm:text-3xl neon-green">
        Trip Stats
      </h1>

      {/* Trip summary card */}
      <div>
        <h2 className="font-display text-lg neon-pink mb-3">
          Trip Summary Card
        </h2>
        <TripSummaryCard stats={tripStats} />
      </div>

      <StatsGrid>
        <StatCard
          label="Stops Visited"
          value={`${tripStats.visitedStops}/${tripStats.totalStops}`}
          color="cyan"
        />
        <StatCard
          label="Total Ratings"
          value={tripStats.totalRatings}
          color="yellow"
        />
        <StatCard
          label="Avg Rating"
          value={tripStats.overallAvgRating?.toFixed(1) ?? "—"}
          color="green"
        />
        {tripStats.mostGenerousRater && (
          <StatCard
            label="Most Generous"
            value={tripStats.mostGenerousRater.avg.toFixed(1)}
            sublabel={tripStats.mostGenerousRater.name}
            color="pink"
          />
        )}
        {tripStats.harshestCritic && (
          <StatCard
            label="Harshest Critic"
            value={tripStats.harshestCritic.avg.toFixed(1)}
            sublabel={tripStats.harshestCritic.name}
            color="orange"
          />
        )}
        <StatCard
          label="Trip Progress"
          value={`${tripStats.tripProgress.toFixed(0)}%`}
          color="green"
        />
      </StatsGrid>

      {/* User rankings */}
      {userStats.length > 0 && (
        <div>
          <h2 className="font-display text-lg neon-cyan mb-3">
            Rater Rankings
          </h2>
          <div className="space-y-2">
            {userStats.map((user, i) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-surface-border bg-surface p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted w-6">
                    #{i + 1}
                  </span>
                  <span className="font-medium">
                    {user.display_name || "Anonymous"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted">
                    {user.total_ratings} ratings
                  </span>
                  <span className="font-mono text-neon-yellow">
                    avg {user.avg_score_given?.toFixed(1) ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
