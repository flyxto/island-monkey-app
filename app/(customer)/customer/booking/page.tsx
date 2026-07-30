"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { DateCalendar } from "@/components/portal/DateCalendar";
import { TimeSlotChip } from "@/components/portal/TimeSlotChip";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft } from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const { selectedPackage } = useCustomer();

  // State for Date & Time selection
  const [selectedDate, setSelectedDate] = useState("2026-06-18");
  const [selectedTime, setSelectedTime] = useState("2:00 PM");

  const formattedPrice = `LKR ${selectedPackage.priceLKR.toLocaleString()}`;

  const timeSlots = [
    { time: "10:00 AM", disabled: false },
    { time: "2:00 PM", disabled: false },
    { time: "6:00 PM", disabled: false },
    { time: "8:00 PM", disabled: true },
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
    <div className="flex flex-col gap-6 -mt-8 -mx-4 pb-12">
      {/* Hero Banner with Gradient Overlay */}
      <div className="relative h-[228px] bg-[#d3e4fe] flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-[#4648d4]/70">
          <Camera className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Booking Confirmation</span>
        </div>

        {/* Back Button */}
        <Link
          href={`/customer/packages/${selectedPackage.id}`}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#0b1c30] hover:bg-white transition-colors z-20 shadow-sm"
          aria-label="Back to package detail"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Bottom Fade Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f8f9ff] to-transparent pointer-events-none" />
      </div>

      <div className="px-4 flex flex-col gap-6 -mt-16 z-10">
        {/* Selected Package Card using shadcn Card & Badge */}
        <Card className="bg-white rounded-xl border border-[#c6c6cd] shadow-lg p-0">
          <CardContent className="p-6 flex flex-col gap-3">
            <Badge className="self-start px-3 py-1 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold rounded-full hover:bg-[#e1e0ff] border-none">
              Selected Package
            </Badge>

            <div className="flex items-center justify-between">
              <h1 className="text-[24px] font-medium text-[#0b1c30]">
                {selectedPackage.name}
              </h1>
              <span className="text-[24px] font-medium text-[#0b1c30]">
                {formattedPrice}
              </span>
            </div>

            {/* Dynamic Meta Line from PackageItem model */}
            <p className="text-[15px] font-medium text-[#45464d]">
              {selectedPackage.metaLine}
            </p>
          </CardContent>
        </Card>

        {/* Select a Date Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] font-semibold text-[#0b1c30]">
            Select a Date
          </h2>
          <DateCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Select a Time Section (Fixed design file typo label) */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] font-semibold text-[#0b1c30]">
            Select a Time
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

        {/* Sticky Bottom Summary Bar */}
        <Card className="mt-4 border border-[#c6c6cd] bg-white rounded-xl shadow-lg p-0">
          <CardContent className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#9e9e9e] font-medium">Total</span>
              <span className="text-[22px] font-bold text-[#0b1c30]">
                {formattedPrice}
              </span>
            </div>

            <Button
              onClick={handleProceed}
              className="w-full py-3.5 bg-black text-white text-[16px] font-medium rounded-[2px] hover:bg-black/90 active:bg-black/80 transition-all shadow-md text-center h-auto"
            >
              Proceed
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
