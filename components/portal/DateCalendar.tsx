"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DateCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
}

/**
 * Functional Month Calendar Grid using shadcn Card & Badge:
 * Month header (indigo pill badge), Mo-Su weekday row, date grid with selected date highlight state (indigo circle).
 */
export function DateCalendar({ selectedDate, onSelectDate }: DateCalendarProps) {
  // Mock Month: June 2026
  const year = 2026;
  const monthName = "June 2026";

  const daysInMonth = 30; // June has 30 days
  const firstDayOffset = 0; // Monday start for June 1, 2026

  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <Card className="w-full bg-white border border-black/5 rounded-[24px] p-0 shadow-xs">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Month Header */}
        <div className="flex items-center justify-between">
          <Badge className="px-4 py-1.5 bg-[#FFF0EB] text-[#FF6433] text-[13px] font-medium rounded-full hover:bg-[#FFE5DC] hover:text-[#FF6433] border-none">
            {monthName}
          </Badge>
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              className="p-1 hover:text-slate-900 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-1 hover:text-slate-900 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday Row */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((day) => (
            <span
              key={day}
              className="text-[13px] font-medium text-slate-400 py-1"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Empty offset cells */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {/* Month dates */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateString = `${year}-06-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
            const isSelected = selectedDate === dateString;
            const isPast = dayNum < 15; // Mark dates before June 15 as past for realistic demo

            return (
              <button
                key={dateString}
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(dateString)}
                className={`h-9 w-9 mx-auto flex items-center justify-center text-[14px] font-medium rounded-full transition-all ${
                  isSelected
                    ? "bg-[#FF6433] text-white shadow-md shadow-[#FF6433]/30 font-medium"
                    : isPast
                    ? "text-slate-300 cursor-not-allowed opacity-40"
                    : "text-slate-700 hover:bg-[#FFF0EB] hover:text-[#FF6433]"
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
