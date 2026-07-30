"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_BOOKINGS } from "@/lib/mock-data/model-portal";
import { StatusBadge, StatusType } from "@/components/portal/StatusBadge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Camera, Eye } from "lucide-react";

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#0b1c30] tracking-tight">
          My Bookings
        </h1>
        <span className="px-3 py-1 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold rounded-full">
          {MOCK_BOOKINGS.length} Total Bookings
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bookings..."
            className="w-full h-11 pl-4 pr-10 bg-white border border-[#c6c6cd] rounded-full text-[15px] text-[#0b1c30] placeholder-[#9e9e9e] focus-visible:ring-[#4648d4] focus-visible:border-[#4648d4] shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-[#4648d4] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-[#4648d4]/90 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(["all", "pending", "accepted", "rejected", "completed"] as const).map(
          (filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all shrink-0 capitalize ${
                selectedFilter === filter
                  ? "bg-[#4648d4] text-white shadow-xs"
                  : "bg-white text-[#9e9e9e] border border-[#c6c6cd]/60 hover:text-[#0b1c30]"
              }`}
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Bookings List Card */}
      <Card className="bg-white border border-[#c6c6cd] rounded-xl overflow-hidden shadow-sm p-0">
        <CardContent className="p-0 flex flex-col">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div key={booking.id} className="flex flex-col w-full">
                <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#4648d4] shrink-0 border border-[#c6c6cd]/40">
                      <Camera className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[#0b1c30] truncate">
                        {booking.clientName}
                      </span>
                      <span className="text-[13px] text-[#9e9e9e]">
                        {booking.dateTime} • {booking.duration}
                      </span>
                    </div>
                  </div>

                  {/* Right section: StatusBadge & Eye View Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={booking.status} />
                    <Link
                      href={`/model/bookings/${booking.id}`}
                      className="p-1.5 bg-slate-100 hover:bg-[#e1e0ff] text-[#45464d] hover:text-[#4648d4] rounded-lg transition-colors"
                      title="View Booking"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {index < filteredBookings.length - 1 && (
                  <div className="h-[1px] bg-[#c6c6cd]/30 mx-4" />
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white">
              <p className="text-[#9e9e9e] text-[15px]">
                No bookings found matching filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
