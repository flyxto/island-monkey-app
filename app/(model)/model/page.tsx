"use client";

import Link from "next/link";
import { BalanceCard } from "@/components/portal/BalanceCard";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import {
  MOCK_MODEL_PROFILE,
  MOCK_BOOKINGS,
} from "@/lib/mock-data/model-portal";
import { Info, History, Camera, Eye } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export default function ModelHomePage() {
  const upcomingSampleBookings = MOCK_BOOKINGS.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 pt-8 pb-11.5">
      <div className="flex flex-col gap-4">
        {/* Greeting Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
            Hi, {MOCK_MODEL_PROFILE.firstName}.
          </h1>
          <span className="px-3.5 py-1.5 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
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
        <div className="flex items-center gap-2 p-3 rounded-lg">
          <Info className="w-5 h-5 text-im-accent shrink-0" />
          <p className="text-[14px] leading-tight">
            <strong className="font-bold text-im-muted">
              1 Point = 200 LKR Today
            </strong>{" "}
            <span className="text-im-muted-light font-semibold">
              • Conversion rates are updated daily.
            </span>
          </p>
        </div>
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
          <h2 className="text-[18px] font-semibold text-im-heading">
            Upcoming Bookings
          </h2>
          <Link
            href="/model/bookings"
            className="text-[12px] font-semibold text-im-accent hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Bordered List Card */}
        <div className="bg-white border border-[#C6C6CD4D]/30 rounded-lg overflow-hidden shadow-sm">
          <CardContent className="p-0 flex flex-col">
            {upcomingSampleBookings.map((booking, index) => (
              <div key={booking.id} className="flex flex-col w-full">
                <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-50 transition-colors gap-3">
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-full bg-im-hero flex items-center justify-center text-im-accent shrink-0 border border-im-border/40">
                      <Camera className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[15px] font-semibold text-black truncate">
                        {booking.clientName}
                      </span>
                      <span className="text-[13px] font-medium text-im-muted">
                        {booking.dateTime}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <StatusBadge status={booking.status} />

                  {/* View Button */}
                  <div className="flex shrink-0">
                      <Link
                        href={`/model/bookings/${booking.id}`}
                        className="flex items-center justify-center gap-0.5 p-1.5 bg-slate-100 hover:bg-im-accent-light text-im-body hover:text-im-accent rounded-lg transition-colors"
                        title="View Booking"
                      >
                        <Eye className="w-4 h-4" />
                        <p className="text-[10px]">View</p>
                      </Link>
                  </div>
                </div>

                {index < upcomingSampleBookings.length - 1 && (
                  <div className="h-px bg-im-border/30 mx-4" />
                )}
              </div>
            ))}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
