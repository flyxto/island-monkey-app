"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Plus, X, Image as ImageIcon, Crop } from "lucide-react";
import { getR2PublicUrl } from "@/lib/r2";
import { ImageCropperModal } from "@/components/ui/image-cropper-modal";

export interface GalleryItem {
  id: string;
  url: string; // blob: URL or existing R2 key
  file?: File; // Present if newly chosen local file waiting to be published
  key?: string; // Present if existing R2 key from saved gig
}

export interface GigImageUploaderProps {
  coverPreview: string; // blob: URL or existing R2 key or empty
  onCoverSelected: (file: File, previewUrl: string) => void;
  galleryItems: GalleryItem[];
  onGalleryChange: (items: GalleryItem[]) => void;
  maxGalleryImages?: number;
}

export function GigImageUploader({
  coverPreview,
  onCoverSelected,
  galleryItems,
  onGalleryChange,
  maxGalleryImages = 8,
}: GigImageUploaderProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Cropper states for cover
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState("");

  // Handle Cover selection -> Open cropper modal
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("Image file size must be less than 15MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropperImageSrc(objectUrl);
    setCropperOpen(true);

    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  // On Crop Complete: Save as local blob, do not upload yet
  const handleCroppedCover = (_blob: Blob, croppedFile: File) => {
    setCropperOpen(false);
    if (cropperImageSrc) {
      URL.revokeObjectURL(cropperImageSrc);
      setCropperImageSrc("");
    }

    const localPreviewUrl = URL.createObjectURL(croppedFile);
    onCoverSelected(croppedFile, localPreviewUrl);
  };

  // Handle Multiple Gallery Images Selection: Save as local blobs, do not upload yet
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxGalleryImages - galleryItems.length;
    if (remainingSlots <= 0) {
      alert(`You can only upload up to ${maxGalleryImages} gallery photos.`);
      return;
    }

    const filesToInclude = files.slice(0, remainingSlots);
    const newItems: GalleryItem[] = [];

    for (const file of filesToInclude) {
      if (!file.type.startsWith("image/")) continue;
      const objectUrl = URL.createObjectURL(file);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: objectUrl,
        file,
      });
    }

    onGalleryChange([...galleryItems, ...newItems]);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryImage = (indexToRemove: number) => {
    const item = galleryItems[indexToRemove];
    if (item && item.url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(item.url);
      } catch {
        // ignore
      }
    }
    onGalleryChange(galleryItems.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Cover Photo Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        aspect={3 / 4}
        cropShape="rect"
        title="Crop Gig Cover Photo"
        subtitle="Adjust and frame your cover photo"
        onCancel={() => {
          setCropperOpen(false);
          if (cropperImageSrc) {
            URL.revokeObjectURL(cropperImageSrc);
            setCropperImageSrc("");
          }
        }}
        onCropComplete={handleCroppedCover}
      />

      {/* Hidden File Inputs */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleCoverSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleGallerySelect}
      />

      {/* 1. Main Cover Photo Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#FF6433]" />
            <span>Gig Primary Cover</span>
          </label>
          <span className="text-[11px] font-medium text-slate-400">Required</span>
        </div>

        <div className="flex items-start gap-3.5">
          {/* Cover Preview Card */}
          <div className="relative aspect-[3/4] w-28 sm:w-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200/80 shrink-0 shadow-xs group">
            {coverPreview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={getR2PublicUrl(coverPreview)}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <ImageIcon className="w-6 h-6 stroke-[1.5] mb-1" />
                <span className="text-[10px] font-medium">No cover</span>
              </div>
            )}

            {/* Quick Change Overlay Button */}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 cursor-pointer"
            >
              <Crop className="w-4 h-4" />
              <span className="text-[11px] font-medium">Change</span>
            </button>
          </div>

          {/* Action trigger */}
          <div className="flex flex-col justify-between self-stretch py-0.5">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-slate-800">
                Custom Cover Image Upload
              </span>
            </div>

            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-[12px] font-medium text-[#FF6433] w-fit shadow-2xs transition-colors cursor-pointer mt-2"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{coverPreview ? "Replace Cover" : "Upload Cover"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 my-1" />

      {/* 2. Multi-image Gallery Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
            <span>Lookbook & Gallery Photos</span>
          </label>
          <span className="text-[11px] font-medium text-slate-400">
            {galleryItems.length}/{maxGalleryImages} photos
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {galleryItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getR2PublicUrl(item.url)}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add Gallery Photo Button */}
          {galleryItems.length < maxGalleryImages && (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-[#FF6433] hover:bg-orange-50/40 text-slate-400 hover:text-[#FF6433] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] font-medium">Add Photo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
