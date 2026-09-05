"use client";

import { useState } from "react";
import Link from "next/link";
import { useModel } from "@/lib/portal/ModelContext";
import { acceptModelBooking, rejectModelBooking } from "@/lib/api/model";
import { StatusBadge, StatusType } from "@/components/portal/StatusBadge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Camera, Eye, Check, X, Loader2, AlertCircle } from "lucide-react";

export default function MyBookingsPage() {
  const { bookings, loading, error, refresh } = useModel();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | StatusType>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setActionLoading(id + "-accept");
    try { await acceptModelBooking(id); refresh(); } catch {}
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + "-reject");
    try { await rejectModelBooking(id); refresh(); } catch {}
    setActionLoading(null);
  };

  const filtered = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = b.gig?.title?.toLowerCase().includes(q) || b.gig?.venueName?.toLowerCase().includes(q);
    const status = b.status.toLowerCase() as StatusType;
    const matchesFilter = selectedFilter === "all" || status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">My Bookings</h1>
        <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
          {bookings.length} Total
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full h-11 pl-4 bg-white border border-im-border rounded-full text-[15px] focus-visible:ring-im-accent shadow-none"
          />
        </div>
        <button type="button" className="w-11 h-11 bg-im-accent-light text-im-accent rounded-full flex items-center justify-center shrink-0">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(["all", "pending", "accepted", "rejected", "completed"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all shrink-0 capitalize ${
              selectedFilter === filter
                ? "bg-im-accent text-white shadow-xs"
                : "bg-white text-[#9e9e9e] border border-im-border hover:text-im-heading"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <Card className="bg-white border border-im-border rounded-xl overflow-hidden p-0">
        <CardContent className="p-0 flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-im-accent" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 py-12 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#9e9e9e] text-[15px]">No bookings found.</p>
            </div>
          ) : (
            filtered.map((booking, index) => {
              const status = booking.status.toLowerCase() as StatusType;
              return (
                <div key={booking.id} className="flex flex-col w-full">
                  <div className="flex items-center justify-between gap-3 py-3.5 px-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-im-hero flex items-center justify-center text-im-accent shrink-0 border border-im-border/40">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-semibold text-im-heading truncate">
                          {booking.gig?.title || "Gig Booking"}
                        </span>
                        <span className="text-[13px] text-[#9e9e9e]">
                          {formatDate(booking.createdAt)} • {booking.gig?.venueName || "—"}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={status} />

                    <div className="flex items-center gap-1 shrink-0">
                      {status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(booking.id)}
                            disabled={!!actionLoading}
                            className="flex items-center gap-0.5 p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
                            title="Accept"
                          >
                            {actionLoading === booking.id + "-accept" ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            disabled={!!actionLoading}
                            className="flex items-center gap-0.5 p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                            title="Reject"
                          >
                            {actionLoading === booking.id + "-reject" ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      )}
                      <Link
                        href={`/model/bookings/${booking.id}`}
                        className="flex items-center gap-1 py-1 px-2 text-[12px] bg-slate-100 hover:bg-im-accent-light text-im-body hover:text-im-accent rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <p>View</p>
                      </Link>
                    </div>
                  </div>
                  {index < filtered.length - 1 && <div className="h-px bg-im-border/30 mx-4" />}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
