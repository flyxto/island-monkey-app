"use client";

import { use } from "react";
import Link from "next/link";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { CheckCircle, Calendar, Sparkles } from "lucide-react";

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
    <div className="flex flex-col gap-6 py-4">
      {/* Success Banner */}
      <div className="bg-white border border-im-border rounded-xl p-6 shadow-md flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-im-accent-light rounded-full flex items-center justify-center text-im-accent">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full self-center">
            Booking Ready
          </span>
          <h1 className="text-[24px] font-bold text-im-heading mt-1">
            Session Reserved
          </h1>
          <p className="text-[14px] text-im-body">
            Your booking details are locked in. Present your QR code at the studio.
          </p>
        </div>

        <div className="w-full pt-4 border-t border-im-border/40 flex flex-col gap-3 text-left">
          <div className="flex items-center justify-between text-[15px]">
            <span className="text-[#9e9e9e]">Package</span>
            <span className="font-semibold text-im-heading">
              {selectedPackage.name}
            </span>
          </div>

          <div className="flex items-center justify-between text-[15px]">
            <span className="text-[#9e9e9e]">Date & Time</span>
            <span className="font-semibold text-im-heading flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-im-accent" />
              {bookingDate} at {bookingTime}
            </span>
          </div>

          <div className="flex items-center justify-between text-[15px]">
            <span className="text-[#9e9e9e]">Studio & Crew</span>
            <span className="font-semibold text-im-heading">
              {selectedPackage.metaLine}
            </span>
          </div>

          <div className="flex items-center justify-between text-[16px] pt-2 border-t border-im-border/30">
            <span className="font-bold text-im-heading">Total Amount</span>
            <span className="font-bold text-[20px] text-im-accent">
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Integration Handoff Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-[13px] leading-relaxed">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block">
            TODO / Payment Gateway Handoff Point
          </strong>
          This screen completes the booking preview flow. Connect your Sri Lanka payment gateway or points-redemption API at this step.
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href="/customer"
          className="w-full py-3.5 bg-black text-white text-[16px] font-medium rounded-xs hover:bg-black/90 transition-all text-center"
        >
          Return to Home
        </Link>
        <Link
          href="/customer/sessions"
          className="w-full py-3 bg-white text-im-accent text-[15px] font-semibold rounded-xs border border-im-border hover:border-im-accent transition-all text-center"
        >
          View My Sessions
        </Link>
      </div>
    </div>
  );
}
