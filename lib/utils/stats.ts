import type { UserStats, PlaceStats } from "@/types";

export interface TripStatsData {
  totalStops: number;
  visitedStops: number;
  tripProgress: number;
  totalRatings: number;
  overallAvgRating: number | null;
  mostGenerousRater: { name: string; avg: number } | null;
  harshestCritic: { name: string; avg: number } | null;
  topRatedStop: { name: string; avg: number } | null;
  mostControversial: { name: string; range: number } | null;
  mostUnanimous: { name: string; range: number } | null;
}

export function computeTripStats(
  placeStats: PlaceStats[],
  userStats: UserStats[],
): TripStatsData {
  const totalStops = placeStats.length;
  const visitedStops = placeStats.filter((p) => p.is_visited).length;
  const tripProgress = totalStops > 0 ? (visitedStops / totalStops) * 100 : 0;
  const totalRatings = userStats.reduce((sum, u) => sum + u.total_ratings, 0);

  const usersWithRatings = userStats.filter(
    (u) => u.total_ratings > 0 && u.avg_score_given != null,
  );

  const overallAvg =
    usersWithRatings.length > 0
      ? usersWithRatings.reduce((sum, u) => sum + (u.avg_score_given ?? 0), 0) /
        usersWithRatings.length
      : null;

  const sorted = [...usersWithRatings].sort(
    (a, b) => (b.avg_score_given ?? 0) - (a.avg_score_given ?? 0),
  );

  const mostGenerousRater =
    sorted.length > 0
      ? {
          name: sorted[0].display_name || "Anonymous",
          avg: sorted[0].avg_score_given!,
        }
      : null;

  const harshestCritic =
    sorted.length > 0
      ? {
          name: sorted[sorted.length - 1].display_name || "Anonymous",
          avg: sorted[sorted.length - 1].avg_score_given!,
        }
      : null;

  const visitedWithRatings = placeStats.filter(
    (p) => p.is_visited && p.avg_rating != null,
  );
  const sortedPlaces = [...visitedWithRatings].sort(
    (a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0),
  );

  const topRatedStop =
    sortedPlaces.length > 0
      ? {
          name: sortedPlaces[0].name,
          avg: sortedPlaces[0].avg_rating!,
        }
      : null;

  // Most controversial = largest range between min & max rating (needs raw data)
  // For now we use rating_count as a proxy — most controversial = highest count with lowest avg
  const mostControversial = null;
  const mostUnanimous = null;

  return {
    totalStops,
    visitedStops,
    tripProgress,
    totalRatings,
    overallAvgRating: overallAvg,
    mostGenerousRater,
    harshestCritic,
    topRatedStop,
    mostControversial,
    mostUnanimous,
  };
}
