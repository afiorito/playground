"use client";

import { cn } from "@/lib/utils/cn";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null, file: File | null) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className, label }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(null, file);
    },
    [onChange],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    onChange(null, null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm text-muted">{label}</label>}
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-surface-border">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-surface-border p-6 cursor-pointer transition-colors",
            isDragging
              ? "border-neon-cyan bg-neon-cyan/5"
              : "hover:border-muted hover:bg-surface/50",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload size={24} className="text-muted" />
          <span className="text-sm text-muted">
            Drop an image or click to upload
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
