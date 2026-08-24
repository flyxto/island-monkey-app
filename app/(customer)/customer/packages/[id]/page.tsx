"use client";

import { use } from "react";
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
  Aperture,
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
    <div className="flex flex-col -mt-6.5 -mx-4 pb-12">
      {/* Hero Banner with Gradient Overlay */}
      <div className="relative h-57 bg-im-hero flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-im-accent/70">
          <Camera className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Studio Production</span>
        </div>

        {/* Back Button */}
        <Link
          href="/customer/packages"
          className="absolute top-10 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-im-heading hover:bg-white transition-colors z-20 shadow-sm"
          aria-label="Back to packages"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Bottom Fade Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#f8f9ff] to-transparent pointer-events-none" />
      </div>

      <div className="px-4 flex flex-col gap-6 -mt-16 z-10">
        {/* Overlapping Detail Card using shadcn Card */}
        <Card className="bg-white rounded-xl p-0 border border-im-border shadow-lg">
          <CardContent className="p-4 flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                {pkg.isBestSeller && (
                  <Badge className="self-start px-3 pt-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full mb-1 hover:bg-im-accent-light border-none">
                    Best Seller
                  </Badge>
                )}
                <h1 className="text-[24px] font-medium text-im-heading leading-tight">
                  {pkg.name}
                </h1>
              </div>
            </div>

            <p className="text-[16px] text-im-body leading-relaxed">
              {pkg.description}
            </p>
            {/* Price right-aligned */}
            <span className="text-[24px] font-medium text-im-heading shrink-0">
              {formattedPrice}
            </span>
          </CardContent>
        </Card>

        {/* Stat Chips */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex flex-col flex-1 items-center justify-center gap-2 p-3 bg-im-accent-light border border-[#B7C7FF] rounded-lg text-im-accent font-medium text-[20px]">
            <Clock className="w-7 h-7 fill-current stroke-im-accent-light stroke-1.5" />
            <p>{pkg.durationHours}</p>
          </div>
          <div className="flex flex-col flex-1 items-center justify-center gap-2 p-3 bg-im-accent-light border border-[#B7C7FF] rounded-lg text-im-accent font-medium text-[20px]">
            <Building2 className="w-7 h-7 " />
            <p>{pkg.studioName}</p>
          </div>
        </div>

        {/* Highlighted Feature Strip */}
        <div className="p-4 bg-[#f8f9ff] border border-im-border/60 rounded-xl flex flex-initial items-center gap-4.5 shadow-2xs">
          <div className="p-2.5 bg-im-accent-light rounded-lg text-im-accent">
            <Aperture className="w-7 h-7 fill-current stroke-im-accent-light stroke-1" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-im-heading">
              {pkg.highlightFeature.title}
            </span>
            <span className="text-[13px] text-[#9e9e9e]">
              {pkg.highlightFeature.subtitle}
            </span>
          </div>
        </div>

        {/* What's Included Checklist Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] font-semibold text-[#000000]">
            What&apos;s Included
          </h2>

          <Card className="bg-white border border-im-border/30 rounded-xl overflow-hidden shadow-sm p-0">
            <CardContent className="p-0 flex flex-col">
              {pkg.whatsIncluded.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 ${
                    index < pkg.whatsIncluded.length - 1
                      ? "border-b border-im-border/30"
                      : ""
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6 text-im-accent shrink-0 bg-[#E5EEFF] rounded-full" />
                  <span className="text-[15px] font-medium text-im-heading">
                    {item}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sticky/Full-width CTA Button using shadcn Button */}
        <div className="pt-2">
          <Button
            onClick={handleBookNow}
            className="w-full py-3.75 bg-im-btn-primary text-white text-[14px] font-medium rounded-xs hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 transition-all text-center h-auto"
          >
            Book Now for {formattedPrice}
          </Button>
        </div>
      </div>
    </div>
  );
}
