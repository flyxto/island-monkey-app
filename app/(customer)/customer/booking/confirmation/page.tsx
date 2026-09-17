"use client";

import { use } from "react";
import Link from "next/link";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { Check, Calendar, Camera, Sparkles, ArrowRight } from "lucide-react";

export default function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const { selectedPackage } = useCustomer();

  const formattedPrice = `LKR ${selectedPackage.priceLKR.toLocaleString()}`;
  const bookingDate = resolvedParams.date || "2026-06-18";
  const bookingTime = resolvedParams.time || "2:00 PM";

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0 select-none">
      {/* Upper Status Row in Dark Frame */}
      <div className="px-3 pt-2 pb-0.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[15px] font-medium text-white tracking-tight">
            Booking Confirmed
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active Reservation
        </span>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-8 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Confirmation Receipt Card */}
        <div className="bg-white border border-black/5 rounded-[28px] p-5 sm:p-6 shadow-xs flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shadow-xs">
            <Check className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full self-center border border-emerald-200/50">
              Studio Reservation
            </span>
            <h1 className="text-[20px] font-medium text-slate-900 mt-1">
              Session Reserved
            </h1>
            <p className="text-[12px] font-medium text-slate-500 max-w-xs leading-relaxed">
              Your studio booking details are locked in. Present your member QR code when arriving at the studio.
            </p>
          </div>

          {/* Breakdown Card Details */}
          <div className="w-full pt-4 border-t border-dashed border-slate-200 flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-400 font-medium">Package</span>
              <span className="font-medium text-slate-900 text-right">
                {selectedPackage.name}
              </span>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-400 font-medium">Date & Time</span>
              <span className="font-medium text-slate-900 flex items-center gap-1.5 text-right">
                <Calendar className="w-4 h-4 text-[#FF6433]" />
                {bookingDate} • {bookingTime}
              </span>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-400 font-medium">Studio & Crew</span>
              <span className="font-medium text-slate-700 text-right">
                {selectedPackage.metaLine}
              </span>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-400 font-medium">Status</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Confirmed
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="font-medium text-slate-900 text-[14px]">Total Amount</span>
              <span className="font-medium text-[19px] text-[#FF6433]">
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Integration Handoff Notice */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/60 rounded-[20px] flex items-start gap-2.5 text-amber-900 text-[12px] leading-relaxed">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium block text-amber-950">
              Payment & Points Integration Point
            </span>
            This completes the booking reservation flow. Member points balance will update upon studio check-in.
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col gap-2 pt-1 shrink-0">
          <Link
            href="/customer"
            className="w-full py-3.5 bg-linear-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] hover:from-[#FF8A55] hover:to-[#EA5A33] text-white text-[14px] font-medium rounded-full transition-all shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.4),0_8px_20px_rgba(232,74,35,0.25)] active:scale-[0.98] text-center"
          >
            Return to Home
          </Link>
          <Link
            href="/customer/sessions"
            className="w-full py-3 bg-white text-slate-700 hover:text-black text-[13px] font-medium rounded-full border border-white hover:border-slate-300 transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>View My Sessions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
