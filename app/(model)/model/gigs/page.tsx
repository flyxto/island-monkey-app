"use client";

import React, { useState } from "react";
import { PackageCard } from "@/components/portal/PackageCard";
import { MOCK_GIGS } from "@/lib/mock-data/model-portal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MyGigsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGigs = MOCK_GIGS.filter(
    (gig) =>
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#0b1c30] tracking-tight">
          My Gigs
        </h1>
        <span className="px-3 py-1 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold rounded-full">
          {MOCK_GIGS.length} Available Gigs
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Gigs..."
            className="w-full h-11 pl-4 pr-10 bg-white border border-[#c6c6cd] rounded-full text-[15px] text-[#0b1c30] placeholder-[#9e9e9e] focus-visible:ring-[#4648d4] focus-visible:border-[#4648d4] shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-[#4648d4] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-[#4648d4]/90 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Gig Cards List */}
      <div className="flex flex-col gap-6">
        {filteredGigs.length > 0 ? (
          filteredGigs.map((gig) => (
            <PackageCard
              key={gig.id}
              packageItem={{
                id: gig.id,
                name: gig.title,
                description: gig.description,
                priceLKR: gig.hourlyRateLKR,
                durationHours: gig.durationHours,
                studioName: gig.venueName,
                photographersCount: 1,
                metaLine: `${gig.durationHours} • ${gig.venueName}`,
                highlightFeature: {
                  title: gig.highlightTitle,
                  subtitle: gig.highlightSubtitle,
                },
                whatsIncluded: gig.whatsIncluded,
              }}
              priceSuffix="/hr"
              detailHref={`/model/gigs/${gig.id}`}
              statusBadge={gig.status}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-[#c6c6cd] rounded-lg">
            <p className="text-[#9e9e9e] text-[15px]">
              No gigs found matching &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
