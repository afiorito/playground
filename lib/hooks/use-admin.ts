"use client";

import { useCallback } from "react";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { uploadImage, deleteImage } from "@/lib/utils/storage";
import type { Place } from "@/types";

export function useAdmin() {
  const supabase = useSupabase();
  const { isAdmin } = useAuth();

  const addPlace = useCallback(
    async (
      place: Omit<Place, "id" | "created_at" | "updated_at" | "image_url"> & {
        imageFile?: File | null;
      },
    ) => {
      if (!isAdmin) return null;

      const { data, error } = await supabase
        .from("places")
        .insert({
          name: place.name,
          address: place.address,
          google_maps_url: place.google_maps_url,
          description: place.description,
          position: place.position,
          image_url: null,
        })
        .select()
        .single();

      if (error || !data) return null;

      if (place.imageFile) {
        const image_url = await uploadImage(
          supabase,
          "place-images",
          `${data.id}`,
          place.imageFile,
        );
        if (image_url) {
          await supabase
            .from("places")
            .update({ image_url })
            .eq("id", data.id);
        }
      }

      return data;
    },
    [supabase, isAdmin],
  );

  const updatePlace = useCallback(
    async (
      id: string,
      updates: Partial<Place> & { imageFile?: File | null },
    ) => {
      if (!isAdmin) return false;

      if (updates.imageFile) {
        const image_url = await uploadImage(
          supabase,
          "place-images",
          `${id}`,
          updates.imageFile,
        );
        if (image_url) {
          updates.image_url = image_url;
        }
      }

      const { imageFile, ...dbUpdates } = updates;
      const { error } = await supabase
        .from("places")
        .update(dbUpdates)
        .eq("id", id);

      return !error;
    },
    [supabase, isAdmin],
  );

  const deletePlace = useCallback(
    async (id: string) => {
      if (!isAdmin) return false;

      await deleteImage(supabase, "place-images", `${id}`);
      const { error } = await supabase.from("places").delete().eq("id", id);
      return !error;
    },
    [supabase, isAdmin],
  );

  const reorderPlaces = useCallback(
    async (places: Pick<Place, "id" | "position">[]) => {
      if (!isAdmin) return false;

      const updates = places.map((p) =>
        supabase.from("places").update({ position: p.position }).eq("id", p.id),
      );

      const results = await Promise.all(updates);
      return results.every((r) => !r.error);
    },
    [supabase, isAdmin],
  );

  return { addPlace, updatePlace, deletePlace, reorderPlaces, isAdmin };
}
