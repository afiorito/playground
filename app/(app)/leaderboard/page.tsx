"use client";

import { usePlaceStats } from "@/lib/hooks/use-place-stats";
import { LeaderboardList } from "@/components/stats/leaderboard-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LeaderboardPage() {
  const { stats, isLoading } = usePlaceStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl sm:text-3xl neon-yellow">
        Leaderboard
      </h1>
      <LeaderboardList places={stats} />
    </div>
  );
}
