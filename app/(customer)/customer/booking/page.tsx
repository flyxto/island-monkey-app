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
import { Camera, ChevronLeft, Loader2 } from "lucide-react";
import { getAvailableSlots, createBooking, initiatePayment } from "@/lib/api";

declare global {
  interface Window {
    payhere: any;
  }
}

export default function BookingPage() {
  const router = useRouter();
  const { selectedPackage } = useCustomer();

  // State for Date & Time selection
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [selectedTime, setSelectedTime] = useState("");

  const formattedPrice = `LKR ${selectedPackage.priceLKR.toLocaleString()}`;

  const [timeSlots, setTimeSlots] = useState<{time: string, disabled: boolean}[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function fetchSlots() {
      try {
        setIsLoadingSlots(true);
        const slots = await getAvailableSlots(selectedDate, selectedPackage.studioName);
        const formattedSlots = slots.map((s: any) => ({
          time: s.time,
          disabled: !s.available
        }));
        setTimeSlots(formattedSlots);
        
        // Auto-select first available slot if current is disabled or none selected
        if (formattedSlots.length > 0) {
          const available = formattedSlots.filter((s) => !s.disabled);
          if (available.length > 0) {
            setSelectedTime(available[0].time);
          }
        }
      } catch (error) {
        console.error("Failed to fetch slots:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    
    fetchSlots();
  }, [selectedDate, selectedPackage.studioName]);

  const handleProceed = async () => {
    try {
      setIsBooking(true);
      // 1. Create the booking in backend
      const booking = await createBooking({
        packageId: selectedPackage.id,
        date: selectedDate,
        time: selectedTime,
        studioRoom: selectedPackage.studioName,
        notes: "Booked via Island Monkey App",
      });
      
      // 2. Fetch PayHere checkout payload using the booking ID
      const paymentData = await initiatePayment(booking.id);
      
      // 3. Setup PayHere callbacks
      window.payhere.onCompleted = function onCompleted(orderId: string) {
        // Navigate to confirmation page
        const queryParams = new URLSearchParams({
          packageId: selectedPackage.id,
          date: selectedDate,
          time: selectedTime,
          orderId, // Optionally pass orderId
        });
        router.push(`/customer/booking/confirmation?${queryParams.toString()}`);
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
        alert("Payment was cancelled. You can try again.");
        setIsBooking(false); // Reset loading state if they dismiss the modal
      };

      window.payhere.onError = function onError(error: string) {
        console.error("Payment error:", error);
        alert("Payment error: " + error);
        setIsBooking(false);
      };

      // 4. Trigger the checkout popup
      window.payhere.startPayment(paymentData.payload);

    } catch (error: any) {
      console.error("Booking failed:", error);
      alert(error.message || "Booking failed. Please try again.");
      setIsBooking(false);
    }
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

          <div className="flex w-full flex-wrap items-center gap-2.5 min-h-[44px]">
            {isLoadingSlots ? (
              <div className="flex w-full items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-im-accent" />
              </div>
            ) : timeSlots.length > 0 ? (
              timeSlots.map((slot) => (
                <TimeSlotChip
                  key={slot.time}
                  time={slot.time}
                  isSelected={selectedTime === slot.time}
                  isDisabled={slot.disabled}
                  onSelect={setSelectedTime}
                />
              ))
            ) : (
              <p className="text-im-muted text-[14px]">No slots available for this date.</p>
            )}
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
              disabled={isBooking || !selectedTime}
              className="w-full py-3.5 bg-im-btn-primary text-white text-[16px] font-medium rounded-xs hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 transition-all shadow-md text-center h-auto"
            >
              {isBooking && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Proceed
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
