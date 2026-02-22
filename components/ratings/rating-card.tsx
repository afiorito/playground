import { StarDisplay } from "@/components/ratings/star-display";
import { User } from "lucide-react";
import type { RatingWithProfile } from "@/types";

interface RatingCardProps {
  rating: RatingWithProfile;
}

export function RatingCard({ rating }: RatingCardProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rating.profiles?.avatar_url ? (
            <img
              src={rating.profiles.avatar_url}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-border flex items-center justify-center">
              <User size={14} className="text-muted" />
            </div>
          )}
          <span className="text-sm font-medium">
            {rating.profiles?.display_name || "Anonymous"}
          </span>
        </div>
        <StarDisplay rating={rating.score} size={14} />
      </div>

      {rating.review && (
        <p className="text-sm text-foreground/80">{rating.review}</p>
      )}

      {rating.photo_url && (
        <img
          src={rating.photo_url}
          alt="Rating photo"
          className="rounded-lg w-full max-h-64 object-cover"
        />
      )}

      <p className="text-xs text-muted">
        {new Date(rating.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
