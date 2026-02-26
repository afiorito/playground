"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import type { PlaceStats } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function usePlaceStats() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["place-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("place_stats")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as PlaceStats[];
    },
  });

  useEffect(() => {
    const placesChannel = supabase
      .channel("place-stats-places")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "places" },
        () => queryClient.invalidateQueries({ queryKey: ["place-stats"] }),
      )
      .subscribe();

    const ratingsChannel = supabase
      .channel("place-stats-ratings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ratings" },
        () => queryClient.invalidateQueries({ queryKey: ["place-stats"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(placesChannel);
      supabase.removeChannel(ratingsChannel);
    };
  }, [supabase, queryClient]);

  return { stats, isLoading };
}
