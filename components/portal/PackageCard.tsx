"use client";

import React from "react";
import Link from "next/link";
import { PackageItem } from "@/lib/mock-data/customer-portal";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PackageCardProps {
  packageItem: PackageItem;
  onSelect?: (pkg: PackageItem) => void;
}

/**
 * Package Card component using shadcn UI components:
 * Top image block (128px tall, light blue bg #d3e4fe) with "Best Seller" badge.
 * Body (24px padding): name (24px medium), description (16px),
 * bottom row with black "View Package" button (left) and price right-aligned (24px medium, e.g. LKR 24000).
 */
export function PackageCard({ packageItem, onSelect }: PackageCardProps) {
  const formattedPrice = `LKR ${packageItem.priceLKR.toLocaleString()}`;

  return (
    <Card className="w-full bg-white border border-[#c6c6cd] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col p-0 gap-0">
      {/* Top Image Block */}
      <div className="relative h-[128px] bg-[#d3e4fe] flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-[#4648d4]/60">
          <Camera className="w-12 h-12 opacity-80" />
          <span className="text-[12px] font-medium mt-1">Studio Photography</span>
        </div>

        {/* Best Seller Badge using shadcn Badge */}
        {packageItem.isBestSeller && (
          <Badge className="absolute top-3 left-3 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold px-3 py-1 rounded-full shadow-sm hover:bg-[#e1e0ff] border-none">
            Best Seller
          </Badge>
        )}
      </div>

      {/* Body Section (24px padding using CardContent) */}
      <CardContent className="p-6 flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-[24px] font-medium text-[#0b1c30] leading-tight">
            {packageItem.name}
          </h3>
          <p className="text-[16px] text-[#45464d] leading-normal line-clamp-2">
            {packageItem.description}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#c6c6cd]/30 mt-2">
          <Link
            href={`/customer/packages/${packageItem.id}`}
            onClick={() => onSelect?.(packageItem)}
            className="px-4 py-2 bg-black text-white text-[15px] font-medium rounded-[2px] hover:bg-black/90 active:bg-black/80 transition-colors inline-block text-center"
          >
            View Package
          </Link>

          <span className="text-[24px] font-medium text-[#0b1c30] tracking-tight">
            {formattedPrice}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
