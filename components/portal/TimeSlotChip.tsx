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
      className={`px-4 py-2.5 rounded-lg text-[16px] font-medium border transition-all text-center flex-initial min-w-31 ${
        isSelected
          ? "bg-im-accent text-white border-im-accent shadow-sm font-semibold"
          : isDisabled
          ? "bg-slate-100 text-im-muted-light border-im-border/50 cursor-not-allowed opacity-50"
          : "bg-white text-im-heading border-im-border hover:border-im-accent hover:text-im-accent"
      }`}
    >
      {time}
    </button>
  );
}
