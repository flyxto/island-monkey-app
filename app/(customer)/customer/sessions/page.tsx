"use client";

import { useState, useEffect } from "react";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";
import { getCustomerBookings } from "@/lib/api";

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getCustomerBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to load customer sessions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const upcomingSessions = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Approved"
  );
  const pastSessions = bookings.filter(
    (b) => b.status === "Completed" || b.status === "Cancelled" || b.status === "Rejected"
  );

  const displayedSessions =
    activeTab === "upcoming" ? upcomingSessions : pastSessions;

  const parseSessionDate = (dateTimeStr: string) => {
    try {
      const d = new Date(dateTimeStr);
      if (isNaN(d.getTime())) {
        return { month: "Oct", day: "24", time: "10:00 AM" };
      }
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const day = d.toLocaleDateString("en-US", { day: "numeric" });
      const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      return { month, day, time };
    } catch {
      return { month: "Oct", day: "24", time: "10:00 AM" };
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Filter Tabs Row between top header and bottom card */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
            activeTab === "upcoming"
              ? "bg-[#FF6433] text-white shadow-xs"
              : "bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-300/60"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              activeTab === "upcoming" ? "bg-white" : "bg-emerald-500"
            }`}
          />
          <span>Upcoming ({upcomingSessions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("past")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
            activeTab === "past"
              ? "bg-[#FF6433] text-white shadow-xs"
              : "bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-300/60"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              activeTab === "past" ? "bg-white" : "bg-slate-400"
            }`}
          />
          <span>Past ({pastSessions.length})</span>
        </button>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Header: Title and Count */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
            {activeTab === "upcoming" ? "Upcoming Sessions" : "Past Sessions"}
          </h1>
          <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
            {displayedSessions.length} Sessions
          </span>
        </div>

        {/* Sessions List */}
        <div className="flex flex-col gap-2.5">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF6433]" />
            </div>
          ) : displayedSessions.length > 0 ? (
            displayedSessions.map((session, idx) => {
              const { month, day, time } = parseSessionDate(session.dateTime);
              const title = session.package?.name || "Session";
              const studioTag = session.package?.studioName || "Studio";
              const isCompleted = session.status === "Completed";
              const isApproved = session.status === "Approved";

              return (
                <div
                  key={session.id}
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
                      isCompleted
                        ? "bg-linear-to-br from-slate-600 to-slate-800 text-white"
                        : idx % 2 === 0
                        ? "bg-linear-to-br from-amber-500 via-orange-500 to-[#E84A23] text-white"
                        : "bg-linear-to-br from-teal-500 via-emerald-500 to-emerald-600 text-white"
                    }`}
                  >
                    <Camera className="w-5 h-5 text-white/95" />
                  </div>

                  {/* Title & Time */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[14px] font-medium text-slate-900 truncate">
                      {title}
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 truncate mt-0.5">
                      {time} • {studioTag}
                    </span>
                  </div>

                  {/* Studio Tag & Status Indicator */}
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span className="px-2.5 py-1 bg-orange-50 text-[#FF6433] border border-orange-200/60 rounded-full text-[11px] font-medium">
                      {studioTag}
                    </span>
                    {isCompleted ? (
                      <span className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-slate-400" />
                        <span>Completed</span>
                      </span>
                    ) : isApproved ? (
                      <span className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Confirmed</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-600 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{session.status}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white border border-black/5 rounded-2xl shadow-2xs">
              <p className="text-slate-400 text-[14px] font-medium">
                No {activeTab} sessions found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
