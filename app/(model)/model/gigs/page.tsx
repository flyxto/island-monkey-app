"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_GIGS } from "@/lib/mock-data/model-portal";
import { Input } from "@/components/ui/input";
import { Search, Star, Check } from "lucide-react";

const GIG_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=85",
];

export default function MyGigsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGigs = MOCK_GIGS.filter(
    (gig) =>
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Search Bar Row between top and bottom cards */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2.5 shrink-0">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Gigs..."
            className="w-full h-11 py-2 px-4 bg-[#1a1a1e] border border-white/10 rounded-xl text-[14px] font-medium text-white placeholder-white/40 focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] text-white border border-white/15 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
          aria-label="Search Gigs"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-4 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Header: Title and Count */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
            My Gigs
          </h1>
          <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
            {filteredGigs.length} Available Gigs
          </span>
        </div>

        {/* Gig Cards List */}
        <div className="flex flex-col gap-5">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig, index) => {
              return (
                <div
                  key={gig.id}
                  className="relative w-full rounded-[32px] overflow-hidden shadow-lg bg-neutral-900 aspect-[3/4.2] min-h-[460px] flex flex-col justify-end"
                >
                  {/* Full Background Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={GIG_IMAGES[index % GIG_IMAGES.length]}
                    alt={gig.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />

                  {/* Dark Gradient Overlay for Crisp Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 via-45% to-transparent pointer-events-none" />

                  {/* Bottom Content Container */}
                  <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-3.5">
                    {/* Title + Verified Badge */}
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-[20px] font-medium text-white tracking-tight leading-tight">
                        {gig.title}
                      </h2>
                      <span className="w-5 h-5 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>

                    {/* Tagline / Description */}
                    <p className="text-[13px] font-medium text-white/80 line-clamp-2 leading-relaxed">
                      {gig.description}
                    </p>

                    {/* 3 Metrics Row with Vertical Dividers */}
                    <div className="flex items-center justify-between py-1 px-1">
                      {/* Metric 1: Rating */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="text-[16px] font-medium text-white leading-none">
                            4.8
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-white/60 mt-1.5">
                          Rating
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="w-[1px] h-7 bg-white/20" />

                      {/* Metric 2: Duration */}
                      <div className="flex flex-col items-center">
                        <span className="text-[16px] font-medium text-white leading-none">
                          {gig.durationHours}
                        </span>
                        <span className="text-[11px] font-medium text-white/60 mt-1.5">
                          Duration
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="w-[1px] h-7 bg-white/20" />

                      {/* Metric 3: Rate */}
                      <div className="flex flex-col items-end">
                        <span className="text-[16px] font-medium text-white leading-none">
                          LKR {Math.round(gig.hourlyRateLKR / 1000)}k/hr
                        </span>
                        <span className="text-[11px] font-medium text-white/60 mt-1.5">
                          Rate
                        </span>
                      </div>
                    </div>

                    {/* Action Row: View Package Button (Opaque Glass Effect) */}
                    <div className="pt-1">
                      <Link
                        href={`/model/gigs/${gig.id}`}
                        className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-900 flex items-center justify-center shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.35)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
                      >
                        {/* Upper Specular Glass Sheen */}
                        <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />

                        {/* Button Label */}
                        <span className="relative z-10 text-slate-900 tracking-tight">
                          View Package
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200/60 rounded-2xl shadow-xs">
              <p className="text-slate-500 text-[14px] font-medium">
                No gigs found matching &quot;{searchQuery}&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
