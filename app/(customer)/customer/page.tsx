"use client";

import Link from "next/link";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { BalanceCard } from "@/components/portal/BalanceCard";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { SessionListItem } from "@/components/portal/SessionListItem";
import { QRModal } from "@/components/portal/QRModal";
import { Info, History, Handshake, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/api/customer";

interface Booking {
  id: string;
  bookingCode: string;
  studioRoom: string;
  dateTime: string;
  status: string;
  package?: { name: string };
}

export default function CustomerHomePage() {
  const { user, balance, isQRModalOpen, setIsQRModalOpen, loading, error } = useCustomer();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((data) => setBookings(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-im-accent" />
        <p className="text-sm text-im-muted">Loading your portal...</p>
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

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} • ${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const mapStatus = (status: string): "upcoming" | "completed" | "cancelled" => {
    if (status === "Approved" || status === "Pending") return "upcoming";
    if (status === "Completed") return "completed";
    return "cancelled";
  };

  return (
    <div className="flex flex-col gap-8 pt-8 pb-11.5">
      <div className="flex flex-col gap-4">
        {/* Greeting Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
            Good morning, {user?.firstName}.
          </h1>
        </div>

        {/* Balance Card */}
        <BalanceCard
          points={balance.pointsBalance}
          formattedPoints={balance.formattedPoints}
        />

        {/* Info Row */}
        <div className="flex items-center gap-2 p-3 rounded-lg">
          <Info className="w-5 h-5 text-im-accent shrink-0" />
          <p className="text-[14px] leading-tight">
            <strong className="font-bold text-im-muted">
              1 Point = {balance.conversionRateLKR} LKR Today
            </strong>{" "}
            <span className="text-im-muted-light font-semibold">
              • Conversion rates are updated daily.
            </span>
          </p>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex items-center gap-3">
        <QuickActionCard
          title="View History"
          icon={History}
          href="/customer/sessions"
        />
        <QuickActionCard
          title="Find Partners"
          icon={Handshake}
          onClick={() => setIsQRModalOpen(true)}
        />
      </div>

      {/* Upcoming Sessions Section */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-im-heading">
            Upcoming Sessions
          </h2>
          <Link
            href="/customer/sessions"
            className="text-[12px] font-semibold text-im-accent hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="bg-white border border-[#C6C6CD4D]/30 rounded-lg shadow-sm overflow-hidden">
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-im-accent" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-im-muted">
              No upcoming sessions yet.{" "}
              <Link href="/customer/booking" className="text-im-accent font-semibold">Book one!</Link>
            </div>
          ) : (
            bookings.map((booking, index) => (
              <SessionListItem
                key={booking.id}
                title={booking.package?.name || "Studio Session"}
                timestamp={formatDateTime(booking.dateTime)}
                studioTag={booking.studioRoom}
                showDivider={index < bookings.length - 1}
              />
            ))
          )}
        </div>
      </div>

      {/* QR Modal */}
      {user && (
        <QRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          userFullName={`${user.firstName} ${user.lastName}`}
          qrValue={user.qrCodeValue}
          pointsBalance={balance.formattedPoints}
        />
      )}
    </div>
  );
}
