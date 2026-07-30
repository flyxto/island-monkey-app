"use client";

import React from "react";
import { Bell } from "lucide-react";

export interface TopAppBarProps {
  wordmark: string;
  onNotificationClick?: () => void;
}

/**
 * Shared TopAppBar - 100% config driven.
 * Height: 64px, fixed top, white bg, border-b #c6c6cd.
 * Logo/wordmark left (bold, 24px), bell icon right.
 */
export function TopAppBar({ wordmark, onNotificationClick }: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[64px] bg-white border-b border-[#c6c6cd] flex items-center justify-between px-4 max-w-[430px] mx-auto">
      <div className="flex items-center">
        <span className="text-[24px] font-bold text-[#0b1c30] tracking-tight">
          {wordmark}
        </span>
      </div>
      <button
        onClick={onNotificationClick}
        type="button"
        className="relative p-2 rounded-full text-[#45464d] hover:bg-gray-100 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-[#4648d4] rounded-full ring-2 ring-white" />
      </button>
    </header>
  );
}
