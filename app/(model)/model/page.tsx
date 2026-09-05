"use client";

import Link from "next/link";
import { BalanceCard } from "@/components/portal/BalanceCard";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { useModel } from "@/lib/portal/ModelContext";
import { Info, History, Camera, Eye, Loader2, AlertCircle } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export default function ModelHomePage() {
  const { profile, bookings, pointsBalance, conversionRate, loading, error } = useModel();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-im-accent" />
        <p className="text-sm text-im-muted">Loading talent portal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-7 h-7 text-red-400" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const formatPoints = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formattedPoints = formatPoints(pointsBalance);

  const mapStatus = (status: string) => {
    const map: Record<string, string> = {
      pending: "pending", accepted: "accepted", rejected: "rejected", completed: "completed",
    };
    return (map[status.toLowerCase()] || "pending") as any;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const upcomingBookings = bookings
    .filter((b) => ["pending", "accepted"].includes(b.status.toLowerCase()))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8 pt-8 pb-11.5">
      <div className="flex flex-col gap-4">
        {/* Greeting Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
            Hi, {profile?.firstName || "Talent"}.
          </h1>
          <span className="px-3.5 py-1.5 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
            Talent Portal
          </span>
        </div>

        {/* Balance Card */}
        <BalanceCard
          points={pointsBalance}
          formattedPoints={formattedPoints}
          variant="double-glow"
        />

        {/* Info Row */}
        <div className="flex items-center gap-2 p-3 rounded-lg">
          <Info className="w-5 h-5 text-im-accent shrink-0" />
          <p className="text-[14px] leading-tight">
            <strong className="font-bold text-im-muted">
              1 Point = {conversionRate} LKR Today
            </strong>{" "}
            <span className="text-im-muted-light font-semibold">
              • Conversion rates are updated daily.
            </span>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <QuickActionCard title="View History" icon={History} href="/model/bookings" />
        <QuickActionCard title="Find Gigs" icon={Camera} href="/model/gigs" />
      </div>

      {/* Upcoming Bookings */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-im-heading">Upcoming Bookings</h2>
          <Link href="/model/bookings" className="text-[12px] font-semibold text-im-accent hover:underline">
            View All
          </Link>
        </div>

        <div className="bg-white border border-[#C6C6CD4D]/30 rounded-lg overflow-hidden shadow-sm">
          <CardContent className="p-0 flex flex-col">
            {upcomingBookings.length === 0 ? (
              <div className="py-8 text-center text-sm text-im-muted">
                No upcoming bookings. <Link href="/model/gigs" className="text-im-accent font-semibold">Find gigs!</Link>
              </div>
            ) : (
              upcomingBookings.map((booking, index) => (
                <div key={booking.id} className="flex flex-col w-full">
                  <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-50 transition-colors gap-3">
                    <div className="flex items-center justify-between gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-im-hero flex items-center justify-center text-im-accent shrink-0 border border-im-border/40">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-semibold text-black truncate">
                          {booking.gig?.title || "Gig Booking"}
                        </span>
                        <span className="text-[13px] font-medium text-im-muted">
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={mapStatus(booking.status)} />
                    <div className="flex shrink-0">
                      <Link
                        href={`/model/bookings/${booking.id}`}
                        className="flex items-center justify-center gap-0.5 p-1.5 bg-slate-100 hover:bg-im-accent-light text-im-body hover:text-im-accent rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <p className="text-[10px]">View</p>
                      </Link>
                    </div>
                  </div>
                  {index < upcomingBookings.length - 1 && (
                    <div className="h-px bg-im-border/30 mx-4" />
                  )}
                </div>
              ))
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
