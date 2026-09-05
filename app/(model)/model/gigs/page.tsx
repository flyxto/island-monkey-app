"use client";

import { useState, useEffect } from "react";
import { PackageCard } from "@/components/portal/PackageCard";
import { getGigs } from "@/lib/api/model";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertCircle } from "lucide-react";

interface Gig {
  id: string;
  title: string;
  description: string;
  hourlyRateLkr: number;
  status: string;
  durationHours: string;
  venueName: string;
  highlightTitle?: string;
  highlightSubtitle?: string;
  whatsIncluded?: string[];
}

export default function MyGigsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGigs()
      .then((data) => setGigs(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = gigs.filter(
    (gig) =>
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">My Gigs</h1>
        <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
          {gigs.length} Available
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
            className="w-full h-11 pl-4.5 bg-white border border-im-border rounded-full text-[15px] focus-visible:ring-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-im-accent-light text-im-accent rounded-full flex items-center justify-center shrink-0"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Gig Cards */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-im-accent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-12 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((gig) => (
            <PackageCard
              key={gig.id}
              packageItem={{
                id: gig.id,
                name: gig.title,
                description: gig.description,
                priceLKR: gig.hourlyRateLkr,
                durationHours: gig.durationHours,
                studioName: gig.venueName,
                photographersCount: 1,
                metaLine: `${gig.durationHours} • ${gig.venueName}`,
                highlightFeature: {
                  title: gig.highlightTitle || gig.title,
                  subtitle: gig.highlightSubtitle || "",
                },
                whatsIncluded: gig.whatsIncluded || [],
              }}
              priceSuffix="/hr"
              detailHref={`/model/gigs/${gig.id}`}
              statusBadge={gig.status as any}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-im-border rounded-xl">
            <p className="text-[#9e9e9e] text-[15px]">
              {searchQuery ? `No gigs matching "${searchQuery}".` : "No gigs available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
