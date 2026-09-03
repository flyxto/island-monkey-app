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
    <Card className="w-full bg-white border border-im-border rounded-xl p-0 shadow-2xs hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-3.5 flex items-center justify-between gap-3">
        {/* Left Section: Thumbnail & Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* ~59px Square Image Thumbnail */}
          <div className="w-14.75 h-14.75 bg-im-hero rounded-lg flex items-center justify-center text-im-accent shrink-0 border border-im-border/40">
            <Tag className="w-6 h-6" />
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-semibold text-black leading-tight wrap">
              {offer.name}
            </h3>
            <p className="text-[13px] text-im-body line-clamp-1 mt-0.5">
              {offer.description}
            </p>
          </div>
        </div>

        {/* Right Section: Points Cost & Eye Button */}
        <div className="flex flex-col items-center gap-2.25 shrink-0">
          <span className="text-[12px] font-semibold text-im-accent">
            {formattedPoints}
          </span>

          <Link
            href={`/partner/offers/${offer.id}`}
            className="flex items-center gap-2.5 w-full p-2 bg-slate-100 hover:bg-im-accent-light text-im-body hover:text-im-accent rounded-lg transition-colors"
            title="View Offer"
            aria-label="View Offer"
          >
            <Eye className="w-4 h-4" />
            <p className="text-[12px]">View</p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
