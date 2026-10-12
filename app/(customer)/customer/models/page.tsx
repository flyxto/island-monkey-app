"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getModels } from "@/lib/api";
import { getR2PublicUrl } from "@/lib/r2";
import { Input } from "@/components/ui/input";
import {
  Search,
  Sparkles,
  Star,
  MapPin,
  X,
  Camera,
  Layers,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  User,
} from "lucide-react";

export interface ModelPerson {
  id: string;
  name: string;
  initials: string;
  handle: string;
  avatarUrl?: string | null;
  specialty?: string | null;
  bio?: string | null;
  location?: string | null;
  availability: "Available" | "Unavailable" | string;
  height?: string | null;
  bust?: string | null;
  waist?: string | null;
  hips?: string | null;
  shoeSize?: string | null;
  hairColor?: string | null;
  eyeColor?: string | null;
  skinComplexion?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  tags: string[];
  portfolioImages: string[];
}

export default function CustomerModelsPage() {
  const [models, setModels] = useState<ModelPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelPerson | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchModelList = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const apiData = await getModels();

      if (Array.isArray(apiData)) {
        const mapped: ModelPerson[] = apiData.map((m: any, idx: number) => {
          const firstName = m.user?.firstName || "";
          const lastName = m.user?.lastName || "";
          const name = `${firstName} ${lastName}`.trim() || m.handle || `Model #${idx + 1}`;
          const initials = `${firstName ? firstName[0] : "M"}${lastName ? lastName[0] : ""}`.toUpperCase();

          // Collect portfolio images from model's gigs
          const gigImages: string[] = [];
          if (Array.isArray(m.gigs)) {
            m.gigs.forEach((gig: any) => {
              if (gig.coverImageUrl) {
                gigImages.push(getR2PublicUrl(gig.coverImageUrl));
              }
              if (Array.isArray(gig.galleryImages)) {
                gig.galleryImages.forEach((img: string) => {
                  if (img) gigImages.push(getR2PublicUrl(img));
                });
              }
            });
          }

          // Extract tags from modelingType
          const tags: string[] = Array.isArray(m.modelingType) && m.modelingType.length > 0
            ? m.modelingType
            : m.specialty
            ? [m.specialty]
            : [];

          return {
            id: m.id,
            name,
            initials,
            handle: m.handle || `@model_${m.id.slice(0, 5)}`,
            avatarUrl: m.avatarUrl || null,
            specialty: m.specialty || "Talent / Model",
            bio: m.bio || null,
            location: m.location || "Sri Lanka",
            availability: m.availability || "Available",
            height: m.height || null,
            bust: m.bust || null,
            waist: m.waist || null,
            hips: m.hips || null,
            shoeSize: m.shoeSize || null,
            hairColor: m.hairColor || null,
            eyeColor: m.eyeColor || null,
            skinComplexion: m.skinComplexion || null,
            instagram: m.instagram || null,
            whatsapp: m.whatsapp || null,
            tags,
            portfolioImages: gigImages,
          };
        });

        setModels(mapped);
      } else {
        setModels([]);
      }
    } catch (err: any) {
      console.error("Failed to load models from backend:", err);
      setFetchError(err.message || "Failed to load models from backend");
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModelList();
  }, []);

  const filteredModels = models.filter((m) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      m.name.toLowerCase().includes(query) ||
      m.handle.toLowerCase().includes(query) ||
      (m.specialty && m.specialty.toLowerCase().includes(query)) ||
      (m.location && m.location.toLowerCase().includes(query)) ||
      m.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0 select-none">
      {/* Search Bar Row */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2.5 shrink-0">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models by name, style, location..."
            className="w-full h-11 py-2 px-4 bg-[#1a1a1e] border border-white/10 rounded-xl text-[14px] font-medium text-white placeholder-white/40 focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          onClick={() => fetchModelList()}
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] text-white border border-white/15 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
          title="Refresh models"
          aria-label="Refresh"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FF6433]" />
          ) : (
            <Search className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Bottom Sheet Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Section Header */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
              Studio Models & Talent
            </h1>
            <Sparkles className="w-4 h-4 text-[#FF6433]" />
          </div>
          <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
            {filteredModels.length} {filteredModels.length === 1 ? "Person" : "People"}
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6433]" />
            <span className="text-[13px] font-medium text-slate-500">
              Loading models from studio database...
            </span>
          </div>
        )}

        {/* Error State */}
        {!isLoading && fetchError && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-red-100 flex flex-col items-center text-center gap-3 my-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[15px] font-medium text-slate-900">
                Failed to Load Models
              </h3>
              <p className="text-[12px] font-medium text-slate-500 max-w-xs">
                {fetchError}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchModelList}
              className="mt-1 px-4 py-2 bg-[#FF6433] hover:bg-[#E84A23] text-white rounded-full text-[13px] font-medium flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Fetch</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !fetchError && filteredModels.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/70 border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
              <User className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-medium text-slate-800">
                {searchQuery ? "No matching models found" : "No Models Registered Yet"}
              </h3>
              <p className="text-[13px] font-medium text-slate-500 max-w-xs">
                {searchQuery
                  ? `No talent profiles match "${searchQuery}". Try a different keyword.`
                  : "There are currently no model profiles registered in the studio system."}
              </p>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[12px] font-medium rounded-full cursor-pointer transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Real Models List - 2 Column Grid */}
        {!isLoading && !fetchError && filteredModels.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-6">
            {filteredModels.map((model) => {
              const displayImage = model.avatarUrl
                ? getR2PublicUrl(model.avatarUrl)
                : model.portfolioImages.length > 0
                ? model.portfolioImages[0]
                : null;

              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-black/5 bg-slate-200 group cursor-pointer active:scale-[0.98] transition-transform duration-200 select-none"
                >
                  {/* Full-bleed Model Photo */}
                  {displayImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={displayImage}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 via-orange-100 to-amber-100 flex flex-col items-center justify-center text-[#FF6433]">
                      <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-xs">
                        <span className="text-lg font-medium tracking-tight text-[#FF6433]">
                          {model.initials}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Floating Info Pill */}
                  <div className="absolute bottom-2 inset-x-2 sm:bottom-2.5 sm:inset-x-2.5 bg-white/95 backdrop-blur-md rounded-lg p-1.5 sm:p-2 flex items-center justify-between gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-white/80">
                    <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                      <span className="text-[12px] sm:text-[13px] font-medium text-slate-900 truncate leading-tight">
                        {model.name}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate mt-0.5">
                        {model.specialty || model.handle}
                      </span>
                    </div>
                    {/* Button matching the Package page button style: full rounded circle with just arrow */}
                    <div className="relative overflow-hidden w-8 h-8 rounded-full aspect-square bg-gradient-to-b from-white via-[#F8FAFC] to-[#EDF2F7] border border-slate-200/90 flex items-center justify-center shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.05)] group-hover:brightness-95 shrink-0 transition-all">
                      <div className="absolute inset-x-1 top-0.5 h-[44%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />
                      <ArrowRight className="relative z-10 w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Model Detail Modal / Drawer */}
      {selectedModel && (
        <div
          onClick={() => setSelectedModel(null)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col shadow-2xl border border-black/5 overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
          >
            {/* Modal Header Banner */}
            <div className="relative p-5 pb-4 bg-gradient-to-b from-orange-50 via-white to-white border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0 bg-slate-100 flex items-center justify-center">
                  {selectedModel.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getR2PublicUrl(selectedModel.avatarUrl)}
                      alt={selectedModel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-100 text-[#FF6433] font-medium text-lg flex items-center justify-center">
                      {selectedModel.initials}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[17px] font-medium text-slate-900 tracking-tight">
                    {selectedModel.name}
                  </h3>
                  <span className="text-[12px] font-medium text-slate-400">
                    {selectedModel.handle}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {selectedModel.availability}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {selectedModel.location}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedModel(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 pb-8 flex flex-col gap-4 text-slate-800">
              {/* Bio & Specialty */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  About & Specialty
                </span>
                <p className="text-[13px] font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {selectedModel.bio || `Professional talent specializing in ${selectedModel.specialty || "commercial & fashion shoots"}.`}
                </p>
              </div>

              {/* Physical Comp Card Specs (if available) */}
              {(selectedModel.height ||
                selectedModel.bust ||
                selectedModel.waist ||
                selectedModel.hips ||
                selectedModel.shoeSize ||
                selectedModel.hairColor) && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Comp Card Measurements
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {selectedModel.height && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">Height</span>
                        <span className="text-[13px] font-medium text-slate-800 mt-0.5">
                          {selectedModel.height}
                        </span>
                      </div>
                    )}
                    {selectedModel.bust && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">Bust / Chest</span>
                        <span className="text-[13px] font-medium text-slate-800 mt-0.5">
                          {selectedModel.bust}
                        </span>
                      </div>
                    )}
                    {selectedModel.waist && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">Waist</span>
                        <span className="text-[13px] font-medium text-slate-800 mt-0.5">
                          {selectedModel.waist}
                        </span>
                      </div>
                    )}
                    {selectedModel.hips && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">Hips</span>
                        <span className="text-[13px] font-medium text-slate-800 mt-0.5">
                          {selectedModel.hips}
                        </span>
                      </div>
                    )}
                    {selectedModel.shoeSize && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">Shoe Size</span>
                        <span className="text-[13px] font-medium text-slate-800 mt-0.5">
                          {selectedModel.shoeSize}
                        </span>
                      </div>
                    )}
                    {selectedModel.hairColor && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">Hair & Eyes</span>
                        <span className="text-[13px] font-medium text-slate-800 mt-0.5 truncate">
                          {selectedModel.hairColor}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Portfolio Images Gallery */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Portfolio & Lookbook
                  </span>
                  {selectedModel.portfolioImages.length > 0 && (
                    <span className="text-[11px] font-medium text-[#FF6433]">
                      {selectedModel.portfolioImages.length} {selectedModel.portfolioImages.length === 1 ? "Photograph" : "Photographs"}
                    </span>
                  )}
                </div>

                {selectedModel.portfolioImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedModel.portfolioImages.map((imgUrl, imgIdx) => (
                      <div
                        key={imgIdx}
                        onClick={() => setPreviewImage(imgUrl)}
                        className="relative aspect-3/4 rounded-2xl overflow-hidden border border-slate-100 shadow-xs cursor-pointer group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`${selectedModel.name} portfolio ${imgIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-[11px] font-medium">
                            Preview
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center gap-1.5">
                    <Camera className="w-5 h-5 text-slate-400" />
                    <span className="text-[12px] font-medium text-slate-500">
                      No portfolio images uploaded yet for this model
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview Zoom Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Portfolio preview"
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
