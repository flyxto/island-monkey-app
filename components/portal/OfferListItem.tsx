"use client";

import React from "react";
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
    <Card className="w-full bg-white border border-[#c6c6cd] rounded-xl p-0 shadow-2xs hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-3.5 flex items-center justify-between gap-3">
        {/* Left Section: Thumbnail & Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* ~59px Square Image Thumbnail */}
          <div className="w-[59px] h-[59px] bg-[#d3e4fe] rounded-lg flex items-center justify-center text-[#4648d4] shrink-0 border border-[#c6c6cd]/40">
            <Tag className="w-6 h-6" />
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-semibold text-[#000000] leading-tight truncate">
              {offer.name}
            </h3>
            <p className="text-[13px] text-[#45464d] line-clamp-1 mt-0.5">
              {offer.description}
            </p>
          </div>
        </div>

        {/* Right Section: Points Cost & Eye Button */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[14px] font-semibold text-[#4648d4] whitespace-nowrap">
            {formattedPoints}
          </span>

          <Link
            href={`/partner/offers/${offer.id}`}
            className="p-2 bg-slate-100 hover:bg-[#e1e0ff] text-[#45464d] hover:text-[#4648d4] rounded-lg transition-colors"
            title="View Offer"
            aria-label="View Offer"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
