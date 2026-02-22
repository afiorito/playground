"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/components/providers/supabase-provider";
import type { RatingWithProfile } from "@/types";

export function useRatings(placeId: string | null) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const { data: ratings = [], isLoading } = useQuery({
    queryKey: ["ratings", placeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("*, profiles(display_name, avatar_url)")
        .eq("place_id", placeId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RatingWithProfile[];
    },
    enabled: !!placeId,
  });

  useEffect(() => {
    if (!placeId) return;

    const channel = supabase
      .channel(`ratings-${placeId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ratings",
          filter: `place_id=eq.${placeId}`,
        },
        () => queryClient.invalidateQueries({ queryKey: ["ratings", placeId] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, placeId, queryClient]);

  return { ratings, isLoading };
}
