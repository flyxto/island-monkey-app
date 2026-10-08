"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { PackageItem } from "@/lib/mock-data/customer-portal";
import { DateCalendar } from "@/components/portal/DateCalendar";
import { TimeSlotChip } from "@/components/portal/TimeSlotChip";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getAvailableSlots, createBooking, initiatePayment, getPackage } from "@/lib/api";

declare global {
  interface Window {
    payhere: any;
  }
}

export default function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ packageId?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const router = useRouter();
  const { selectedPackage, setSelectedPackage, packages, isLoadingPackages } = useCustomer();

  const [directPkg, setDirectPkg] = useState<PackageItem | null>(null);
  const [isResolvingPkg, setIsResolvingPkg] = useState(false);

  // Determine active package: context pkg if matching ID, or find in packages list, or direct fetch
  const targetPkgId = resolvedParams.packageId || selectedPackage?.id;

  useEffect(() => {
    if (!targetPkgId) return;

    // Check if context package is already the target
    if (selectedPackage && selectedPackage.id === targetPkgId) {
      return;
    }

    // Check if it exists in loaded packages
    const match = packages.find((p) => p.id === targetPkgId);
    if (match) {
      setSelectedPackage(match);
      return;
    }

    // If not in packages and packages finished loading (or direct URL load), fetch from API
    if (!isLoadingPackages) {
      setIsResolvingPkg(true);
      getPackage(targetPkgId)
        .then((apiPkg) => {
          const mapped: PackageItem = {
            id: apiPkg.id,
            name: apiPkg.name,
            description: apiPkg.description,
            priceLKR: Number(apiPkg.priceLkr || apiPkg.priceLKR || 0),
            isBestSeller: apiPkg.isBestSeller,
            durationHours: apiPkg.durationHours,
            studioName: apiPkg.studioName,
            photographersCount: apiPkg.photographersCount,
            metaLine: apiPkg.metaLine,
            highlightFeature: {
              title: apiPkg.highlightTitle,
              subtitle: apiPkg.highlightSubtitle,
            },
            whatsIncluded: apiPkg.whatsIncluded || [],
            imageUrl: apiPkg.imageUrl,
          };
          setDirectPkg(mapped);
          setSelectedPackage(mapped);
        })
        .catch((err) => {
          console.error("Failed to load booking package:", err);
        })
        .finally(() => {
          setIsResolvingPkg(false);
        });
    }
  }, [targetPkgId, selectedPackage, packages, isLoadingPackages, setSelectedPackage]);

  const activePackage = (selectedPackage?.id === targetPkgId ? selectedPackage : null) || directPkg || selectedPackage;

  // State for Date & Time selection
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [selectedTime, setSelectedTime] = useState("");

  const formattedPrice = `LKR ${activePackage?.priceLKR?.toLocaleString() || 0}`;

  const [timeSlots, setTimeSlots] = useState<{time: string, disabled: boolean}[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function fetchSlots() {
      try {
        if (!activePackage?.studioName) return;
        setIsLoadingSlots(true);
        const slots = await getAvailableSlots(selectedDate, activePackage.studioName);
        const formattedSlots = slots.map((s: any) => ({
          time: s.time,
          disabled: !s.available
        }));
        setTimeSlots(formattedSlots);
        
        // Auto-select first available slot if current is disabled or none selected
        if (formattedSlots.length > 0) {
          const available = formattedSlots.filter((s: { time: string, disabled: boolean }) => !s.disabled);
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
  }, [selectedDate, activePackage?.studioName]);

  const handleProceed = async () => {
    try {
      setIsBooking(true);
      if (!activePackage) throw new Error("No package selected");
      
      // 1. Create the booking in backend
      const booking = await createBooking({
        packageId: activePackage.id,
        date: selectedDate,
        time: selectedTime,
        studioRoom: activePackage.studioName,
        notes: "Booked via Island Monkey App",
      });
      
      // 2. Fetch PayHere checkout payload using the booking ID
      const paymentData = await initiatePayment(booking.id);
      
      // 3. Setup PayHere callbacks
      window.payhere.onCompleted = function onCompleted(orderId: string) {
        // Navigate to confirmation page
        const queryParams = new URLSearchParams({
          packageId: activePackage?.id || "",
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

  if (isResolvingPkg) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6433] mb-3" />
        <p className="text-sm text-white/70">Loading booking package...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0 select-none">
      {/* Upper Navigation Row in Dark Frame */}
      <div className="px-3 pt-2 pb-0.5 flex items-center justify-between shrink-0">
        <Link
          href={`/customer/packages/${activePackage?.id || ""}`}
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
            {activePackage?.name || "Package"}
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
              {activePackage?.durationHours}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <h1 className="text-[18px] font-medium text-slate-900 tracking-tight">
              {activePackage?.name}
            </h1>
            <p className="text-[13px] font-medium text-slate-500">
              {activePackage?.metaLine}
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
            disabled={isBooking || !selectedTime}
            className="flex-1 py-3.5 px-6 bg-linear-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] hover:from-[#FF8A55] hover:to-[#EA5A33] text-white text-[14px] font-medium rounded-full transition-all shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.4),0_8px_20px_rgba(232,74,35,0.25)] active:scale-[0.98] cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isBooking && <Loader2 className="w-4 h-4 animate-spin text-white" />}
            <span>Proceed to Confirm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
