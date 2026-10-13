"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { getGig, updateGig } from "@/lib/api";
import { getR2PublicUrl } from "@/lib/r2";
import { ProgressiveBlur } from "@/components/portal/ProgressiveBlur";
import { ChevronLeft, Check, ChevronDown, ChevronUp, Pencil, Loader2, Image as ImageIcon } from "lucide-react";

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
  const [selectedHeroImage, setSelectedHeroImage] = useState<string>("");

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
          setSelectedHeroImage(cover);
        }
      })
      .catch((err) => {
        console.error("Failed to load gig:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [resolvedParams.id]);

  const heroImage = getR2PublicUrl(selectedHeroImage || coverUrl);

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
    <div className="fixed inset-0 w-full h-full h-svh max-h-svh flex flex-col justify-between overflow-hidden overscroll-none touch-none select-none">
      {/* Full Background Image / Neutral Background behind Card */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-neutral-800 via-neutral-900 to-black flex flex-col items-center justify-center text-white/30 gap-2">
            <ImageIcon className="w-16 h-16 stroke-[1.2]" />
            <span className="text-[13px] font-medium text-white/40">No cover photo</span>
          </div>
        )}
      </div>

      {/* Progressive Blur behind the Card */}
      <ProgressiveBlur
        className="absolute inset-x-0 bottom-0 z-10 w-full pointer-events-none"
        height="h-[65vh]"
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

      {/* Spacer to push card to bottom while revealing background hero image */}
      <div className="flex-1 min-h-0 pointer-events-none" />

      {/* Bottom Sheet Card Container */}
      <div className="relative z-20 mx-2.5 sm:mx-4 mb-2.5 sm:mb-4 bg-white rounded-[36px] p-5 sm:p-6 pt-3 flex flex-col gap-3.5 shadow-2xl shrink-0 max-h-[85vh] overflow-hidden">
        {/* Top Notch Indicator */}
        <div className="w-10 h-1 bg-[#FF6433] rounded-full mx-auto my-1 shrink-0" />

        {!isEditing ? (
          /* View Mode */
          <>
            {/* Title & Tag */}
            <div className="flex items-start justify-between gap-3">
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
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden max-h-[38vh] overflow-y-auto overscroll-contain touch-auto pr-0.5 flex flex-col gap-3.5 pt-1">
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

                {/* Lookbook & Gallery Images Strip */}
                {galleryImages.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-slate-800">
                        Lookbook & Portfolio ({galleryImages.length})
                      </span>
                      <span className="text-[11px] text-slate-400">Tap photo to view</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                      {/* Cover Photo Thumbnail */}
                      {coverUrl && (
                        <button
                          type="button"
                          onClick={() => setSelectedHeroImage(coverUrl)}
                          className={`relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            (selectedHeroImage === coverUrl || (!selectedHeroImage && coverUrl))
                              ? "border-[#FF6433] ring-2 ring-[#FF6433]/30 scale-[1.02]"
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getR2PublicUrl(coverUrl)}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-medium py-0.5 text-center">
                            Cover
                          </span>
                        </button>
                      )}

                      {/* Gallery Thumbnails */}
                      {galleryImages.map((imgKey, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedHeroImage(imgKey)}
                          className={`relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            selectedHeroImage === imgKey
                              ? "border-[#FF6433] ring-2 ring-[#FF6433]/30 scale-[1.02]"
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getR2PublicUrl(imgKey)}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
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
