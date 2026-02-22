"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useRatings } from "@/lib/hooks/use-ratings";
import { RatingForm } from "@/components/ratings/rating-form";
import { RatingCard } from "@/components/ratings/rating-card";
import { StarDisplay } from "@/components/ratings/star-display";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Place, Rating } from "@/types";

function PlaceDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const supabase = useSupabase();
  const { user } = useAuth();
  const { ratings, isLoading: ratingsLoading } = useRatings(id);

  const { data: place, isLoading } = useQuery({
    queryKey: ["place", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .eq("id", id!)
        .single();

      if (error) throw error;
      return data as Place;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!id || !place) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">🌭</p>
        <p className="text-lg text-muted">
          This hot dog spot doesn&apos;t exist. Maybe it was a mirage.
        </p>
        <Link href="/roadmap" className="text-neon-cyan underline underline-offset-4 mt-4 inline-block">
          Back to Roadmap
        </Link>
      </div>
    );
  }

  const userRating = ratings.find((r) => r.user_id === user?.id) as Rating | undefined;
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : null;

  return (
    <div className="space-y-6">
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Roadmap
      </Link>

      {place.image_url && (
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-48 sm:h-64 object-cover rounded-xl"
        />
      )}

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-2xl sm:text-3xl neon-pink">
            {place.name}
          </h1>
          {ratings.length > 0 ? (
            <Badge variant="visited">Visited</Badge>
          ) : (
            <Badge variant="upcoming">Upcoming</Badge>
          )}
        </div>

        <p className="flex items-center gap-1 text-muted">
          <MapPin size={14} />
          {place.address}
        </p>

        {place.google_maps_url && (
          <a
            href={place.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-neon-cyan hover:underline"
          >
            <ExternalLink size={12} />
            Open in Google Maps
          </a>
        )}

        {place.description && (
          <p className="text-sm text-foreground/80">{place.description}</p>
        )}

        {avgRating != null && (
          <div className="flex items-center gap-2 pt-1">
            <StarDisplay rating={avgRating} size={20} />
            <span className="font-mono text-neon-yellow text-lg">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted">
              ({ratings.length} {ratings.length === 1 ? "rating" : "ratings"})
            </span>
          </div>
        )}
      </div>

      <div className="border border-surface-border rounded-xl bg-surface p-5">
        <h2 className="font-display text-lg neon-cyan mb-4">
          {userRating ? "Update Your Rating" : "Rate This Stop"}
        </h2>
        <RatingForm
          placeId={id}
          existingRating={userRating}
        />
      </div>

      <div>
        <h2 className="font-display text-lg neon-yellow mb-4">
          All Ratings ({ratings.length})
        </h2>
        {ratingsLoading ? (
          <LoadingSpinner />
        ) : ratings.length === 0 ? (
          <p className="text-muted text-center py-8">
            No ratings yet. Be the first to weigh in!
          </p>
        ) : (
          <div className="space-y-3">
            {ratings.map((rating) => (
              <RatingCard key={rating.id} rating={rating} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlacePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <PlaceDetailContent />
    </Suspense>
  );
}
