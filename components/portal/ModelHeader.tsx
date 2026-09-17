"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Info, Bell, CheckCircle2, Pencil } from "lucide-react";
import { MOCK_MODEL_PROFILE } from "@/lib/mock-data/model-portal";

export interface ModelHeaderProps {
  isCompact?: boolean;
  isProfile?: boolean;
}

export function ModelHeader({ isCompact = false, isProfile = false }: ModelHeaderProps) {
  const [profileData, setProfileData] = useState(MOCK_MODEL_PROFILE);
  const [pointsWhole, pointsCents] = profileData.formattedPoints.split(".");

  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<typeof MOCK_MODEL_PROFILE>>;
      if (customEvent.detail) {
        setProfileData((prev) => ({ ...prev, ...customEvent.detail }));
      }
    };
    window.addEventListener("model-profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("model-profile-updated", handleProfileUpdate);
  }, []);

  const handleOpenEdit = () => {
    window.dispatchEvent(new CustomEvent("open-model-edit-modal"));
  };

  return (
    <header
      className={`relative bg-linear-to-b from-[#E84A23] via-[#FF6A48] to-[#FF8C6E] px-5 border border-black/5 shadow-md flex flex-col text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 w-full ${
        isProfile
          ? "pt-6 pb-7 rounded-b-[32px] gap-0 z-20"
          : isCompact
          ? "pt-3.5 pb-3.5 rounded-b-[24px] gap-0 z-30"
          : "pt-6 pb-8 rounded-t rounded-b-[32px] gap-5 z-20"
      }`}
    >
      {/* Top App Bar Content: Single Persistent Container for Seamless Route Transitions */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Left Side: Avatar + Name & Edit Profile */}
        <div
          className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-w-0 ${
            isProfile ? "gap-4" : "gap-3"
          }`}
        >
          {/* User Avatar: Persistent element that smoothly scales between 44px and 80px */}
          <Link
            href="/model/profile"
            className={`relative shrink-0 block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isProfile
                ? "cursor-default"
                : "cursor-pointer hover:scale-105 active:scale-95"
            }`}
            title={isProfile ? undefined : "View Profile"}
            onClick={(e) => {
              if (isProfile) e.preventDefault();
            }}
          >
            <div
              className={`rounded-full bg-white/20 border border-white/40 shadow-sm shrink-0 flex items-center justify-center transform-gpu transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isProfile
                  ? "w-20 h-20 p-1 shadow-md"
                  : "w-11 h-11 p-0.5"
              }`}
            >
              <div
                className={`w-full h-full rounded-full bg-white flex items-center justify-center text-[#E84A23] font-medium shadow-xs tracking-tight transform-gpu transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isProfile
                    ? "text-2xl sm:text-3xl"
                    : "text-sm"
                }`}
              >
                {profileData.firstName[0]}
                {profileData.lastName[0]}
              </div>
            </div>

            {/* Verified Badge: Smoothly scales in on profile and scales out on other pages */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-white text-[#E84A23] rounded-full shadow-xs flex items-center justify-center border border-white transform-gpu transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isProfile
                  ? "scale-100 opacity-100"
                  : "scale-0 opacity-0 pointer-events-none"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </span>
          </Link>

          {/* Name & Role & Edit Profile Button Column */}
          <div className="flex flex-col justify-center min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <Link
              href="/model/profile"
              className={
                isProfile
                  ? "cursor-default"
                  : "hover:opacity-90 transition-opacity cursor-pointer"
              }
              onClick={(e) => {
                if (isProfile) e.preventDefault();
              }}
            >
              <span
                className={`font-medium text-white tracking-tight leading-tight block truncate transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isProfile ? "text-[20px] sm:text-[22px]" : "text-[17px]"
                }`}
              >
                {profileData.firstName} {profileData.lastName}
              </span>
              <span className="text-[12px] font-medium text-white/80 block mt-0.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                {isProfile ? "Island Monkey Verified Model" : "Model"}
              </span>
            </Link>

            {/* Edit Profile Button: Smoothly expands on profile, collapses on other pages */}
            <div
              className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                gridTemplateRows: isProfile ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden min-h-0">
                <div
                  className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isProfile
                      ? "opacity-100 translate-y-0 scale-100 pt-2"
                      : "opacity-0 -translate-y-2 scale-90 pointer-events-none pt-0"
                  }`}
                >
                  <button
                    type="button"
                    onClick={handleOpenEdit}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-800 hover:bg-slate-50 border border-white/40 shadow-xs rounded-full text-[12px] font-medium transition-all cursor-pointer w-fit active:scale-95"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#FF6433]" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Notification Bell */}
        <div
          className={`flex items-center gap-2 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isProfile ? "self-start pt-1" : "self-center"
          }`}
        >
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
          gridTemplateRows: !isCompact && !isProfile ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden min-h-0">
          <div
            className={`flex flex-col items-center justify-center text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              !isCompact && !isProfile
                ? "opacity-100 translate-y-0 scale-100 pt-1 pb-1"
                : "opacity-0 -translate-y-3 scale-90 pointer-events-none"
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

      {/* Half-overflowed Tag at the bottom of the orange card */}
      <div
        className={`absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] border-4 border-[#000002] rounded-full px-4 py-1.5 flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          !isCompact && !isProfile
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 pointer-events-none translate-y-2 scale-85"
        }`}
      >
        <Info className="w-3.5 h-3.5 text-im-accent shrink-0" />
        <span>1 Point = 200 LKR Today</span>
      </div>
    </header>
  );
}
