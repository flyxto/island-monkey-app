"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PackageCard } from "@/components/portal/PackageCard";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { getGigs } from "@/lib/api";

export default function MyGigsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGigs() {
      try {
        setIsLoading(true);
        // Backend models/me doesn't return detailed gigs out of the box in the /models endpoint
        // Wait, the /gigs endpoint returns all gigs, but with userId filter for models
        const data = await getGigs();
        setGigs(data);
      } catch (error) {
        console.error("Failed to fetch gigs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGigs();
  }, []);

  const filteredGigs = gigs.filter(
    (gig) =>
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
            My Gigs
          </h1>
          <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
            {gigs.length} Total Gigs
          </span>
        </div>
        <Link 
          href="/model/gigs/create"
          className="flex items-center gap-2 px-4 py-2 bg-im-heading text-white rounded-lg hover:bg-im-heading/90 transition-colors text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Gig
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Gigs..."
            className="w-full h-11 py-2.25 pl-4.5 pr-6.25 bg-white border border-im-border rounded-full text-[15px] text-im-heading placeholder-[#9e9e9e] focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-im-accent-light text-im-accent rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-im-accent/90 hover:text-im-accent-light transition-colors"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Gig Cards List */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-im-accent animate-spin" />
          </div>
        ) : filteredGigs.length > 0 ? (
          filteredGigs.map((gig) => (
            <PackageCard
              key={gig.id}
              packageItem={{
                id: gig.id,
                name: gig.title,
                description: gig.description,
                priceLKR: gig.hourlyRateLkr || gig.hourlyRateLKR || 0, // Fallback for case variations
                durationHours: gig.durationHours,
                studioName: gig.venueName,
                photographersCount: 1,
                metaLine: `${gig.durationHours} • ${gig.venueName}`,
                highlightFeature: {
                  title: gig.highlightTitle,
                  subtitle: gig.highlightSubtitle,
                },
                whatsIncluded: gig.whatsIncluded || [],
              }}
              priceSuffix="/hr"
              detailHref={`/model/gigs/${gig.id}`}
              editHref={`/model/gigs/${gig.id}/edit`}
              statusBadge={gig.status}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-im-border rounded-xl">
            <p className="text-[#9e9e9e] text-[15px]">
              {gigs.length === 0 
                ? "You haven't created any gigs yet."
                : `No gigs found matching "${searchQuery}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
