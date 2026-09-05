"use client";

import React from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, StatusType } from "./StatusBadge";

// Accept both live-API (priceLkr) and legacy (priceLKR) field names
export type PackageCardItem = {
  id: string;
  name: string;
  description: string;
  priceLkr?: number;
  priceLKR?: number;
  isBestSeller?: boolean;
  durationHours: string | number;
  studioName: string;
  photographersCount?: number;
  metaLine?: string;
  highlightFeature?: { title: string; subtitle: string };
  whatsIncluded?: string[];
};

export interface PackageCardProps {
  packageItem: PackageCardItem;
  onSelect?: (pkg: PackageCardItem) => void;
  priceSuffix?: string;
  detailHref?: string;
  statusBadge?: StatusType;
}

/**
 * Package Card component using shadcn UI components:
 * Top image block (128px tall, light blue bg #d3e4fe) with "Best Seller" badge or StatusBadge overlay.
 * Body (24px padding): name (24px medium), description (16px),
 * bottom row with black "View Package" button (left) and price right-aligned (24px medium, e.g. LKR 24000 or LKR 4500/hr).
 */
export function PackageCard({
  packageItem,
  onSelect,
  priceSuffix = "",
  detailHref,
  statusBadge,
}: PackageCardProps) {
  const price = packageItem.priceLkr ?? packageItem.priceLKR ?? 0;
  const formattedPrice = `LKR ${price.toLocaleString()}${priceSuffix}`;
  const targetHref = detailHref || `/customer/packages/${packageItem.id}`;

  return (
    <Card className="w-full bg-white border border-im-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col p-0 gap-0">
      {/* Top Image Block */}
      <div className="relative h-32 bg-im-hero flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-im-accent/60">
          <Camera className="w-12 h-12 opacity-80" />
          <span className="text-[12px] font-medium mt-1">Studio Photography</span>
        </div>

        {/* Status Badge overlay (Model Portal Gigs) */}
        {statusBadge ? (
          <div className="absolute top-3 left-3">
            <StatusBadge status={statusBadge} />
          </div>
        ) : (
          packageItem.isBestSeller && (
            <Badge className="absolute top-3 left-3 bg-im-accent-light text-im-accent text-[12px] font-semibold px-3 py-1 rounded-full shadow-sm hover:bg-im-accent-light border-none">
              Best Seller
            </Badge>
          )
        )}
      </div>

      {/* Body Section (24px padding using CardContent) */}
      <CardContent className="p-6 flex flex-col flex-1 justify-between">
        <div className="flex flex-col">
          <h3 className="text-[24px] font-medium text-im-heading leading-tight">
            {packageItem.name}
          </h3>
          <p className="text-[16px] text-im-body pt-1 pb-4 leading-normal">
            {packageItem.description}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href={targetHref}
            onClick={() => onSelect?.(packageItem)}
            className="px-4 py-2 bg-im-btn-primary text-white text-[15px] font-medium rounded-xs hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 transition-colors inline-block text-center"
          >
            View Package
          </Link>

          <span className="text-[24px] font-medium text-im-heading tracking-tight">
            {formattedPrice}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
