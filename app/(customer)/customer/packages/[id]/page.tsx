"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { MOCK_PACKAGES, PackageItem } from "@/lib/mock-data/customer-portal";
import { ProgressiveBlur } from "@/components/portal/ProgressiveBlur";
import {
  Camera,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Clock,
  Building2,
  Users,
} from "lucide-react";

const PACKAGE_IMAGES: Record<string, string> = {
  "starter-package":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85",
  "growth-package":
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=85",
  "pro-package":
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1000&auto=format&fit=crop&q=85",
};

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { packages, setSelectedPackage } = useCustomer();

  const pkg: PackageItem =
    packages.find((p) => p.id === resolvedParams.id) ||
    MOCK_PACKAGES.find((p) => p.isBestSeller) ||
    MOCK_PACKAGES[0];

  const formattedPrice = `LKR ${pkg.priceLKR.toLocaleString()}`;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const heroImage =
    pkg.imageUrl ||
    PACKAGE_IMAGES[pkg.id] ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85";

  const variants = [
    { id: "duration", label: pkg.durationHours },
    { id: "studio", label: pkg.studioName },
    { id: "crew", label: `${pkg.photographersCount} Pro Crew` },
  ];

  const handleBookNow = () => {
    setSelectedPackage(pkg);
    router.push(`/customer/booking?packageId=${pkg.id}`);
  };

  return (
    <div className="fixed inset-0 w-full h-full h-svh max-h-svh flex flex-col justify-between overflow-hidden overscroll-none touch-none select-none">
      {/* Full Background Image from Top to Bottom behind Card */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={pkg.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Progressive Blur behind the Card */}
      <ProgressiveBlur
        className="absolute inset-x-0 bottom-0 z-10 w-full pointer-events-none"
        height="h-[65vh]"
      />

      {/* Top Floating Back Button */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <Link
          href="/customer/packages"
          className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer"
          aria-label="Back to packages"
        >
          <ChevronLeft className="w-5 h-5 -ml-0.5 text-slate-800" />
        </Link>
      </div>

      {/* Top Floating Badge on the right */}
      <div className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[12px] font-medium text-white shadow-xs">
        {pkg.isBestSeller ? "Best Seller" : "Studio Package"}
      </div>

      {/* Spacer to push card to bottom while revealing background hero image */}
      <div className="flex-1 min-h-0 pointer-events-none" />

      {/* Bottom Sheet Card Container */}
      <div className="relative z-20 mx-2.5 sm:mx-4 mb-2.5 sm:mb-4 bg-white rounded-[36px] p-5 sm:p-6 pt-3 flex flex-col gap-3.5 shadow-2xl shrink-0 max-h-[85vh] overflow-hidden">
        {/* Top Notch Indicator */}
        <div className="w-10 h-1 bg-[#FF6433] rounded-full mx-auto my-1 shrink-0" />

        {/* Title */}
        <h1 className="text-[22px] sm:text-[24px] font-medium text-slate-900 leading-tight tracking-tight">
          {pkg.name}
        </h1>

        {/* Description */}
        <p className="text-[14px] font-normal text-slate-500 leading-relaxed">
          {pkg.description}
        </p>

        {/* Price Tag */}
        <div className="text-[18px] font-medium text-[#FF6433] leading-none flex items-center gap-1.5">
          <Sparkles className="w-4.5 h-4.5" />
          <span>{formattedPrice} All Inclusive</span>
        </div>

        {/* Variant / Options Pills Row */}
        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          {variants.map((v, idx) => {
            const isSelected = selectedVariant === idx;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(idx)}
                className={`py-2 px-3.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#F1F3F2] text-slate-900 ring-1 ring-black/10"
                    : "bg-[#F1F3F2] text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Expandable Details Container */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden max-h-[38vh] overflow-y-auto overscroll-contain touch-auto pr-0.5 flex flex-col gap-3.5 pt-1">
            {/* Highlights Box */}
            {pkg.highlightFeature && (
              <div className="bg-[#F6F8F7] border border-[#E3E8E5] rounded-2xl p-3.5 flex flex-col gap-1">
                <span className="text-[13px] font-medium text-slate-900">
                  {pkg.highlightFeature.title}
                </span>
                <span className="text-[12px] font-normal text-slate-500">
                  {pkg.highlightFeature.subtitle}
                </span>
              </div>
            )}

            {/* What's Included */}
            {pkg.whatsIncluded && pkg.whatsIncluded.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[13px] font-medium text-slate-800">
                  What&apos;s Included
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.whatsIncluded.map((item, idx) => (
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

        {/* Bottom Action Bar: Read More or Book Package */}
        <div className="pt-2">
          {!isExpanded ? (
            /* First: Show Read More button with White Specular Glass Style */
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-900 flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
            >
              {/* Upper Specular Glass Sheen */}
              <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />

              {/* Button Label */}
              <span className="relative z-10 text-slate-900 tracking-tight flex items-center gap-2">
                <span>Read Package Details</span>
                <ChevronDown className="w-4 h-4 text-slate-700" />
              </span>
            </button>
          ) : (
            /* Then: Show Book Package button in Orange Shades Glass Style */
            <button
              type="button"
              onClick={handleBookNow}
              className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_24px_rgba(232,74,35,0.35)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Upper Specular Glass Sheen */}
              <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />

              {/* Button Label */}
              <span className="relative z-10 text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Book Package Now</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
