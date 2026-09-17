"use client";

import Link from "next/link";
import { PartnerOffer } from "@/lib/mock-data/partner-portal";
import { Eye, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface OfferListItemProps {
  offer: PartnerOffer;
}

/**
 * OfferListItem Component:
 * Bordered card, ~59px square image thumbnail, offer name,
 * points cost right-aligned (e.g. "-8500 points"), plus a small grey view button with eye icon.
 */
export function OfferListItem({ offer }: OfferListItemProps) {
  const formattedPoints = `-${offer.pointsCost.toLocaleString()} points`;

  return (
    <Card className="w-full bg-white border border-black/5 rounded-2xl p-0 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
      <CardContent className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
        {/* Left Section: Thumbnail & Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* ~56px Square Image Thumbnail */}
          <div className="w-14 h-14 bg-gradient-to-br from-[#FFEFE8] to-[#FCE7DF] rounded-xl flex items-center justify-center text-[#FF6433] shrink-0 border border-orange-200/60 shadow-2xs">
            <Tag className="w-6 h-6 stroke-[1.8]" />
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-[14px] sm:text-[15px] font-medium text-slate-900 leading-snug truncate">
              {offer.name}
            </h3>
            <p className="text-[12px] font-medium text-slate-400 line-clamp-1 mt-0.5">
              {offer.description}
            </p>
          </div>
        </div>

        {/* Right Section: Points Cost & View Button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[13px] font-medium text-[#FF6433]">
            {formattedPoints}
          </span>

          <Link
            href={`/partner/offers/${offer.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[12px] font-medium transition-colors cursor-pointer"
            title="View Offer"
            aria-label="View Offer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
