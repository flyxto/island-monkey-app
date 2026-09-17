"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_BOOKINGS } from "@/lib/mock-data/model-portal";
import { StatusBadge, StatusType } from "@/components/portal/StatusBadge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, MapPin, Eye, Camera } from "lucide-react";

export default function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | StatusType>("all");

  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || booking.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Search Bar Row between top header and bottom card */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2.5 shrink-0">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bookings..."
            className="w-full h-11 py-2 px-4 bg-[#1a1a1e] border border-white/10 rounded-xl text-[14px] font-medium text-white placeholder-white/40 focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] text-white border border-white/15 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
          aria-label="Search Bookings"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 flex flex-col gap-3.5 overflow-hidden">
        {/* Pinned Top Section: Notch, Title, Status Filter Pills */}
        <div className="flex flex-col gap-3 shrink-0">
          {/* Drag Notch Indicator */}
          <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5" />

          {/* Header: Title and Count */}
          <div className="flex items-center justify-between px-1">
            <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
              My Bookings
            </h1>
            <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
              {filteredBookings.length} Bookings
            </span>
          </div>

          {/* Status Filter Pills (flex-wrap ensures no cut off on any screen) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { key: "all", label: "All" },
                { key: "pending", label: "Pending", dot: "bg-amber-500" },
                { key: "accepted", label: "Accepted", dot: "bg-emerald-500" },
                { key: "completed", label: "Completed", dot: "bg-slate-400" },
                { key: "rejected", label: "Rejected", dot: "bg-rose-500" },
              ] as const
            ).map((item) => {
              const isActive = selectedFilter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedFilter(item.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FF6433] text-white shadow-xs"
                      : "bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-300/60"
                  }`}
                >
                  {"dot" in item && item.dot && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive ? "bg-white" : item.dot
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Bookings List */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pb-32">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col gap-3 transition-shadow hover:shadow-md"
              >
                {/* Top: Client Info + Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-[#FF6433] border border-[#FF6433]/20 flex items-center justify-center shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h2 className="text-[15px] font-medium text-slate-900 tracking-tight truncate">
                        {booking.clientName}
                      </h2>
                      <div className="flex items-center gap-1 text-[12px] font-medium text-slate-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{booking.dateTime}</span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={booking.status} className="shrink-0" />
                </div>

                {/* Middle: Duration, Location & Payment */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px] font-medium text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{booking.location}</span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{booking.duration}</span>
                  </div>
                  <span className="text-[13px] font-medium text-slate-900 shrink-0 pl-2">
                    LKR {booking.paymentLKR.toLocaleString()}
                  </span>
                </div>

                {/* Bottom: View Booking Button */}
                <Link
                  href={`/model/bookings/${booking.id}`}
                  className="relative overflow-hidden w-full h-10 bg-gradient-to-b from-white via-[#F8FAFC] to-[#EDF2F7] border border-slate-200/90 rounded-full font-medium text-[13px] text-slate-900 flex items-center justify-center gap-1.5 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1.5px_3px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.06)] hover:brightness-98 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />
                  <Eye className="w-4 h-4 text-slate-700 relative z-10" />
                  <span className="relative z-10 tracking-tight">
                    View Booking
                  </span>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200/60 rounded-2xl shadow-xs">
              <p className="text-slate-500 text-[14px] font-medium">
                No bookings found matching filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
