"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/components/providers/supabase-provider";
import type { UserStats } from "@/types";

export function useUserStats() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .order("total_ratings", { ascending: false });

      if (error) throw error;
      return data as UserStats[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("user-stats-ratings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ratings" },
        () => queryClient.invalidateQueries({ queryKey: ["user-stats"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return { stats, isLoading };
}
