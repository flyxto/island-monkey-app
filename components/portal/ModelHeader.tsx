"use client";

import React from "react";
import Link from "next/link";
import { Info, Bell } from "lucide-react";
import { MOCK_MODEL_PROFILE } from "@/lib/mock-data/model-portal";

export interface ModelHeaderProps {
  isCompact?: boolean;
}

export function ModelHeader({ isCompact = false }: ModelHeaderProps) {
  const [pointsWhole, pointsCents] = MOCK_MODEL_PROFILE.formattedPoints.split(".");

  return (
    <header
      className={`relative bg-linear-to-b from-[#E84A23] via-[#FF6A48] to-[#FF8C6E] px-5 border border-black/5 shadow-md flex flex-col text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 w-full ${
        isCompact
          ? "pt-3.5 pb-3.5 rounded-b-[24px] gap-0 z-30"
          : "pt-6 pb-8 rounded-t rounded-b-[32px] gap-5 z-20"
      }`}
    >
      {/* Top App Bar Content: User Avatar, Name & Role, Notification Bell */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/model/profile"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          title="View Profile"
        >
          {/* User Avatar */}
          <div className="w-11 h-11 rounded-full bg-white/20 p-0.5 border border-white/40 shadow-sm shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#E84A23] font-medium text-sm shadow-xs">
              {MOCK_MODEL_PROFILE.firstName[0]}
              {MOCK_MODEL_PROFILE.lastName[0]}
            </div>
          </div>

          {/* Name & Model Title */}
          <div className="flex flex-col leading-tight">
            <span className="text-[17px] font-medium text-white tracking-tight">
              {MOCK_MODEL_PROFILE.firstName} {MOCK_MODEL_PROFILE.lastName}
            </span>
            <span className="text-[12px] font-medium text-white/80">
              Model
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-xs flex items-center justify-center text-white transition-colors focus:outline-none cursor-pointer relative"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-300 rounded-full ring-2 ring-[#E84A23]" />
          </button>
        </div>
      </div>

      {/* Centered Points Display: smoothly collapses using CSS grid row transition */}
      <div
        className="relative z-10 grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          gridTemplateRows: isCompact ? "0fr" : "1fr",
        }}
      >
        <div className="overflow-hidden min-h-0">
          <div
            className={`flex flex-col items-center justify-center text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isCompact
                ? "opacity-0 -translate-y-3 scale-90 pointer-events-none"
                : "opacity-100 translate-y-0 scale-100 pt-1 pb-1"
            }`}
          >
            <span className="px-3 py-0.5 bg-black/15 border border-white/20 text-white/90 text-[11px] font-medium rounded-full mb-1 tracking-wide">
              ✦ Points Balance
            </span>
            <div className="flex items-baseline justify-center mt-1 leading-none">
              <span className="text-5xl sm:text-6xl font-medium text-white tracking-tight">
                {pointsWhole}
              </span>
              {pointsCents && (
                <span className="text-2xl sm:text-3xl font-medium text-white/45 tracking-tight ml-0.5">
                  .{pointsCents}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Half-overflowed Tag at the bottom of the orange card (smoothly fades and scales out) */}
      <div
        className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] border-4 border-[#000002] rounded-full px-4 py-1.5 flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCompact
            ? "opacity-0 pointer-events-none translate-y-2 scale-85"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <Info className="w-3.5 h-3.5 text-im-accent shrink-0" />
        <span>1 Point = 200 LKR Today</span>
      </div>
    </header>
  );
}
