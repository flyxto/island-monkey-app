"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { getGig, updateGig } from "@/lib/api";
import { getR2PublicUrl } from "@/lib/r2";
import { ProgressiveBlur } from "@/components/portal/ProgressiveBlur";
import { ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp, Pencil, Loader2, Image as ImageIcon } from "lucide-react";

export default function SingleGigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [gigData, setGigData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  // Drawer Drag-to-Close State
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragDeltaY, setDragDeltaY] = useState<number>(0);
  const [isDraggingDrawer, setIsDraggingDrawer] = useState(false);

  const handleDrawerDragStart = (clientY: number) => {
    if (!isExpanded) return;
    setDragStartY(clientY);
    setDragDeltaY(0);
    setIsDraggingDrawer(true);
  };

  const handleDrawerDragMove = (clientY: number) => {
    if (dragStartY === null || !isExpanded) return;
    const diff = clientY - dragStartY;
    if (diff > 0) {
      setDragDeltaY(diff);
    } else {
      setDragDeltaY(0);
    }
  };

  const handleDrawerDragEnd = () => {
    if (dragStartY === null) return;
    if (dragDeltaY > 35) {
      setIsExpanded(false);
    }
    setDragStartY(null);
    setDragDeltaY(0);
    setIsDraggingDrawer(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getGig(resolvedParams.id)
      .then((data) => {
        if (data) {
          setGigData(data);
          setTitle(data.title || "");
          setDescription(data.description || "");
          setHourlyRate(Number(data.hourlyRateLkr || data.hourlyRateLKR || 0));
          const cover = data.coverImageUrl || "";
          setCoverUrl(cover);
          const gallery = Array.isArray(data.galleryImages) ? data.galleryImages : [];
          setGalleryImages(gallery);
          setActiveImageIndex(0);
        }
      })
      .catch((err) => {
        console.error("Failed to load gig:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [resolvedParams.id]);

  const allImages: string[] = [
    ...(coverUrl ? [coverUrl] : []),
    ...galleryImages.filter((img) => img && img !== coverUrl),
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    setTouchDeltaX(e.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const threshold = 40;
    if (touchDeltaX < -threshold) {
      // Swiped Left -> Next Image
      setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    } else if (touchDeltaX > threshold) {
      // Swiped Right -> Previous Image
      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  const goToPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const variants = [
    ...(gigData?.venueName
      ? [
          {
            id: "venue",
            label: gigData.venueName,
            price: `LKR ${Number(hourlyRate).toLocaleString()}`,
          },
        ]
      : []),
    ...(gigData?.durationHours
      ? [
          {
            id: "duration",
            label: `${gigData.durationHours} Session`,
          },
        ]
      : []),
  ];

  const whatsIncluded: string[] = Array.isArray(gigData?.whatsIncluded)
    ? gigData.whatsIncluded
    : typeof gigData?.whatsIncluded === "string"
      ? gigData.whatsIncluded.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateGig(resolvedParams.id, {
        title,
        description,
        hourlyRateLkr: Number(hourlyRate),
      });
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsEditing(false);
      }, 1200);
    } catch (err) {
      console.error("Failed to update gig:", err);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsEditing(false);
      }, 1200);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6433]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full h-svh max-h-svh flex flex-col justify-between overflow-hidden overscroll-none select-none">
      {/* Hero Swipe Carousel Area */}
      <div
        className="absolute inset-0 w-full h-full z-0 overflow-hidden touch-pan-y"
        onTouchStart={allImages.length > 1 ? handleTouchStart : undefined}
        onTouchMove={allImages.length > 1 ? handleTouchMove : undefined}
        onTouchEnd={allImages.length > 1 ? handleTouchEnd : undefined}
      >
        {allImages.length > 0 ? (
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${activeImageIndex * 100}%)`,
            }}
          >
            {allImages.map((imgKey, idx) => (
              <div key={idx} className="relative w-full h-full shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getR2PublicUrl(imgKey)}
                  alt={`${title} - photo ${idx + 1}`}
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-neutral-800 via-neutral-900 to-black flex flex-col items-center justify-center text-white/30 gap-2">
            <ImageIcon className="w-16 h-16 stroke-[1.2]" />
            <span className="text-[13px] font-medium text-white/40">No cover photo</span>
          </div>
        )}

        {/* Desktop Left / Right Navigation Chevrons */}
        {allImages.length > 1 && (
          <div className="absolute inset-x-4 top-[22%] -translate-y-1/2 z-20 hidden sm:flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={goToPrev}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>
          </div>
        )}

        {/* Floating Top-Right Counter Pill Badge */}
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 z-30 pointer-events-auto">
            <div className="px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[12px] font-medium tracking-tight shadow-lg flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-white/80" />
              <span>{activeImageIndex + 1} / {allImages.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progressive Blur behind the Card */}
      <ProgressiveBlur
        className="absolute inset-x-0 bottom-0 z-10 w-full pointer-events-none"
        height="h-[52vh]"
      />

      {/* Top Floating Back Button */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <Link
          href="/model/gigs"
          className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer"
          aria-label="Back to gigs"
        >
          <ChevronLeft className="w-5 h-5 -ml-0.5 text-slate-800" />
        </Link>
      </div>

      {/* Click Outside Backdrop Area when Drawer is Expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 z-15 bg-black/20 backdrop-blur-[1.5px] transition-opacity duration-300 cursor-pointer pointer-events-auto"
          aria-label="Click outside to collapse details"
        />
      )}

      {/* Top Spacer / Backdrop Area */}
      <div 
        onClick={() => {
          if (isExpanded) setIsExpanded(false);
        }}
        className={`flex-1 transition-all duration-300 ${
          isExpanded 
            ? "min-h-[80px] cursor-pointer pointer-events-auto" 
            : "min-h-[38vh] sm:min-h-[42vh] pointer-events-none"
        }`} 
      />

      {/* Floating Pill Dot Indicators right above the bottom drawer */}
      {allImages.length > 1 && (
        <div className="relative z-30 flex items-center justify-center pb-2 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center gap-1.5 pointer-events-auto shadow-lg">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`transition-all duration-300 cursor-pointer ${
                  activeImageIndex === idx
                    ? "w-5 h-1.5 bg-[#FF6433] rounded-full shadow-[0_1px_6px_rgba(255,100,51,0.7)]"
                    : "w-1.5 h-1.5 bg-white/60 hover:bg-white rounded-full"
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sheet Card Container */}
      <div 
        style={{
          transform: isDraggingDrawer && dragDeltaY > 0 ? `translateY(${Math.min(dragDeltaY, 120)}px)` : undefined,
          transition: isDraggingDrawer ? "none" : undefined,
        }}
        className={`relative z-20 mx-2.5 sm:mx-4 mb-2.5 sm:mb-4 bg-white rounded-[36px] p-5 sm:p-6 pt-3 flex flex-col gap-3.5 shadow-2xl shrink-0 transition-all duration-300 h-fit ${
          isExpanded ? "max-h-[calc(100svh-90px)]" : "max-h-[46vh]"
        } overflow-hidden`}
      >
        {/* Top Notch Indicator / Drag Handle */}
        <div
          className="w-full py-1.5 -mt-1 cursor-grab active:cursor-grabbing flex items-center justify-center touch-none select-none"
          onTouchStart={(e) => handleDrawerDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDrawerDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDrawerDragEnd}
          onMouseDown={(e) => handleDrawerDragStart(e.clientY)}
          onMouseMove={(e) => {
            if (isDraggingDrawer) handleDrawerDragMove(e.clientY);
          }}
          onMouseUp={handleDrawerDragEnd}
          onClick={() => {
            if (isExpanded) setIsExpanded(false);
          }}
          title={isExpanded ? "Drag down or tap to collapse" : undefined}
        >
          <div className="w-12 h-1.5 bg-[#FF6433] rounded-full mx-auto" />
        </div>

        {!isEditing ? (
          /* View Mode */
          <>
            {/* Title & Tag (also draggable to collapse when expanded) */}
            <div 
              className={`flex items-start justify-between gap-3 select-none ${isExpanded ? "cursor-grab active:cursor-grabbing" : ""}`}
              onTouchStart={(e) => handleDrawerDragStart(e.touches[0].clientY)}
              onTouchMove={(e) => handleDrawerDragMove(e.touches[0].clientY)}
              onTouchEnd={handleDrawerDragEnd}
              onMouseDown={(e) => handleDrawerDragStart(e.clientY)}
              onMouseMove={(e) => {
                if (isDraggingDrawer) handleDrawerDragMove(e.clientY);
              }}
              onMouseUp={handleDrawerDragEnd}
            >
              <h1 className="text-[22px] sm:text-[24px] font-medium text-slate-900 leading-tight tracking-tight flex-1">
                {title}
              </h1>
              {gigData?.tag && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[12px] font-medium rounded-full shrink-0 border border-slate-200/60">
                  {gigData.tag}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[14px] font-normal text-slate-500 leading-relaxed">
              {description}
            </p>

            {/* Price Tag */}
            <div className="text-[18px] font-medium text-[#FF6433] leading-none">
              LKR {hourlyRate.toLocaleString()}/hr
            </div>

            {/* Variant / Options Pills Row */}
            {variants.length > 0 && (
              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                {variants.map((v, idx) => {
                  const isSelected = selectedVariant === idx;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(idx)}
                      className={`py-2.5 px-4 sm:px-5 rounded-full text-[14px] font-medium flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#F1F3F2] text-slate-900 ring-1 ring-black/10"
                          : "bg-[#F1F3F2] text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>{v.label}</span>
                      {v.price && (
                        <span className="text-[#FF6433] font-medium">{v.price}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Expandable Details Container */}
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out min-h-0 ${
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden min-h-0 flex flex-col">
                <div className="overflow-y-auto overscroll-contain touch-auto pr-0.5 flex flex-col gap-3.5 pt-1 min-h-0">
                {/* Highlights Box */}
                {gigData?.highlightTitle && (
                  <div className="bg-[#F6F8F7] border border-[#E3E8E5] rounded-2xl p-3.5 flex flex-col gap-1">
                    <span className="text-[13px] font-medium text-slate-900">
                      {gigData.highlightTitle}
                    </span>
                    {gigData?.highlightSubtitle && (
                      <span className="text-[12px] font-normal text-slate-500">
                        {gigData.highlightSubtitle}
                      </span>
                    )}
                  </div>
                )}

                {/* In-Container 4:3 Landscape Image Carousel (Synced with Hero) */}
                {allImages.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-slate-800">
                        Lookbook & Photos ({allImages.length})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {allImages.length > 1 ? "Swipe or tap to view" : "Cover photo"}
                      </span>
                    </div>

                    {/* 4:3 Landscape Aspect Ratio Carousel */}
                    <div 
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 shadow-md border border-slate-200/60 select-none group touch-pan-y"
                      onTouchStart={allImages.length > 1 ? handleTouchStart : undefined}
                      onTouchMove={allImages.length > 1 ? handleTouchMove : undefined}
                      onTouchEnd={allImages.length > 1 ? handleTouchEnd : undefined}
                    >
                      <div 
                        className="flex h-full w-full transition-transform duration-300 ease-out"
                        style={{
                          transform: `translateX(-${activeImageIndex * 100}%)`,
                        }}
                      >
                        {allImages.map((imgKey, idx) => (
                          <div key={idx} className="relative w-full h-full shrink-0 overflow-hidden bg-neutral-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getR2PublicUrl(imgKey)}
                              alt={`Lookbook photo ${idx + 1}`}
                              className="w-full h-full object-cover object-center pointer-events-none select-none"
                              draggable={false}
                            />
                            {imgKey === coverUrl && (
                              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/20">
                                Cover Photo
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop / Touch Left and Right Chevrons */}
                      {allImages.length > 1 && (
                        <div className="absolute inset-x-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-between pointer-events-none">
                          <button
                            type="button"
                            onClick={goToPrev}
                            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-md active:scale-95"
                            aria-label="Previous photo"
                          >
                            <ChevronLeft className="w-4 h-4 -ml-0.5" />
                          </button>
                          <button
                            type="button"
                            onClick={goToNext}
                            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-md active:scale-95"
                            aria-label="Next photo"
                          >
                            <ChevronRight className="w-4 h-4 -mr-0.5" />
                          </button>
                        </div>
                      )}

                      {/* Floating Counter Badge in 4:3 Carousel */}
                      {allImages.length > 1 && (
                        <div className="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-medium border border-white/20">
                          {activeImageIndex + 1} / {allImages.length}
                        </div>
                      )}

                      {/* Bottom Frosted Pill Indicators inside 4:3 Carousel */}
                      {allImages.length > 1 && (
                        <div className="absolute inset-x-0 bottom-2.5 z-10 flex items-center justify-center pointer-events-none">
                          <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center gap-1.5 pointer-events-auto shadow-sm">
                            {allImages.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImageIndex(idx)}
                                className={`transition-all duration-300 cursor-pointer ${
                                  activeImageIndex === idx
                                    ? "w-4 h-1 bg-[#FF6433] rounded-full shadow-xs"
                                    : "w-1 h-1 bg-white/60 hover:bg-white rounded-full"
                                }`}
                                aria-label={`Photo ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Thumbnail Jump Strip Below 4:3 Carousel */}
                    {allImages.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-0.5">
                        {allImages.map((imgKey, idx) => {
                          const isActive = activeImageIndex === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveImageIndex(idx)}
                              className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                                isActive
                                  ? "border-[#FF6433] ring-2 ring-[#FF6433]/30 scale-[1.02]"
                                  : "border-slate-200/80 opacity-70 hover:opacity-100"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={getR2PublicUrl(imgKey)}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* What's Included */}
                {whatsIncluded.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-[13px] font-medium text-slate-800">
                      What&apos;s Included
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {whatsIncluded.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-[13px] font-normal text-slate-600"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#FF6433]/15 text-[#FF6433] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collapse toggle */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-[12px] font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 self-center pt-1 transition-colors cursor-pointer"
                >
                  <span>Show Less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

            {/* Bottom Action Bar: (Read More or Edit Gig) */}
            <div className="pt-2">
              {!isExpanded ? (
                /* First: Show Read More button with Gigs Card Glass Style (White) */
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-900 flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
                >
                  {/* Upper Specular Glass Sheen */}
                  <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />

                  {/* Button Label */}
                  <span className="relative z-10 text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Read More</span>
                    <ChevronDown className="w-4 h-4 text-slate-700" />
                  </span>
                </button>
              ) : (
                /* Then: Show Edit Gig button linking to edit page in Orange Shades Glass Style */
                <Link
                  href={`/model/gigs/${resolvedParams.id}/edit`}
                  className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_24px_rgba(232,74,35,0.35)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200"
                >
                  {/* Upper Specular Glass Sheen */}
                  <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />

                  {/* Button Label */}
                  <span className="relative z-10 text-white tracking-tight flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    <span>Edit Gig</span>
                  </span>
                </Link>
              )}
            </div>
          </>
        ) : (
          /* Edit Mode */
          <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto overscroll-contain touch-auto pr-0.5 pt-1">
            <span className="text-[15px] font-medium text-slate-900">
              Edit Gig Details
            </span>

            {/* Title Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Gig Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[15px] font-medium text-slate-900 bg-[#F6F8F7] border border-[#E3E8E5] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                placeholder="Gig Title"
              />
            </div>

            {/* Hourly Rate Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Hourly Rate (LKR)
              </label>
              <div className="flex items-center gap-2 bg-[#F6F8F7] border border-[#E3E8E5] rounded-xl px-3 py-2 text-[#FF6433]">
                <span className="text-[14px] font-medium">LKR</span>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full bg-transparent font-medium text-[15px] text-slate-900 focus:outline-none"
                />
                <span className="text-[13px] text-slate-400 font-medium">/hr</span>
              </div>
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-[13px] text-slate-700 bg-[#F6F8F7] border border-[#E3E8E5] rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#FF6433] resize-none"
                placeholder="Gig Description"
              />
            </div>

            {/* Edit Actions: Cancel + Save */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="h-12 px-5 bg-neutral-100 hover:bg-neutral-200 text-slate-700 rounded-full font-medium text-[14px] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="relative overflow-hidden flex-1 h-12 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_24px_rgba(232,74,35,0.35)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
              >
                {/* Upper Specular Glass Sheen */}
                <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />

                <span className="relative z-10 text-white tracking-tight flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSaved ? "Saved!" : "Save Changes"}</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
