"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Place } from "@/types";

interface PlaceFormProps {
  place?: Place | null;
  nextPosition: number;
  onSubmit: (data: PlaceFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface PlaceFormData {
  name: string;
  address: string;
  google_maps_url: string;
  description: string;
  position: number;
  imageFile: File | null;
}

export function PlaceForm({
  place,
  nextPosition,
  onSubmit,
  onCancel,
  isSubmitting,
}: PlaceFormProps) {
  const [name, setName] = useState(place?.name ?? "");
  const [address, setAddress] = useState(place?.address ?? "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    place?.google_maps_url ?? "",
  );
  const [description, setDescription] = useState(place?.description ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      address,
      google_maps_url: googleMapsUrl || "",
      description: description || "",
      position: place?.position ?? nextPosition,
      imageFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-muted">Name *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Frank's Famous Franks"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted">Address *</label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Dog St, Bun City, NY"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted">Google Maps URL</label>
        <Input
          value={googleMapsUrl}
          onChange={(e) => setGoogleMapsUrl(e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="The best chili dogs this side of the Mississippi..."
        />
      </div>
      <ImageUpload
        label="Photo"
        value={place?.image_url}
        onChange={(_url, file) => setImageFile(file)}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : place ? "Update" : "Add Stop"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
