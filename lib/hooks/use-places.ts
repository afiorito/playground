"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/components/providers/supabase-provider";
import type { Place } from "@/types";

export function usePlaces() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const { data: places = [], isLoading } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Place[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("places-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "places" },
        () => queryClient.invalidateQueries({ queryKey: ["places"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return { places, isLoading };
}
