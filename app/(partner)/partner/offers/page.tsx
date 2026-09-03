"use client";

import { useState } from "react";
import { OfferListItem } from "@/components/portal/OfferListItem";
import { MOCK_PARTNER_OFFERS } from "@/lib/mock-data/partner-portal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function OffersListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = MOCK_PARTNER_OFFERS.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-black tracking-tight">
          Store Offers
        </h1>
        <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
          {MOCK_PARTNER_OFFERS.length} Active Offers
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
            className="w-full h-11 pl-4.5 pr-6.25 pb-2.25 pt-2.25 bg-white border border-im-border rounded-full text-[16px] text-[#000000] placeholder-[#6B7280] focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
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
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <OfferListItem key={offer.id} offer={offer} />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-im-border rounded-xl">
            <p className="text-[#9e9e9e] text-[15px]">
              No offers found matching &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
