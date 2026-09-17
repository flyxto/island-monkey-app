"use client";

import Link from "next/link";
import {
  MOCK_MODEL_PROFILE,
  MOCK_BOOKINGS,
} from "@/lib/mock-data/model-portal";
import { Info, History, Camera, Bell, Calendar, ArrowRight, Check, Clock } from "lucide-react";

export default function ModelHomePage() {
  const upcomingSampleBookings = MOCK_BOOKINGS.slice(0, 2);
  const [pointsWhole, pointsCents] = MOCK_MODEL_PROFILE.formattedPoints.split(".");

  return (
    <div className="flex flex-col p-1 bg-[#000002] h-full overflow-hidden justify-between gap-5 sm:gap-6">
      {/* Top Hero Container Card */}
      <div className="relative bg-linear-to-b from-[#E84A23] via-[#FF6A48] to-[#FF8C6E] px-5 pt-6 pb-8 rounded-t rounded-b-[32px] border border-black/5 shadow-md flex flex-col gap-5 text-white shrink-0">
        {/* Top App Bar Content: User Avatar, Name & Role, Notification Bell */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/model/profile"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            title="View Profile"
          >
            {/* User Avatar */}
            <div className="w-11 h-11 rounded-full bg-white/20 p-0.5 border border-white/40 shadow-sm shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#E84A23] font-medium text-sm shadow-xs">
                {MOCK_MODEL_PROFILE.firstName[0]}
                {MOCK_MODEL_PROFILE.lastName[0]}
              </div>
            </div>

            {/* Name & Model Title */}
            <div className="flex flex-col leading-tight">
              <span className="text-[17px] font-medium text-white tracking-tight">
                {MOCK_MODEL_PROFILE.firstName} {MOCK_MODEL_PROFILE.lastName}
              </span>
              <span className="text-[12px] font-medium text-white/80">
                Model
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-xs flex items-center justify-center text-white transition-colors focus:outline-none cursor-pointer relative"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-300 rounded-full ring-2 ring-[#E84A23]" />
            </button>
          </div>
        </div>

        {/* Centered Points Display */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-1">
          <span className="px-3 py-0.5 bg-black/15 border border-white/20 text-white/90 text-[11px] font-medium rounded-full mb-1 tracking-wide">
            ✦ Points Balance
          </span>
          <div className="flex items-baseline justify-center mt-1 leading-none">
            <span className="text-5xl sm:text-6xl font-medium text-white tracking-tight">
              {pointsWhole}
            </span>
            {pointsCents && (
              <span className="text-2xl sm:text-3xl font-medium text-white/45 tracking-tight ml-0.5">
                .{pointsCents}
              </span>
            )}
          </div>
        </div>

        {/* Half-overflowed Tag at the bottom of the orange card */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] border-4 border-[#000002] rounded-full px-4 py-1.5 flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap">
          <Info className="w-3.5 h-3.5 text-im-accent shrink-0" />
          <span>1 Point = 200 LKR Today</span>
        </div>
      </div>

      {/* Quick Actions Row: Send / Center Icon / Request layout matching reference image */}
      <div className="px-3 pt-2 pb-0.5 flex items-center gap-2.5 shrink-0">
        <Link
          href="/model/bookings"
          className="flex-1 bg-[#1a1a1e] hover:bg-[#25252b] border border-white/10 text-white py-3 px-4 rounded-xl flex items-center justify-between transition-colors group shadow-xs"
        >
          <span className="text-[13px] font-medium text-white">History</span>
          <History className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
        </Link>

        <Link
          href="/model/bookings"
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] border border-white/15 text-white rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs"
          title="Calendar Schedule"
        >
          <Calendar className="w-4.5 h-4.5 text-white" />
        </Link>

        <Link
          href="/model/gigs"
          className="flex-1 bg-[#1a1a1e] hover:bg-[#25252b] border border-white/10 text-white py-3 px-4 rounded-xl flex items-center justify-between transition-colors group shadow-xs"
        >
          <span className="text-[13px] font-medium text-white">Find Gigs</span>
          <Camera className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
        </Link>
      </div>

      {/* Bottom Sheet Container: Light curved panel with notch, matching reference image */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-24 flex flex-col gap-3 overflow-hidden">
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
