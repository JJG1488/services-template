"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, GripVertical, Plus, ImageIcon } from "lucide-react";

interface PortfolioImage {
  url: string;
  alt?: string;
  caption?: string;
  is_before?: boolean;
  is_after?: boolean;
  position: number;
}

interface MultiImageUploadProps {
  images: PortfolioImage[];
  onChange: (images: PortfolioImage[]) => void;
  maxImages?: number;
  label?: string;
  helpText?: string;
}

export function MultiImageUpload({
  images,
  onChange,
  maxImages = 10,
  label = "Images",
  helpText,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a JPG, PNG, WebP, or GIF image.");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB.");
        return;
      }

      // Check max images
      if (images.length >= maxImages) {
        setError(`Maximum ${maxImages} images allowed.`);
        return;
      }

      setUploading(true);
      setError("");

      try {
        const token = localStorage.getItem("admin_token");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const { url } = await res.json();

        // Add new image to array
        const newImage: PortfolioImage = {
          url,
          alt: "",
          caption: "",
          position: images.length,
        };

        onChange([...images, newImage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onChange]
  );

  const handleMultipleUpload = useCallback(
    async (files: FileList) => {
      // Limit to remaining slots
      const remainingSlots = maxImages - images.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToUpload) {
        await handleUpload(file);
      }
    },
    [handleUpload, images.length, maxImages]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        // Filter to image files only
        const imageFiles = Array.from(files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (imageFiles.length > 0) {
          const dataTransfer = new DataTransfer();
          imageFiles.forEach((f) => dataTransfer.items.add(f));
          handleMultipleUpload(dataTransfer.files);
        } else {
          setError("Please drop image files.");
        }
      }
    },
    [handleMultipleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleMultipleUpload(files);
      }
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [handleMultipleUpload]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        position: i,
      }));
      onChange(newImages);
      setError("");
    },
    [images, onChange]
  );

  // Drag-to-reorder handlers
  const handleImageDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.dataTransfer.effectAllowed = "move";
      setDraggedIndex(index);
    },
    []
  );

  const handleImageDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        setDropTargetIndex(index);
      }
    },
    [draggedIndex]
  );

  const handleImageDragEnd = useCallback(() => {
    if (draggedIndex !== null && dropTargetIndex !== null && draggedIndex !== dropTargetIndex) {
      const newImages = [...images];
      const [removed] = newImages.splice(draggedIndex, 1);
      newImages.splice(dropTargetIndex, 0, removed);

      // Update positions
      const reorderedImages = newImages.map((img, i) => ({
        ...img,
        position: i,
      }));

      onChange(reorderedImages);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, [draggedIndex, dropTargetIndex, images, onChange]);

  const updateImageField = useCallback(
    (index: number, field: keyof PortfolioImage, value: string | boolean) => {
      const newImages = images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      );
      onChange(newImages);
    },
    [images, onChange]
  );

  const canAddMore = images.length < maxImages;

  return (
    <div>
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages}
        </span>
      </div>

      {helpText && (
        <p className="text-sm text-gray-500 mb-3">{helpText}</p>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {images.map((image, index) => (
            <div
              key={image.url + index}
              draggable
              onDragStart={(e) => handleImageDragStart(e, index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={`relative group bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${
                draggedIndex === index
                  ? "opacity-50 border-brand"
                  : dropTargetIndex === index
                    ? "border-brand border-dashed"
                    : "border-transparent hover:border-gray-300"
              }`}
            >
              {/* Image */}
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 text-white cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Position Badge */}
                <div className="absolute top-2 right-10 bg-white/90 text-gray-900 text-xs font-semibold px-2 py-0.5 rounded">
                  {index + 1}
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Caption Input */}
              <div className="p-2 bg-white">
                <input
                  type="text"
                  value={image.alt || ""}
                  onChange={(e) => updateImageField(index, "alt", e.target.value)}
                  placeholder="Alt text..."
                  className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          ))}

          {/* Add More Button (in grid) */}
          {canAddMore && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-brand hover:bg-brand/5 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-brand animate-spin" />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Empty State / Drop Zone */}
      {images.length === 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-brand bg-brand/5"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-brand animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 font-medium">
                Drag and drop images, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, WebP or GIF (max 5MB each)
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Up to {maxImages} images
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Drag Hint */}
      {images.length > 1 && (
        <p className="text-xs text-gray-400 mt-2">
          Drag images to reorder. First image is the main thumbnail.
        </p>
      )}
    </div>
  );
}
