"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { MOCK_GIGS, GigItem } from "@/lib/mock-data/model-portal";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ChevronLeft,
  Pencil,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

export default function SingleGigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [isApplied, setIsApplied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const gig: GigItem =
    MOCK_GIGS.find((g) => g.id === resolvedParams.id) || MOCK_GIGS[0];

  const formattedHourlyRate = `LKR ${gig.hourlyRateLKR.toLocaleString()}/hr`;

  const handleApply = () => {
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-6 -mt-8 -mx-4 pb-12">
      {/* Hero Image Container */}
      <div className="relative h-[228px] bg-[#d3e4fe] flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-[#4648d4]/70">
          <Camera className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Talent Gig Preview</span>
        </div>

        {/* Back Button */}
        <Link
          href="/model/gigs"
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#0b1c30] hover:bg-white transition-colors z-20 shadow-sm"
          aria-label="Back to gigs"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Bottom Fade Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f8f9ff] to-transparent pointer-events-none" />
      </div>

      <div className="px-4 flex flex-col gap-6 -mt-16 z-10">
        {/* Gallery Thumbnails Row (4 small thumbnails) */}
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              className={`h-16 rounded-lg bg-[#d3e4fe] border-2 flex items-center justify-center text-[#4648d4] transition-all overflow-hidden ${
                selectedImageIndex === idx
                  ? "border-[#4648d4] ring-2 ring-[#4648d4]/30"
                  : "border-white/80 opacity-70"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Main Detail Card */}
        <Card className="bg-white rounded-xl border border-[#c6c6cd] shadow-lg p-0">
          <CardContent className="p-6 flex flex-col gap-4">
            {/* Title Row + Pencil Edit Button */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-[24px] font-medium text-[#0b1c30] leading-tight">
                {gig.title}
              </h1>

              <button
                type="button"
                className="p-2 bg-slate-100 hover:bg-[#e1e0ff] text-[#45464d] hover:text-[#4648d4] rounded-lg transition-colors shrink-0"
                aria-label="Edit gig details"
                title="Edit Gig"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[16px] text-[#45464d] leading-relaxed">
              {gig.description}
            </p>

            {/* Status Row */}
            <div className="flex items-center justify-between py-2 border-t border-b border-[#c6c6cd]/30">
              <span className="text-[14px] text-[#9e9e9e] font-medium">Status</span>
              <StatusBadge status={gig.status} />
            </div>

            {/* Price Row */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#9e9e9e] font-medium">Price :</span>
              <span className="text-[22px] font-bold text-[#0b1c30]">
                {formattedHourlyRate}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Full-width Black CTA Button: Apply for Gig */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={handleApply}
            className={`w-full h-12 text-[16px] font-medium text-white rounded-[2px] transition-all shadow-md flex items-center justify-center gap-2 ${
              isApplied
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-black hover:bg-black/90 active:bg-black/80"
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Application Submitted!</span>
              </>
            ) : (
              <span>Apply for Gig</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
