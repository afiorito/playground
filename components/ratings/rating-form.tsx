"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { StarRating } from "@/components/ratings/star-rating";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/utils/storage";
import { toast } from "sonner";
import type { Rating } from "@/types";

interface RatingFormProps {
  placeId: string;
  existingRating?: Rating | null;
  onSuccess?: () => void;
}

export function RatingForm({ placeId, existingRating, onSuccess }: RatingFormProps) {
  const supabase = useSupabase();
  const { user } = useAuth();
  const [score, setScore] = useState(existingRating?.score ?? 0);
  const [review, setReview] = useState(existingRating?.review ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingRating) {
      setScore(existingRating.score);
      setReview(existingRating.review ?? "");
    }
  }, [existingRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || score === 0) {
      toast.error("Please select a rating!");
      return;
    }

    setIsSubmitting(true);

    let photo_url = existingRating?.photo_url ?? null;

    if (imageFile) {
      const url = await uploadImage(
        supabase,
        "rating-photos",
        `${user.id}/${placeId}`,
        imageFile,
      );
      if (url) photo_url = url;
    }

    if (existingRating) {
      const { error } = await supabase
        .from("ratings")
        .update({
          score,
          review: review || null,
          photo_url,
        })
        .eq("id", existingRating.id);

      if (error) {
        toast.error("Failed to update rating.");
      } else {
        toast.success("Rating updated!");
        onSuccess?.();
      }
    } else {
      const { error } = await supabase.from("ratings").insert({
        place_id: placeId,
        user_id: user.id,
        score,
        review: review || null,
        photo_url,
      });

      if (error) {
        toast.error("Failed to submit rating.");
      } else {
        toast.success("Rating submitted!");
        onSuccess?.();
      }
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-muted">Your Rating *</label>
        <StarRating value={score} onChange={setScore} />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">Review (optional)</label>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Best chili dog I've ever had..."
        />
      </div>

      <ImageUpload
        label="Photo (optional)"
        value={existingRating?.photo_url}
        onChange={(_url, file) => setImageFile(file)}
      />

      <Button type="submit" variant="primary" disabled={isSubmitting || score === 0}>
        {isSubmitting
          ? "Submitting..."
          : existingRating
            ? "Update Rating"
            : "Submit Rating"}
      </Button>
    </form>
  );
}
