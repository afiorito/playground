"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { usePlaces } from "@/lib/hooks/use-places";
import { useAdmin } from "@/lib/hooks/use-admin";
import { PlaceListAdmin } from "@/components/places/place-list-admin";
import { PlaceForm, type PlaceFormData } from "@/components/places/place-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import type { Place } from "@/types";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const { places, isLoading } = usePlaces();
  const { addPlace, updatePlace, deletePlace, reorderPlaces } = useAdmin();
  const router = useRouter();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield size={48} className="text-muted" />
        <p className="text-muted text-lg">
          You don&apos;t have admin access.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleAdd = async (data: PlaceFormData) => {
    setIsSubmitting(true);
    const result = await addPlace({
      name: data.name,
      address: data.address,
      google_maps_url: data.google_maps_url || null,
      description: data.description || null,
      position: data.position,
      imageFile: data.imageFile,
    });
    setIsSubmitting(false);

    if (result) {
      toast.success("Stop added!");
      setIsFormOpen(false);
    } else {
      toast.error("Failed to add stop.");
    }
  };

  const handleEdit = async (data: PlaceFormData) => {
    if (!editingPlace) return;
    setIsSubmitting(true);
    const success = await updatePlace(editingPlace.id, {
      name: data.name,
      address: data.address,
      google_maps_url: data.google_maps_url || null,
      description: data.description || null,
      imageFile: data.imageFile,
    });
    setIsSubmitting(false);

    if (success) {
      toast.success("Stop updated!");
      setEditingPlace(null);
    } else {
      toast.error("Failed to update stop.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stop? This cannot be undone.")) return;
    const success = await deletePlace(id);
    if (success) {
      toast.success("Stop deleted!");
    } else {
      toast.error("Failed to delete stop.");
    }
  };

  const handleReorder = async (
    reordered: Pick<Place, "id" | "position">[],
  ) => {
    await reorderPlaces(reordered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl sm:text-3xl neon-orange">
          Manage Stops
        </h1>
        <Button
          variant="primary"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={16} />
          Add Stop
        </Button>
      </div>

      {places.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-lg mb-2">No stops yet!</p>
          <p>Add your first hot dog destination above.</p>
        </div>
      ) : (
        <PlaceListAdmin
          places={places}
          onEdit={setEditingPlace}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add New Stop"
      >
        <PlaceForm
          nextPosition={places.length}
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={!!editingPlace}
        onClose={() => setEditingPlace(null)}
        title="Edit Stop"
      >
        {editingPlace && (
          <PlaceForm
            place={editingPlace}
            nextPosition={places.length}
            onSubmit={handleEdit}
            onCancel={() => setEditingPlace(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
}
