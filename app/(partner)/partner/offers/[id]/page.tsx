"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MOCK_PARTNER_OFFERS, PartnerOffer } from "@/lib/mock-data/partner-portal";
import { Button } from "@/components/ui/button";
import { Tag, Pencil, ChevronLeft, CheckCircle2, Sparkles } from "lucide-react";

export default function SingleOfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [isDiscountAdded, setIsDiscountAdded] = useState(false);

  const offer: PartnerOffer =
    MOCK_PARTNER_OFFERS.find((o) => o.id === resolvedParams.id) ||
    MOCK_PARTNER_OFFERS[0];

  const formattedPointsCost = offer.pointsCost.toLocaleString();

  const handleAddDiscount = () => {
    setIsDiscountAdded(true);
    setTimeout(() => {
      setIsDiscountAdded(false);
    }, 2500);
  };

  return (
    <div className="relative flex-1 flex flex-col w-full h-full overflow-hidden bg-black select-none">
      {/* Hero Visual Block */}
      <div className="relative h-64 sm:h-72 w-full bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#0c0a09] flex items-center justify-center overflow-hidden shrink-0">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-[#FF6433]">
          <Tag className="w-16 h-16 stroke-[1.6] opacity-90" />
          <span className="text-[13px] font-medium mt-2 text-white/70">
            Merchant Partner Offer
          </span>
        </div>

        {/* Floating Back Button */}
        <Link
          href="/partner/offers"
          className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95"
          aria-label="Back to offers"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2]" />
        </Link>

        {/* Store Offer Pill Badge */}
        <div className="absolute top-4 right-4 z-30 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[12px] font-medium text-white shadow-xs">
          Exclusive Deal
        </div>

        {/* Gradient Fade to Bottom Sheet */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Sheet Container */}
      <div className="relative z-20 flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] -mt-6 pt-3 px-5 pb-8 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col gap-4 pt-1">
          {/* Title Row with Edit Affordance */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-[20px] sm:text-[22px] font-medium text-slate-900 tracking-tight leading-snug">
              {offer.name}
            </h1>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-full shadow-2xs border border-black/5 transition-colors shrink-0 cursor-pointer"
              aria-label="Edit Offer"
              title="Edit Offer"
            >
              <Pencil className="w-4 h-4 text-[#FF6433]" />
            </button>
          </div>

          {/* Points Cost Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#FF6433] rounded-full text-[13px] font-medium border border-orange-200/60 w-fit">
            <span>{formattedPointsCost} Points Required</span>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-xs">
            <span className="text-[12px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Offer Details
            </span>
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
              {offer.description}
            </p>
          </div>

          {/* Edit Affordance Notice */}
          {isEditing && (
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-[12px] text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">Store Manager Editing</span>
                <span className="text-amber-800/80 font-medium">
                  Offer parameters and point valuation can be updated in the Partner Studio Portal.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button Fixed at Bottom */}
        <div className="pt-3 shrink-0">
          <Button
            type="button"
            onClick={handleAddDiscount}
            className={`w-full h-12 text-[14px] font-medium text-white rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isDiscountAdded
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#FF6433] hover:bg-[#E84A23] active:scale-[0.985]"
            }`}
          >
            {isDiscountAdded ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Discount Applied to Cart!</span>
              </>
            ) : (
              <span>Add Discount to Session</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
