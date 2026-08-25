"use client";

import { useState } from "react";
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
    <div className="flex flex-col gap-8 -mt-8 -mx-4">
      {/* Hero Banner with Gradient Overlay */}
      <div className="relative h-57 bg-im-hero flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-im-accent/70">
          <Camera className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Booking Confirmation</span>
        </div>

        {/* Back Button */}
        <Link
          href={`/customer/packages/${selectedPackage.id}`}
          className="absolute top-10 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-im-heading hover:bg-white transition-colors z-20 shadow-sm"
          aria-label="Back to package detail"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Bottom Fade Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#f8f9ff] to-transparent pointer-events-none" />
      </div>

      <div className="px-4 flex flex-col gap-6 -mt-30 z-10 pb-7">
        {/* Selected Package Card using shadcn Card & Badge */}
        <Card className="bg-white rounded-xl border border-im-border shadow-lg p-0">
          <CardContent className="p-4 flex flex-col gap-2.5">
            <Badge className="self-start px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full hover:bg-im-accent-light border-none">
              Selected Package
            </Badge>

            <div className="flex items-center justify-between">
              <h1 className="text-[24px] font-medium text-im-heading">
                {selectedPackage.name}
              </h1>
            </div>

            {/* Dynamic Meta Line from PackageItem model */}
            <p className="text-[15px] font-medium text-im-body">
              {selectedPackage.metaLine}
            </p>
            <span className="text-[24px] font-medium text-im-heading">
                {formattedPrice}
              </span>
          </CardContent>
        </Card>

        {/* Select a Date Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-[#000000]">
            Select a Date
          </h2>
          <DateCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Select a Time Section (Fixed design file typo label) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-im-heading">
            Select a Time
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
      </div>
      {/* Sticky Bottom Summary Bar */}
        <Card className="sticky bottom-0 z-10 mt-0 border-im-border bg-white pt-4">
          <CardContent className="p-4 flex flex-col gap-5">
            <div className="flex items-center justify-between px-4">
              <span className="text-[16px] text-im-muted font-medium">Total</span>
              <span className="text-[24px] font-bold text-im-heading">
                {formattedPrice}
              </span>
            </div>

            <Button
              onClick={handleProceed}
              className="w-full py-3.5 bg-im-btn-primary text-white text-[16px] font-medium rounded-xs hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 transition-all shadow-md text-center h-auto"
            >
              Proceed
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
