"use client";

import React from "react";
import { Camera } from "lucide-react";

export interface SessionListItemProps {
  title: string;
  timestamp: string;
  studioTag: string; // e.g. "Studio A"
  showDivider?: boolean;
}

/**
 * Session List Item Component:
 * Circular thumbnail, "Studio Session" title, timestamp ("10:42 AM • Oct 24, 2023"),
 * and "Studio A" tag right-aligned in indigo.
 */
export function SessionListItem({
  title,
  timestamp,
  studioTag,
  showDivider = true,
}: SessionListItemProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-3 px-4 hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center gap-3">
          {/* Circular Thumbnail */}
          <div className="w-10 h-10 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#4648d4] shrink-0 border border-[#c6c6cd]/40">
            <Camera className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-[#0b1c30]">
              {title}
            </span>
            <span className="text-[13px] text-[#9e9e9e]">{timestamp}</span>
          </div>
        </div>

        {/* Right-aligned Studio Tag */}
        <span className="px-2.5 py-1 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold rounded-full shrink-0">
          {studioTag}
        </span>
      </div>

      {showDivider && <div className="h-[1px] bg-[#rgba(198,198,205,0.3)] bg-[#c6c6cd]/30 mx-4" />}
    </div>
  );
}
