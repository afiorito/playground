import { PlaceCard } from "@/components/places/place-card";
import type { PlaceStats } from "@/types";

interface LeaderboardListProps {
  places: PlaceStats[];
}

export function LeaderboardList({ places }: LeaderboardListProps) {
  // Sort by avg rating descending, only include visited places
  const ranked = places
    .filter((p) => p.is_visited && p.avg_rating != null)
    .sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));

  if (ranked.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-4xl mb-4">🏆</p>
        <p className="text-lg">No ratings yet!</p>
        <p>Visit some spots and rate them to see the leaderboard.</p>
      </div>
    );
  }

  const ranks: number[] = [];
  for (let i = 0; i < ranked.length; i++) {
    if (i === 0) {
      ranks.push(1);
    } else if (ranked[i].avg_rating === ranked[i - 1].avg_rating) {
      ranks.push(ranks[i - 1]);
    } else {
      ranks.push(ranks[i - 1] + 1);
    }
  }

  return (
    <div className="space-y-3">
      {ranked.map((place, index) => (
        <PlaceCard
          key={place.id}
          place={place}
          variant="leaderboard"
          rank={ranks[index]}
        />
      ))}
    </div>
  );
}
