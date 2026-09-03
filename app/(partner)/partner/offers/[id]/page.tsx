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
    <div className="flex flex-col gap-8 -mt-8 -mx-4 pb-12">
      {/* Large Hero Image Block */}
      <div className="relative h-90 bg-im-hero flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-im-accent/70">
          <Tag className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Merchant Store Offer</span>
        </div>

        {/* Back Button */}
        <Link
          href="/partner/offers"
          className="absolute top-10 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-im-heading hover:bg-white transition-colors z-20 shadow-sm"
          aria-label="Back to offers"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Bottom Fade Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#f8f9ff] to-transparent pointer-events-none" />
      </div>

      <div className="px-4 flex flex-col gap-8 -mt-4 z-11">
        {/* Main Offer Card */}
        <div className="rounded-xl p-0">
          <div className="p-1 flex flex-col gap-4">
            {/* Title Row with Edit Pencil Button */}
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-[20px] font-semibold text-[#000000] leading-tight">
                {offer.name}
              </h1>

              {/* Edit Pencil Icon Button */}
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-slate-100 hover:bg-im-accent-light text-im-body hover:text-im-accent rounded-lg transition-colors shrink-0"
                aria-label="Edit Offer"
                title="Edit Offer"
              >
                <Pencil className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Affordance Notice */}
            {isEditing && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">Edit Affordance Triggered</strong>
                  Merchant offer editing interface form can be expanded here for store managers.
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-[16px] text-im-body leading-relaxed">
              {offer.description}
            </p>

            {/* Points Value Card */}
            <div className="mt-4 pt-4 px-5.25 pb-4 bg-white border border-[#E8E8E8] rounded-xl flex items-center justify-between">
              <span className="text-[24px] font-semibold text-im-body">
                Points
              </span>
              <span className="text-[48px] font-bold text-im-accent">
                {formattedPointsCost}
              </span>
            </div>
          </div>
        </div>

        {/* Full-width Black "Add Discount" Button (4px radius) */}
        <Button
          type="button"
          onClick={handleAddDiscount}
          className={`w-full h-12 text-[16px] font-medium text-white rounded-lg transition-all shadow-md flex items-center justify-center gap-2 ${
            isDiscountAdded
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80"
          }`}
        >
          {isDiscountAdded ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Discount Applied to Cart!</span>
            </>
          ) : (
            <span>Add Discount</span>
          )}
        </Button>
      </div>
    </div>
  );
}
