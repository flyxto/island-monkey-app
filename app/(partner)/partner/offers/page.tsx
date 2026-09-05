"use client";

import { useState, useEffect } from "react";
import { OfferListItem } from "@/components/portal/OfferListItem";
import { getOffers } from "@/lib/api/partner";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertCircle } from "lucide-react";

interface Offer {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  imageUrl?: string;
}

export default function OffersListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOffers()
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = offers.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-black tracking-tight">
          Store Offers
        </h1>
        <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
          {offers.length} Active
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full h-11 pl-4.5 bg-white border border-im-border rounded-full text-[16px] text-[#000000] placeholder-[#6B7280] focus-visible:ring-im-accent shadow-none"
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

      {/* Offers List */}
      <div className="flex flex-col gap-3">
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
          filtered.map((offer) => (
            <OfferListItem key={offer.id} offer={offer} />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-im-border rounded-xl">
            <p className="text-[#9e9e9e] text-[15px]">
              {searchQuery ? `No offers matching "${searchQuery}".` : "No offers yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
