"use client";

import React, { useState } from "react";
import { SessionListItem } from "@/components/portal/SessionListItem";
import { MOCK_UPCOMING_SESSIONS } from "@/lib/mock-data/customer-portal";
import { Camera } from "lucide-react";

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const pastSessions = [
    {
      id: "sess_past_01",
      title: "Family Portrait Shoot",
      timestamp: "03:15 PM • Aug 14, 2026",
      studioTag: "Studio B",
      status: "completed" as const,
    },
    {
      id: "sess_past_02",
      title: "Fashion Portfolio",
      timestamp: "11:00 AM • Jul 20, 2026",
      studioTag: "Studio A",
      status: "completed" as const,
    },
  ];

  const displayedSessions =
    activeTab === "upcoming" ? MOCK_UPCOMING_SESSIONS : pastSessions;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#0b1c30] tracking-tight">
          My Sessions
        </h1>
        <div className="p-2 bg-[#e1e0ff] text-[#4648d4] rounded-full">
          <Camera className="w-5 h-5" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white border border-[#c6c6cd] rounded-xl p-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 text-[14px] font-medium rounded-lg transition-all ${
            activeTab === "upcoming"
              ? "bg-[#4648d4] text-white shadow-sm font-semibold"
              : "text-[#9e9e9e] hover:text-[#0b1c30]"
          }`}
        >
          Upcoming ({MOCK_UPCOMING_SESSIONS.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("past")}
          className={`flex-1 py-2 text-[14px] font-medium rounded-lg transition-all ${
            activeTab === "past"
              ? "bg-[#4648d4] text-white shadow-sm font-semibold"
              : "text-[#9e9e9e] hover:text-[#0b1c30]"
          }`}
        >
          Past ({pastSessions.length})
        </button>
      </div>

      {/* Sessions Card */}
      <div className="bg-white border border-[#c6c6cd] rounded-xl shadow-sm overflow-hidden flex flex-col">
        {displayedSessions.map((session, index) => (
          <SessionListItem
            key={session.id}
            title={session.title}
            timestamp={session.timestamp}
            studioTag={session.studioTag}
            showDivider={index < displayedSessions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
