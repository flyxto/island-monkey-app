"use client";

import React from "react";

export interface TimeSlotChipProps {
  time: string; // e.g. "10:00 AM"
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect: (time: string) => void;
}

/**
 * Time Slot Chip Component:
 * Row of time-slot chips ("10.00 AM", "2.00 PM", "6.00 PM", "8.00 PM").
 * Selected = filled indigo bg + white text.
 * Disabled = greyed out.
 * Default = white bg, border #c6c6cd.
 */
export function TimeSlotChip({
  time,
  isSelected,
  isDisabled = false,
  onSelect,
}: TimeSlotChipProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onSelect(time)}
      className={`px-4 py-2.5 rounded-lg text-[14px] font-medium border transition-all text-center flex-1 min-w-[76px] ${
        isSelected
          ? "bg-[#4648d4] text-white border-[#4648d4] shadow-sm font-semibold"
          : isDisabled
          ? "bg-slate-100 text-[#bababa] border-[#c6c6cd]/50 cursor-not-allowed opacity-50"
          : "bg-white text-[#0b1c30] border-[#c6c6cd] hover:border-[#4648d4] hover:text-[#4648d4]"
      }`}
    >
      {time}
    </button>
  );
}
