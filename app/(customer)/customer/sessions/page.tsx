"use client";

import { useState, useEffect } from "react";
import { SessionListItem } from "@/components/portal/SessionListItem";
import { Camera, Loader2 } from "lucide-react";
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

  const upcomingSessions = bookings.filter(b => b.status === "Pending" || b.status === "Approved");
  const pastSessions = bookings.filter(b => b.status === "Completed" || b.status === "Cancelled" || b.status === "Rejected");

  const displayedSessions =
    activeTab === "upcoming" ? upcomingSessions : pastSessions;

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
          Upcoming ({upcomingSessions.length})
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
          Past ({pastSessions.length})
        </button>
      </div>

      {/* Sessions Card */}
      <div className="bg-white border border-im-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center h-48 text-im-accent">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : displayedSessions.length > 0 ? (
          displayedSessions.map((session, index) => {
            const formattedDate = new Date(session.dateTime).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const formattedTime = new Date(session.dateTime).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <SessionListItem
                key={session.id}
                title={session.package?.name || "Session"}
                timestamp={`${formattedTime} • ${formattedDate}`}
                studioTag={session.package?.studioName || "Studio"}
                showDivider={index < displayedSessions.length - 1}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center h-48 text-im-body">
            <p>No {activeTab} sessions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
