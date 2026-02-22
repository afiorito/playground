"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Place } from "@/types";

interface PlaceListAdminProps {
  places: Place[];
  onEdit: (place: Place) => void;
  onDelete: (id: string) => void;
  onReorder: (places: Pick<Place, "id" | "position">[]) => void;
}

function SortableItem({
  place,
  onEdit,
  onDelete,
}: {
  place: Place;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 transition-colors",
        isDragging && "opacity-50 border-neon-cyan",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical size={18} />
      </button>

      {place.image_url ? (
        <img
          src={place.image_url}
          alt={place.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-surface-border flex items-center justify-center">
          <MapPin size={18} className="text-muted" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{place.name}</div>
        <div className="text-xs text-muted truncate">{place.address}</div>
      </div>

      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="p-2 text-muted hover:text-neon-cyan transition-colors rounded-lg hover:bg-neon-cyan/10"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function PlaceListAdmin({
  places,
  onEdit,
  onDelete,
  onReorder,
}: PlaceListAdminProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = places.findIndex((p) => p.id === active.id);
    const newIndex = places.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(places, oldIndex, newIndex);

    onReorder(
      reordered.map((p, i) => ({ id: p.id, position: i })),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={places.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {places.map((place) => (
            <SortableItem
              key={place.id}
              place={place}
              onEdit={() => onEdit(place)}
              onDelete={() => onDelete(place.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
