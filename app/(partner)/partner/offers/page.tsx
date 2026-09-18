"use client";

import { useState, useEffect } from "react";
import { OfferListItem } from "@/components/portal/OfferListItem";
import { PartnerOffer } from "@/lib/mock-data/partner-portal";
import { getPartnerOffers } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function OffersListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState<PartnerOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPartnerOffers()
      .then((data) => {
        const mapped: PartnerOffer[] = (Array.isArray(data) ? data : []).map((o: any) => ({
          id: o.id,
          name: o.name,
          description: o.description,
          pointsCost: Number(o.pointsCost || 0),
        }));
        setOffers(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch offers:", err);
        setOffers([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredOffers = offers.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Search Bar Row between top header and bottom card */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2.5 shrink-0">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers & items..."
            className="w-full h-11 py-2 px-4 bg-[#1a1a1e] border border-white/10 rounded-xl text-[14px] font-medium text-white placeholder-white/40 focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] text-white border border-white/15 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
          aria-label="Search Offers"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Header: Title and Count */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
            Store Offers
          </h1>
          <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
            {filteredOffers.length} Active Offers
          </span>
        </div>

        {/* Offers List */}
        <div className="flex flex-col gap-3.5">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF6433]" />
            </div>
          ) : filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <OfferListItem key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="p-8 text-center bg-white border border-black/5 rounded-2xl shadow-2xs">
              <p className="text-slate-500 text-[14px] font-medium">
                {searchQuery
                  ? `No offers found matching "${searchQuery}".`
                  : "No store offers active yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
