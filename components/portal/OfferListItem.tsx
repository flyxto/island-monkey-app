"use client";

import Link from "next/link";
import { PartnerOffer } from "@/lib/mock-data/partner-portal";
import { Tag, Sparkles, ArrowRight } from "lucide-react";

export interface OfferListItemProps {
  offer: PartnerOffer;
}

const getOfferBadge = (offer: PartnerOffer) => {
  const id = offer.id.toLowerCase();
  const name = offer.name.toLowerCase();

  if (id.includes("linen") || name.includes("linen")) {
    return { label: "Festive Promo", color: "bg-orange-500/10 text-[#FF6433] border-orange-200/60" };
  }
  if (id.includes("denim") || name.includes("20%")) {
    return { label: "20% Discount", color: "bg-rose-500/10 text-rose-600 border-rose-200/60" };
  }
  if (id.includes("wallet") || name.includes("bundle")) {
    return { label: "Bundle Deal", color: "bg-amber-500/10 text-amber-700 border-amber-200/60" };
  }
  if (id.includes("portrait") || name.includes("voucher")) {
    return { label: "Studio Voucher", color: "bg-purple-500/10 text-purple-600 border-purple-200/60" };
  }
  return { label: "Member Special", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60" };
};

/**
 * OfferListItem Component:
 * Distinctive Retail Promo / Voucher Ticket Card.
 * Features a deal category tag, points cost stamp, perforated coupon tear-line with side punch notches,
 * in-store active status, and an Island Monkey specular action button.
 */
export function OfferListItem({ offer }: OfferListItemProps) {
  const badge = getOfferBadge(offer);

  return (
    <Link
      href={`/partner/offers/${offer.id}`}
      className="group block w-full bg-white rounded-3xl p-4 sm:p-4.5 border border-black/5 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer"
    >
      {/* Top Row: Deal Category Badge + Points Stamp */}
      <div className="flex items-center justify-between gap-2.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${badge.color}`}
        >
          <Tag className="w-3 h-3 stroke-[2]" />
          <span>{badge.label}</span>
        </span>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium bg-orange-50 text-[#FF6433] border border-orange-200/60 shadow-2xs group-hover:bg-[#FF6433] group-hover:text-white transition-colors shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{offer.pointsCost.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Offer Content: Title & Description */}
      <div className="mt-3 flex flex-col">
        <h2 className="text-[15px] sm:text-[16px] font-medium text-slate-900 tracking-tight leading-snug group-hover:text-[#FF6433] transition-colors">
          {offer.name}
        </h2>
        <p className="text-[12px] font-medium text-slate-500 leading-relaxed line-clamp-2 mt-1">
          {offer.description}
        </p>
      </div>

      {/* Perforated Ticket Divider with side punch notches */}
      <div className="relative my-3.5 -mx-4 sm:-mx-4.5 flex items-center">
        {/* Left concave ticket cutout */}
        <div className="w-4 h-4 rounded-full bg-[#DCE0E2] -ml-2 shrink-0 border border-black/5" />

        {/* Dashed voucher tear line */}
        <div className="flex-1 border-t border-dashed border-slate-200/90 mx-1" />

        {/* Right concave ticket cutout */}
        <div className="w-4 h-4 rounded-full bg-[#DCE0E2] -mr-2 shrink-0 border border-black/5" />
      </div>

      {/* Bottom Row: Active Redemption Status & Specular Action CTA */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span>Active In-Store</span>
        </div>

        <div className="relative overflow-hidden h-8 px-3.5 bg-gradient-to-b from-white via-[#F8FAFC] to-[#EDF2F7] border border-slate-200/90 rounded-full font-medium text-[12px] text-slate-900 inline-flex items-center gap-1.5 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.05)] group-hover:brightness-95 transition-all">
          <div className="absolute inset-x-1 top-0.5 h-[44%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />
          <span className="relative z-10 tracking-tight">View Deal</span>
          <ArrowRight className="relative z-10 w-3.5 h-3.5 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
