"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { DateCalendar } from "@/components/portal/DateCalendar";
import { TimeSlotChip } from "@/components/portal/TimeSlotChip";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { getAvailableSlots } from "@/lib/api/customer";

interface TimeSlot { time: string; available: boolean; }

const TODAY = new Date().toISOString().split("T")[0];

export default function BookingPage() {
  const router = useRouter();
  const { selectedPackage } = useCustomer();

  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [selectedTime, setSelectedTime] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Fetch available slots whenever date or package changes
  useEffect(() => {
    if (!selectedPackage) return;
    setSlotsLoading(true);
    setSlotsError(null);
    setSelectedTime("");
    getAvailableSlots(selectedDate, selectedPackage.studioName)
      .then((data) => setSlots(data))
      .catch((e) => setSlotsError(e.message))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, selectedPackage]);

  if (!selectedPackage) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-7 h-7 text-im-muted" />
        <p className="text-sm text-im-muted">No package selected.</p>
        <Link href="/customer/packages" className="text-im-accent font-semibold text-sm">
          Browse Packages →
        </Link>
      </div>
    );
  }

  const formattedPrice = `LKR ${selectedPackage.priceLkr?.toLocaleString() ?? "—"}`;
  const metaLine = selectedPackage.metaLine || `${selectedPackage.durationHours}h • ${selectedPackage.studioName}`;

  const handleProceed = () => {
    if (!selectedTime) return;
    const queryParams = new URLSearchParams({
      packageId: selectedPackage.id,
      date: selectedDate,
      time: selectedTime,
    });
    router.push(`/customer/booking/confirmation?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8 -mt-8 -mx-4">
      {/* Hero Banner */}
      <div className="relative h-57 bg-im-hero flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-im-accent/70">
          <Camera className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Booking Confirmation</span>
        </div>

        <Link
          href={`/customer/packages/${selectedPackage.id}`}
          className="absolute top-10 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-im-heading hover:bg-white transition-colors z-20 shadow-sm"
          aria-label="Back to package detail"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#f8f9ff] to-transparent pointer-events-none" />
      </div>

      <div className="px-4 flex flex-col gap-6 -mt-30 z-10 pb-7">
        {/* Selected Package Card */}
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
            <p className="text-[15px] font-medium text-im-body">{metaLine}</p>
            <span className="text-[24px] font-medium text-im-heading">{formattedPrice}</span>
          </CardContent>
        </Card>

        {/* Select a Date */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-[#000000]">Select a Date</h2>
          <DateCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        {/* Select a Time */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-im-heading">Select a Time</h2>
          {slotsLoading ? (
            <div className="flex items-center gap-2 text-im-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading available slots...</span>
            </div>
          ) : slotsError ? (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{slotsError}</span>
            </div>
          ) : (
            <div className="flex w-full flex-wrap items-center gap-2.5">
              {slots.map((slot) => (
                <TimeSlotChip
                  key={slot.time}
                  time={slot.time}
                  isSelected={selectedTime === slot.time}
                  isDisabled={!slot.available}
                  onSelect={setSelectedTime}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Summary Bar */}
      <Card className="sticky bottom-0 z-10 mt-0 border-im-border bg-white pt-4">
        <CardContent className="p-4 flex flex-col gap-5">
          <div className="flex items-center justify-between px-4">
            <span className="text-[16px] text-im-muted font-medium">Total</span>
            <span className="text-[24px] font-bold text-im-heading">{formattedPrice}</span>
          </div>
          <Button
            onClick={handleProceed}
            disabled={!selectedTime}
            className="w-full py-3.5 bg-im-btn-primary text-white text-[16px] font-medium rounded-xs hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 transition-all shadow-md text-center h-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
