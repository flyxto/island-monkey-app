"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ProgressiveBlur } from "@/components/portal/ProgressiveBlur";
import { getModelBooking, acceptModelBooking } from "@/lib/api";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Camera,
  Loader2,
} from "lucide-react";

const BOOKING_HERO_IMAGES: Record<string, string> = {
  bk_001: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=85",
  bk_002: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85",
  bk_003: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=85",
  bk_004: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&auto=format&fit=crop&q=85",
  bk_005: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&auto=format&fit=crop&q=85",
};

export default function SingleBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const data = await getModelBooking(resolvedParams.id);
        setBooking(data);
      } catch (error) {
        console.error("Failed to load booking details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooking();
  }, [resolvedParams.id]);

  const activeStatus = (booking?.status || "pending").toLowerCase();
  const paymentAmount = booking?.paymentLkr ?? booking?.paymentLKR ?? 0;
  const formattedPayment = `LKR ${Number(paymentAmount).toLocaleString()}`;

  const heroImage =
    booking && (BOOKING_HERO_IMAGES[booking.id] ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=85");

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      setActionFeedback("Accepting...");
      await acceptModelBooking(booking.id);
      setBooking((prev: any) => ({ ...prev, status: "accepted" }));
      setActionFeedback("Accepted!");
      setTimeout(() => {
        setActionFeedback(null);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to accept booking:", error);
      alert(error.message || "Failed to accept booking");
      setActionFeedback(null);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = () => {
    setActionFeedback("Declined");
    setBooking((prev: any) => ({ ...prev, status: "rejected" }));
    setTimeout(() => {
      setActionFeedback(null);
    }, 1500);
  };

  const sessionDeliverables = [
    "Commercial Model Usage Rights",
    "On-Set Wardrobe & Styling Access",
    "High-Resolution Photo Masters",
    "Verified Escrow Payment Protection",
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6433]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen text-slate-500">
        <p className="text-[15px]">Booking not found.</p>
        <Link
          href="/model/bookings"
          className="px-5 py-2.5 bg-[#FF6433] text-white text-[13px] font-medium rounded-full shadow-xs hover:bg-[#E84A23] transition-colors"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full h-svh max-h-svh flex flex-col justify-between overflow-hidden overscroll-none touch-none select-none">
      {/* Full Background Hero Image from Top to Bottom behind Card */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={booking.clientName}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Progressive Blur behind the Card */}
      <ProgressiveBlur
        className="absolute inset-x-0 bottom-0 z-10 w-full pointer-events-none"
        height="h-[65vh]"
      />

      {/* Top Floating Back Button */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <Link
          href="/model/bookings"
          className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer"
          aria-label="Back to bookings"
        >
          <ChevronLeft className="w-5 h-5 -ml-0.5 text-slate-800" />
        </Link>
      </div>

      {/* Spacer to push card to bottom while revealing background hero image */}
      <div className="flex-1 min-h-0 pointer-events-none" />

      {/* Bottom Sheet Card Container */}
      <div className="relative z-20 mx-2.5 sm:mx-4 mb-2.5 sm:mb-4 bg-white rounded-[36px] p-5 sm:p-6 pt-3 flex flex-col gap-3.5 shadow-2xl shrink-0 max-h-[85vh] overflow-hidden">
        {/* Top Notch Indicator */}
        <div className="w-10 h-1 bg-[#FF6433] rounded-full mx-auto my-1 shrink-0" />

        {/* Client Name + Status Badge */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[22px] sm:text-[24px] font-medium text-slate-900 leading-tight tracking-tight truncate">
            {booking.clientName}
          </h1>
          <StatusBadge status={activeStatus} className="shrink-0" />
        </div>

        {/* Short Subtitle / Notes preview */}
        <p className="text-[14px] font-normal text-slate-500 leading-relaxed line-clamp-2">
          {booking.notes || "Commercial shoot session booking with client."}
        </p>

        {/* Total Payment Highlight */}
        <div className="flex items-baseline justify-between">
          <div className="text-[18px] font-medium text-[#FF6433] leading-none">
            {formattedPayment}
          </div>
          <span className="text-[12px] font-medium text-slate-400">
            Total Compensation
          </span>
        </div>

        {/* Metadata / Variant Pills Row */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <div className="py-2 px-3.5 rounded-full text-[13px] font-medium bg-[#F1F3F2] text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{booking.dateTime}</span>
          </div>
          <div className="py-2 px-3.5 rounded-full text-[13px] font-medium bg-[#F1F3F2] text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{booking.duration}</span>
          </div>
          <div className="py-2 px-3.5 rounded-full text-[13px] font-medium bg-[#F1F3F2] text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{booking.location}</span>
          </div>
        </div>

        {/* Expandable Details Container */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden max-h-[38vh] overflow-y-auto overscroll-contain touch-auto pr-0.5 flex flex-col gap-3.5 pt-1">
            {/* Client Instructions Box */}
            {booking.notes && (
              <div className="bg-[#F6F8F7] border border-[#E3E8E5] rounded-2xl p-3.5 flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#FF6433]" />
                  Client Instructions & Notes
                </span>
                <span className="text-[13px] font-normal text-slate-600 leading-relaxed">
                  {booking.notes}
                </span>
              </div>
            )}

            {/* Session Deliverables / Protection */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[13px] font-medium text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF6433]" />
                Booking Includes & Terms
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sessionDeliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[13px] font-normal text-slate-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#FF6433]/15 text-[#FF6433] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[12px] font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 self-center pt-1 transition-colors cursor-pointer"
            >
              <span>Show Less</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="pt-2">
          {!isExpanded ? (
            /* First State: Show Read More button with Gigs Card Glass Style (White) */
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-900 flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
            >
              {/* Upper Specular Glass Sheen */}
              <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />

              {/* Button Label */}
              <span className="relative z-10 text-slate-900 tracking-tight flex items-center gap-2">
                <span>View Details</span>
                <ChevronDown className="w-4 h-4 text-slate-700" />
              </span>
            </button>
          ) : activeStatus === "pending" ? (
            /* Pending State: Decline + Accept Action Buttons */
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleReject}
                className="h-12 px-5 bg-neutral-100 hover:bg-neutral-200 text-slate-700 rounded-full font-medium text-[14px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="relative overflow-hidden flex-1 h-12 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_24px_rgba(232,74,35,0.35)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
              >
                {/* Upper Specular Glass Sheen */}
                <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />

                <span className="relative z-10 text-white tracking-tight flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{actionFeedback || "Accept Booking"}</span>
                </span>
              </button>
            </div>
          ) : activeStatus === "rejected" ? (
            /* Rejected State: Soft Rose Theme Pill with Specular Glass Effect */
            <div className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-rose-50 via-[#FFF1F2] to-[#FFE4E6] border border-rose-200/90 rounded-full font-medium text-[14px] text-rose-800 flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.9),inset_0_-1.5px_3px_rgba(0,0,0,0.03),0_2px_8px_rgba(225,29,72,0.08)]">
              {/* Upper Specular Glass Sheen */}
              <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />

              <span className="relative z-10 w-5 h-5 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
                <X className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="relative z-10 tracking-tight font-medium">
                Booking is Rejected
              </span>
            </div>
          ) : activeStatus === "accepted" ? (
            /* Accepted State: Soft Emerald Theme Pill with Specular Glass Effect */
            <div className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-emerald-50 via-[#ECFDF5] to-[#D1FAE5] border border-emerald-200/90 rounded-full font-medium text-[14px] text-emerald-800 flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.9),inset_0_-1.5px_3px_rgba(0,0,0,0.03),0_2px_8px_rgba(5,150,105,0.08)]">
              {/* Upper Specular Glass Sheen */}
              <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />

              <span className="relative z-10 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="relative z-10 tracking-tight font-medium">
                Booking is Accepted
              </span>
            </div>
          ) : (
            /* Completed State: Sleek Slate Pill */
            <div className="relative overflow-hidden w-full h-12 bg-gradient-to-b from-slate-50 via-[#F8FAFC] to-[#EDF2F7] border border-slate-200/90 rounded-full font-medium text-[14px] text-slate-700 flex items-center justify-center gap-2 shadow-2xs">
              {/* Upper Specular Glass Sheen */}
              <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />

              <span className="relative z-10 w-5 h-5 rounded-full bg-slate-500/15 text-slate-600 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="relative z-10 tracking-tight font-medium">
                Booking is Completed
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
