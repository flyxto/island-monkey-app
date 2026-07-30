"use client";

import React from "react";
import Link from "next/link";
import { BalanceCard } from "@/components/portal/BalanceCard";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import {
  MOCK_MODEL_PROFILE,
  MOCK_BOOKINGS,
} from "@/lib/mock-data/model-portal";
import { Info, History, Camera, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ModelHomePage() {
  const upcomingSampleBookings = MOCK_BOOKINGS.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#0b1c30] tracking-tight">
          Hi, {MOCK_MODEL_PROFILE.firstName}.
        </h1>
        <span className="px-3 py-1 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold rounded-full">
          Talent Portal
        </span>
      </div>

      {/* Extended Balance Card with double-glow variant */}
      <BalanceCard
        points={MOCK_MODEL_PROFILE.pointsBalance}
        formattedPoints={MOCK_MODEL_PROFILE.formattedPoints}
        variant="double-glow"
      />

      {/* Info Row: 1 Point = 200 LKR Today */}
      <div className="flex items-center gap-2 p-3 bg-white border border-[#c6c6cd]/50 rounded-lg shadow-2xs">
        <Info className="w-4 h-4 text-[#4648d4] shrink-0" />
        <p className="text-[13px] leading-tight">
          <strong className="font-semibold text-[#0b1c30]">
            1 Point = 200 LKR Today
          </strong>{" "}
          <span className="text-[#9e9e9e]">
            • Conversion rates are updated daily.
          </span>
        </p>
      </div>

      {/* Quick Actions Row ("Find Gigs" updated for model relevance) */}
      <div className="flex items-center gap-3">
        <QuickActionCard
          title="View History"
          icon={History}
          href="/model/bookings"
        />
        <QuickActionCard
          title="Find Gigs"
          icon={Camera}
          href="/model/gigs"
        />
      </div>

      {/* Upcoming Bookings Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#0b1c30]">
            Upcoming Bookings
          </h2>
          <Link
            href="/model/bookings"
            className="text-[12px] font-semibold text-[#4648d4] hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Bordered List Card */}
        <Card className="bg-white border border-[#c6c6cd] rounded-xl overflow-hidden shadow-sm p-0">
          <CardContent className="p-0 flex flex-col">
            {upcomingSampleBookings.map((booking, index) => (
              <div key={booking.id} className="flex flex-col w-full">
                <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#4648d4] shrink-0 border border-[#c6c6cd]/40">
                      <Camera className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-[#0b1c30] truncate">
                        {booking.clientName}
                      </span>
                      <span className="text-[13px] text-[#9e9e9e]">
                        {booking.dateTime}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge & View Button */}
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

                {index < upcomingSampleBookings.length - 1 && (
                  <div className="h-[1px] bg-[#c6c6cd]/30 mx-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
