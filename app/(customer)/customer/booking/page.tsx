"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { DateCalendar } from "@/components/portal/DateCalendar";
import { TimeSlotChip } from "@/components/portal/TimeSlotChip";
import { ChevronLeft } from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const { selectedPackage } = useCustomer();

  // State for Date & Time selection
  const [selectedDate, setSelectedDate] = useState("2026-06-18");
  const [selectedTime, setSelectedTime] = useState("02:00 PM");

  const formattedPrice = `LKR ${selectedPackage.priceLKR.toLocaleString()}`;

  const timeSlots = [
    { time: "10:00 AM", disabled: false },
    { time: "02:00 PM", disabled: false },
    { time: "06:00 PM", disabled: false },
    { time: "08:00 PM", disabled: true },
  ];

  const handleProceed = () => {
    // Encapsulate booking query state into URL
    const queryParams = new URLSearchParams({
      packageId: selectedPackage.id,
      date: selectedDate,
      time: selectedTime,
    });
    router.push(`/customer/booking/confirmation?${queryParams.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0 select-none">
      {/* Upper Navigation Row in Dark Frame */}
      <div className="px-3 pt-2 pb-0.5 flex items-center justify-between shrink-0">
        <Link
          href={`/customer/packages/${selectedPackage.id}`}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Back to package detail"
        >
          <ChevronLeft className="w-5 h-5 -ml-0.5 text-white" />
        </Link>

        <div className="flex flex-col items-center">
          <span className="text-[15px] font-medium text-white tracking-tight">
            Book Studio Session
          </span>
          <span className="text-[11px] font-medium text-white/60 truncate max-w-44">
            {selectedPackage.name}
          </span>
        </div>

        <span className="px-3 py-1 bg-[#FF6433]/20 border border-[#FF6433]/40 text-[#FF8C6E] text-[12px] font-medium rounded-full">
          {formattedPrice}
        </span>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-8 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Selected Package Bento Card */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full">
              Package Selected
            </span>
            <span className="text-[12px] font-medium text-slate-400">
              {selectedPackage.durationHours}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <h1 className="text-[18px] font-medium text-slate-900 tracking-tight">
              {selectedPackage.name}
            </h1>
            <p className="text-[13px] font-medium text-slate-500">
              {selectedPackage.metaLine}
            </p>
          </div>
        </div>

        {/* Select a Date Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[14px] font-medium text-slate-900 px-1">
            Select a Date
          </h2>
          <DateCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Select a Time Bento Card */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3">
          <h2 className="text-[14px] font-medium text-slate-900">
            Select a Time Slot
          </h2>

          <div className="flex w-full flex-wrap items-center gap-2.5">
            {timeSlots.map((slot) => (
              <TimeSlotChip
                key={slot.time}
                time={slot.time}
                isSelected={selectedTime === slot.time}
                isDisabled={slot.disabled}
                onSelect={setSelectedTime}
              />
            ))}
          </div>
        </div>

        {/* Total & Specular Proceed Action Bar */}
        <div className="bg-white rounded-[24px] p-4 border border-black/5 shadow-xs flex items-center justify-between gap-4 mt-0.5 shrink-0">
          <div className="flex flex-col pl-1">
            <span className="text-[11px] font-medium text-slate-400">Total Price</span>
            <span className="text-[18px] font-medium text-slate-900 leading-tight">
              {formattedPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="flex-1 py-3.5 px-6 bg-linear-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] hover:from-[#FF8A55] hover:to-[#EA5A33] text-white text-[14px] font-medium rounded-full transition-all shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.4),0_8px_20px_rgba(232,74,35,0.25)] active:scale-[0.98] cursor-pointer text-center"
          >
            Proceed to Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
