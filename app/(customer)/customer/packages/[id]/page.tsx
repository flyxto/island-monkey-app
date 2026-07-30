"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { MOCK_PACKAGES, PackageItem } from "@/lib/mock-data/customer-portal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Clock,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

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

  const handleBookNow = () => {
    setSelectedPackage(pkg);
    router.push(`/customer/booking?packageId=${pkg.id}`);
  };

  return (
    <div className="flex flex-col gap-6 -mt-8 -mx-4 pb-12">
      {/* Hero Banner with Gradient Overlay */}
      <div className="relative h-[228px] bg-[#d3e4fe] flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-[#4648d4]/70">
          <Camera className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Studio Production</span>
        </div>

        {/* Back Button */}
        <Link
          href="/customer/packages"
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#0b1c30] hover:bg-white transition-colors z-20 shadow-sm"
          aria-label="Back to packages"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Bottom Fade Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f8f9ff] to-transparent pointer-events-none" />
      </div>

      <div className="px-4 flex flex-col gap-6 -mt-16 z-10">
        {/* Overlapping Detail Card using shadcn Card */}
        <Card className="bg-white rounded-xl p-0 border border-[#c6c6cd] shadow-lg">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                {pkg.isBestSeller && (
                  <Badge className="self-start px-3 py-1 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold rounded-full mb-1 hover:bg-[#e1e0ff] border-none">
                    Best Seller
                  </Badge>
                )}
                <h1 className="text-[24px] font-medium text-[#0b1c30] leading-tight">
                  {pkg.name}
                </h1>
              </div>

              {/* Price right-aligned */}
              <span className="text-[24px] font-medium text-[#0b1c30] shrink-0">
                {formattedPrice}
              </span>
            </div>

            <p className="text-[16px] text-[#45464d] leading-relaxed">
              {pkg.description}
            </p>

            {/* Stat Chips */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-[#e1e0ff] border border-[#4648d4]/20 rounded-lg text-[#4648d4] font-medium text-[14px]">
                <Clock className="w-4 h-4" />
                <span>{pkg.durationHours}</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-[#e1e0ff] border border-[#4648d4]/20 rounded-lg text-[#4648d4] font-medium text-[14px]">
                <Building2 className="w-4 h-4" />
                <span>{pkg.studioName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highlighted Feature Strip */}
        <div className="p-4 bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-[#e1e0ff] rounded-lg text-[#4648d4] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#0b1c30]">
              {pkg.highlightFeature.title}
            </span>
            <span className="text-[13px] text-[#9e9e9e]">
              {pkg.highlightFeature.subtitle}
            </span>
          </div>
        </div>

        {/* What's Included Checklist Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] font-semibold text-[#0b1c30]">
            What&apos;s Included
          </h2>

          <Card className="bg-white border border-[#c6c6cd] rounded-xl overflow-hidden shadow-sm p-0">
            <CardContent className="p-0 flex flex-col">
              {pkg.whatsIncluded.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 ${
                    index < pkg.whatsIncluded.length - 1
                      ? "border-b border-[#c6c6cd]/30"
                      : ""
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-[#4648d4] shrink-0" />
                  <span className="text-[15px] font-medium text-[#0b1c30]">
                    {item}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sticky/Full-width CTA Button using shadcn Button */}
        <div className="pt-4">
          <Button
            onClick={handleBookNow}
            className="w-full py-3.5 bg-black text-white text-[16px] font-medium rounded-[2px] hover:bg-black/90 active:bg-black/80 transition-all shadow-md text-center h-auto"
          >
            Book Now for {formattedPrice}
          </Button>
        </div>
      </div>
    </div>
  );
}
