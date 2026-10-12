"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Point, Area } from "react-easy-crop";
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Crop } from "lucide-react";

export interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  aspect?: number;
  cropShape?: "round" | "rect";
  title?: string;
  subtitle?: string;
  onCancel: () => void;
  onCropComplete: (croppedBlob: Blob, croppedFile: File) => void;
}

/**
 * Creates a cropped image blob & File using an HTML5 Canvas from crop pixel bounds.
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  fileName = "profile-avatar.jpg"
): Promise<{ blob: Blob; file: File }> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (err) => reject(err);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to obtain 2D canvas context for image crop");
  }

  // Set canvas size strictly to the cropped dimensions
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<{ blob: Blob; file: File }>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas conversion to Blob failed"));
          return;
        }
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve({ blob, file });
      },
      "image/jpeg",
      0.92 // High quality JPEG
    );
  });
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  aspect = 1,
  cropShape = "round",
  title = "Crop Profile Photo",
  subtitle,
  onCancel,
  onCropComplete: handleCropDone,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropAreaChange = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const { blob, file } = await getCroppedImg(imageSrc, croppedAreaPixels);
      handleCropDone(blob, file);
    } catch (err) {
      console.error("Failed to crop image:", err);
      alert("Failed to process cropped image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const resolvedSubtitle =
    subtitle || (aspect === 1 ? "Pinch or drag to position (1:1 square)" : "Pinch or drag to frame photo");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col border border-black/5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-50 text-[#FF6433] flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-slate-900 tracking-tight leading-none">
                {title}
              </h3>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                {resolvedSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cropper Viewport */}
        <div className="relative w-full h-72 sm:h-80 bg-slate-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropAreaChange}
          />
        </div>

        {/* Zoom Controls Bar */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
            className="text-slate-500 hover:text-slate-800 p-1 cursor-pointer transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#FF6433] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
            className="text-slate-500 hover:text-slate-800 p-1 cursor-pointer transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setCrop({ x: 0, y: 0 });
            }}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors ml-1"
            title="Reset position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-medium rounded-full cursor-pointer transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-[#FF6433] hover:bg-[#E84A23] text-white text-[13px] font-medium rounded-full shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{isProcessing ? "Processing..." : "Set Photo"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
