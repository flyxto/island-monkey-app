"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageItem } from "@/lib/mock-data/customer-portal";
import { ArrowRight, Pencil } from "lucide-react";
import { StatusBadge, StatusType } from "./StatusBadge";

export interface PackageCardProps {
  packageItem: PackageItem;
  onSelect?: (pkg: PackageItem) => void;
  priceSuffix?: string; // e.g. "/hr"
  detailHref?: string;
  statusBadge?: StatusType;
  editHref?: string;
}

const PACKAGE_IMAGES: Record<string, string> = {
  "starter-package":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85",
  "growth-package":
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=85",
  "pro-package":
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1000&auto=format&fit=crop&q=85",
};

// Each layer is blurred more and masked to a narrower band at the bottom,
// so blur strength ramps up smoothly toward the bottom edge.
const PROGRESSIVE_BLUR_LAYERS = [
  { blur: 0.5, mask: "linear-gradient(to bottom, transparent 0%, #000 20%, #000 40%, transparent 60%)" },
  { blur: 1, mask: "linear-gradient(to bottom, transparent 20%, #000 40%, #000 60%, transparent 80%)" },
  { blur: 2, mask: "linear-gradient(to bottom, transparent 40%, #000 60%, #000 80%, transparent 100%)" },
  { blur: 4, mask: "linear-gradient(to bottom, transparent 60%, #000 80%, #000 100%)" },
  { blur: 8, mask: "linear-gradient(to bottom, transparent 80%, #000 100%)" },
];

export function PackageCard({
  packageItem,
  onSelect,
  priceSuffix = "",
  detailHref,
  statusBadge,
  editHref,
}: PackageCardProps) {
  const router = useRouter();
  const formattedPrice = `LKR ${packageItem.priceLKR.toLocaleString()}${priceSuffix}`;
  const targetHref = detailHref || `/customer/packages/${packageItem.id}`;
  const heroImage =
    packageItem.imageUrl ||
    PACKAGE_IMAGES[packageItem.id] ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85";

  return (
    <Link
      href={targetHref}
      onClick={() => onSelect?.(packageItem)}
      className="group block w-full bg-white rounded-3xl border border-black/5 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer"
    >
      {/* Hero Image with overlaid meta + title */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100 rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={packageItem.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Progressive blur at the bottom: stacked backdrop-blur layers with staggered masks */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none">
          {PROGRESSIVE_BLUR_LAYERS.map((layer, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${layer.blur}px)`,
                WebkitBackdropFilter: `blur(${layer.blur}px)`,
                maskImage: layer.mask,
                WebkitMaskImage: layer.mask,
              }}
            />
          ))}
        </div>

        {/* Gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/15 pointer-events-none" />

        {/* Top: metadata row + status/edit */}
        <div className="absolute top-4 inset-x-5 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-[13px] font-medium text-white flex-wrap pointer-events-none">
            <span>{packageItem.durationHours}</span>
            <span className="text-white/60">•</span>
            <span>{packageItem.studioName}</span>
            <span className="text-white/60">•</span>
            <span>{packageItem.photographersCount} Pro</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {statusBadge && <StatusBadge status={statusBadge} />}
            {editHref && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(editHref);
                }}
                className="w-7 h-7 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-sm flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
                aria-label="Edit Gig"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom: title */}
        <h2 className="absolute bottom-4 inset-x-5 text-[22px] sm:text-[24px] font-medium text-white tracking-tight leading-snug pointer-events-none">
          {packageItem.name}
        </h2>
      </div>

      {/* Card Content Section */}
      <div className="px-5 pt-3 pb-4 flex flex-col gap-3">
        <p className="text-[13px] text-slate-400 line-clamp-2 leading-relaxed">
          {packageItem.description}
        </p>

        {/* Bottom Row: Price & Specular Button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[20px] font-medium text-slate-900 tracking-tight">
              {formattedPrice}
            </span>
            {packageItem.additionalHourPriceLKR && packageItem.additionalHourPriceLKR > 0 ? (
              <span className="text-[12px] font-medium text-emerald-600">
                +LKR {packageItem.additionalHourPriceLKR.toLocaleString()}/hr extra
              </span>
            ) : null}
          </div>

          <div className="relative overflow-hidden h-9 px-4 bg-gradient-to-b from-white via-[#F8FAFC] to-[#EDF2F7] border border-slate-200/90 rounded-full font-medium text-[12px] text-slate-900 inline-flex items-center gap-1.5 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.05)] group-hover:brightness-95 transition-all">
            <div className="absolute inset-x-1 top-0.5 h-[44%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />
            <span className="relative z-10 tracking-tight">View Package</span>
            <ArrowRight className="relative z-10 w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
