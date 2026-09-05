"use client";

import { useState, useEffect } from "react";
import { SessionListItem } from "@/components/portal/SessionListItem";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { getMyBookings } from "@/lib/api/customer";
import Link from "next/link";

interface Booking {
  id: string;
  studioRoom: string;
  dateTime: string;
  status: string;
  package?: { name: string };
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

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyBookings()
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const upcomingBookings = bookings.filter((b) =>
    ["Pending", "Approved"].includes(b.status)
  );
  const pastBookings = bookings.filter((b) =>
    !["Pending", "Approved"].includes(b.status)
  );
  const displayed = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="flex flex-col gap-8 pt-8 pb-11.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
          My Sessions
        </h1>
        <div className="p-2 bg-im-accent-light text-im-accent rounded-full">
          <Camera className="w-5 h-5" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white border border-im-border rounded-xl p-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 text-[14px] font-medium rounded-lg transition-all ${
            activeTab === "upcoming"
              ? "bg-im-accent text-white shadow-sm font-semibold"
              : "text-[#9e9e9e] hover:text-im-heading"
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("past")}
          className={`flex-1 py-2 text-[14px] font-medium rounded-lg transition-all ${
            activeTab === "past"
              ? "bg-im-accent text-white shadow-sm font-semibold"
              : "text-[#9e9e9e] hover:text-im-heading"
          }`}
        >
          Past ({pastBookings.length})
        </button>
      </div>

      {/* Sessions Card */}
      <div className="bg-white border border-im-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[100px]">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-im-accent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-10 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-10 text-center text-sm text-im-muted">
            No {activeTab} sessions.{" "}
            {activeTab === "upcoming" && (
              <Link href="/customer/booking" className="text-im-accent font-semibold">
                Book a session!
              </Link>
            )}
          </div>
        ) : (
          displayed.map((booking, index) => (
            <SessionListItem
              key={booking.id}
              title={booking.package?.name || "Studio Session"}
              timestamp={formatDateTime(booking.dateTime)}
              studioTag={booking.studioRoom}
              showDivider={index < displayed.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
