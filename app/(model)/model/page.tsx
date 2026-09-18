"use client";

import Link from "next/link";
import { MOCK_BOOKINGS } from "@/lib/mock-data/model-portal";
import { useModel } from "@/lib/portal/ModelContext";
import { Info, History, Camera, Calendar, ArrowRight, Loader2, Check, Clock } from "lucide-react";

export default function ModelHomePage() {
  const { user, balance, isLoadingUser, error } = useModel();
  const upcomingSampleBookings = MOCK_BOOKINGS.slice(0, 2);

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-im-heading">Profile Not Found</h2>
          <p className="text-im-muted text-sm mt-1 max-w-sm">
            {error}. You may have registered as a model, but a complete model profile hasn't been set up yet. Please contact support to set up your profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingUser || !user || !balance) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-im-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4">
      {/* Quick Actions Row: White Glass Style matching Gigs Card */}
      <div className="px-3 pt-2 pb-0.5 flex items-center gap-2.5 shrink-0">
        <Link
          href="/model/bookings"
          className="relative overflow-hidden flex-1 h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-2xl font-medium text-[13px] text-slate-900 px-4 flex items-center justify-between shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all group cursor-pointer"
        >
          {/* Upper Specular Glass Sheen */}
          <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-2xl pointer-events-none" />
          <span className="relative z-10 text-slate-900 tracking-tight">History</span>
          <History className="relative z-10 w-4 h-4 text-slate-700 group-hover:text-slate-950 transition-colors" />
        </Link>

        <Link
          href="/model/bookings"
          className="relative overflow-hidden w-12 h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-2xl text-slate-900 flex items-center justify-center shrink-0 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
          title="Calendar Schedule"
        >
          {/* Upper Specular Glass Sheen */}
          <div className="absolute inset-x-1.5 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-2xl pointer-events-none" />
          <Calendar className="relative z-10 w-4.5 h-4.5 text-slate-800" />
        </Link>

        <Link
          href="/model/gigs"
          className="relative overflow-hidden flex-1 h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-2xl font-medium text-[13px] text-slate-900 px-4 flex items-center justify-between shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all group cursor-pointer"
        >
          {/* Upper Specular Glass Sheen */}
          <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-2xl pointer-events-none" />
          <span className="relative z-10 text-slate-900 tracking-tight">Find Gigs</span>
          <Camera className="relative z-10 w-4 h-4 text-slate-700 group-hover:text-slate-950 transition-colors" />
        </Link>
      </div>

      {/* Bottom Sheet Container: Light curved panel with notch, matching reference image */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-28 flex flex-col gap-3 overflow-hidden">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Section Header */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <h2 className="text-[15px] font-medium text-slate-900 tracking-tight">
            Upcoming Bookings
          </h2>
          <Link
            href="/model/bookings"
            className="text-[12px] font-medium text-slate-500 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bookings Card List */}
        <div className="flex flex-col gap-2 overflow-hidden">
          {upcomingSampleBookings.map((booking, idx) => {
            const parts = booking.dateTime.split(" ");
            const month = parts[0] || "Oct";
            const day = (parts[1] || "24").replace(",", "");

            return (
              <Link
                key={booking.id}
                href={`/model/bookings/${booking.id}`}
                className="bg-white rounded-2xl p-3 shadow-xs border border-black/5 flex items-center gap-3.5 hover:shadow-sm transition-all shrink-0"
              >
                {/* Date Column with subtle vertical line */}
                <div className="flex flex-col items-center justify-center w-7 shrink-0">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                    {month}
                  </span>
                  <span className="text-[18px] font-medium text-slate-800 leading-none mt-0.5">
                    {day}
                  </span>
                </div>

                <div className="w-px h-7 bg-slate-200/80 shrink-0" />

                {/* Thumbnail */}
                <div
                  className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center shadow-xs overflow-hidden ${
                    idx === 0
                      ? "bg-linear-to-br from-amber-500 via-orange-500 to-[#E84A23] text-white"
                      : "bg-linear-to-br from-teal-500 via-emerald-500 to-emerald-600 text-white"
                  }`}
                >
                  <Camera className="w-5 h-5 text-white/95" />
                </div>

                {/* Title & Status */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[14px] font-medium text-slate-900 truncate">
                    {booking.clientName}
                  </span>
                  <span className="text-[12px] font-medium text-slate-400 capitalize">
                    {booking.status === "accepted"
                      ? "Upcoming"
                      : booking.status === "pending"
                      ? "Incomplete"
                      : booking.status}
                  </span>
                </div>

                {/* Status Indicator Icon */}
                {booking.status === "accepted" || booking.status === "completed" ? (
                  <div className="w-6.5 h-6.5 rounded-full bg-[#00c08b] flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-6.5 h-6.5 rounded-full border border-slate-300/80 flex items-center justify-center shrink-0 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
