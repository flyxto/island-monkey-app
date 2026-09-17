"use client";

export interface TimeSlotChipProps {
  time: string; // e.g. "10:00 AM"
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect: (time: string) => void;
}

/**
 * Time Slot Chip Component:
 * Row of time-slot chips ("10:00 AM", "02:00 PM", "06:00 PM", "08:00 PM").
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
      className={`px-4 py-2.5 rounded-full text-[14px] font-medium border transition-all text-center flex-initial min-w-28 cursor-pointer ${
        isSelected
          ? "bg-[#FF6433] text-white border-[#FF6433] shadow-md shadow-[#FF6433]/25 font-medium"
          : isDisabled
          ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50"
          : "bg-white text-slate-700 border-black/10 hover:border-[#FF6433] hover:text-[#FF6433]"
      }`}
    >
      {time}
    </button>
  );
}
