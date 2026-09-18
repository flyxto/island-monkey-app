"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageItem } from "@/lib/mock-data/customer-portal";
import { Camera, ArrowRight, Clock, Building2, Users, Pencil } from "lucide-react";
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
      {/* Hero Image Container */}
      <div className="relative h-38 sm:h-42 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={packageItem.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient Dark Gradient on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {statusBadge ? (
            <StatusBadge status={statusBadge} />
          ) : packageItem.isBestSeller ? (
            <span className="px-3 py-1 bg-[#FF6433] text-white text-[11px] font-medium rounded-full shadow-xs">
              Best Seller
            </span>
          ) : (
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium rounded-full">
              Studio Pass
            </span>
          )}

          <div className="flex items-center gap-1.5 pointer-events-auto">
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
            <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium rounded-full flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{packageItem.studioName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 sm:p-5 flex flex-col gap-2.5">
        {/* Title & Metadata Pills */}
        <div className="flex flex-col gap-1">
          <h2 className="text-[17px] sm:text-[18px] font-medium text-slate-900 tracking-tight group-hover:text-[#FF6433] transition-colors leading-snug">
            {packageItem.name}
          </h2>

          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{packageItem.durationHours}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{packageItem.studioName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{packageItem.photographersCount} Pro</span>
            </span>
          </div>
        </div>

        <p className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed">
          {packageItem.description}
        </p>

        {/* Bottom Row: Price & Specular Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[18px] font-medium text-slate-900 tracking-tight">
            {formattedPrice}
          </span>

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
