"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { PackageItem, AddonItem } from "@/lib/mock-data/customer-portal";
import { DateCalendar } from "@/components/portal/DateCalendar";
import { TimeSlotChip } from "@/components/portal/TimeSlotChip";
import { 
  ChevronLeft, 
  Loader2, 
  Plus, 
  Minus, 
  Sparkles, 
  Camera, 
  Scissors, 
  Check, 
  Mic 
} from "lucide-react";
import { getAvailableSlots, createBooking, initiatePayment, getPackage, getAddons } from "@/lib/api";

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

  // Addons & Extra Hours state
  const [availableAddons, setAvailableAddons] = useState<AddonItem[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Record<string, number>>({});
  const [extraHours, setExtraHours] = useState<number>(0);
  const [isLoadingAddons, setIsLoadingAddons] = useState<boolean>(true);

  // Determine active package
  const targetPkgId = resolvedParams.packageId || selectedPackage?.id;

  useEffect(() => {
    if (!targetPkgId) return;

    if (selectedPackage && selectedPackage.id === targetPkgId) {
      return;
    }

    const match = packages.find((p) => p.id === targetPkgId);
    if (match) {
      setSelectedPackage(match);
      return;
    }

    if (!isLoadingPackages) {
      setIsResolvingPkg(true);
      getPackage(targetPkgId)
        .then((apiPkg) => {
          const mapped: PackageItem = {
            id: apiPkg.id,
            name: apiPkg.name,
            description: apiPkg.description,
            priceLKR: Number(apiPkg.priceLkr || apiPkg.priceLKR || 0),
            additionalHourPriceLKR: apiPkg.additionalHourPriceLkr ? Number(apiPkg.additionalHourPriceLkr) : 0,
            category: apiPkg.category || 'STUDIO',
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

  useEffect(() => {
    async function loadAddons() {
      try {
        setIsLoadingAddons(true);
        const data = await getAddons();
        const mapped: AddonItem[] = (Array.isArray(data) ? data : []).map((a: any) => ({
          id: a.id,
          name: a.name,
          type: a.type,
          priceLKR: Number(a.priceLkr),
          description: a.description,
          imageUrl: a.imageUrl,
          isActive: a.isActive,
        }));
        setAvailableAddons(mapped);
      } catch (err) {
        console.error("Failed to fetch addons:", err);
      } finally {
        setIsLoadingAddons(false);
      }
    }
    loadAddons();
  }, []);

  const activePackage = (selectedPackage?.id === targetPkgId ? selectedPackage : null) || directPkg || selectedPackage;

  // State for Date & Time selection
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [selectedTime, setSelectedTime] = useState("");

  const [timeSlots, setTimeSlots] = useState<{time: string, disabled: boolean}[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Price calculations
  const basePrice = activePackage?.priceLKR || 0;
  const overtimeRate = activePackage?.additionalHourPriceLKR || 0;
  const overtimeTotal = extraHours * overtimeRate;

  const addonsTotal = Object.entries(selectedAddonIds).reduce((acc, [id, qty]) => {
    if (qty <= 0) return acc;
    const addon = availableAddons.find((a) => a.id === id);
    return acc + (addon ? addon.priceLKR * qty : 0);
  }, 0);

  const grandTotal = basePrice + overtimeTotal + addonsTotal;
  const formattedGrandTotal = `LKR ${grandTotal.toLocaleString()}`;

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

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) => {
      const current = prev[addonId] || 0;
      if (current > 0) {
        const copy = { ...prev };
        delete copy[addonId];
        return copy;
      } else {
        return { ...prev, [addonId]: 1 };
      }
    });
  };

  const handleProceed = async () => {
    try {
      setIsBooking(true);
      if (!activePackage) throw new Error("No package selected");
      
      const formattedAddons = Object.entries(selectedAddonIds)
        .filter(([_, qty]) => qty > 0)
        .map(([addonId, quantity]) => ({ addonId, quantity }));

      // 1. Create the booking in backend
      const booking = await createBooking({
        packageId: activePackage.id,
        date: selectedDate,
        time: selectedTime,
        studioRoom: activePackage.studioName,
        extraHours,
        addons: formattedAddons,
        notes: "Booked via Island Monkey App",
      });
      
      // 2. Fetch PayHere checkout payload using the booking ID
      const paymentData = await initiatePayment(booking.id);
      
      // 3. Setup PayHere callbacks
      window.payhere.onCompleted = function onCompleted(orderId: string) {
        const queryParams = new URLSearchParams({
          packageId: activePackage?.id || "",
          date: selectedDate,
          time: selectedTime,
          orderId,
        });
        router.push(`/customer/booking/confirmation?${queryParams.toString()}`);
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
        alert("Payment was cancelled. You can try again.");
        setIsBooking(false);
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

  const equipmentAddons = availableAddons.filter((a) => a.type === "EQUIPMENT");
  const editingAddons = availableAddons.filter((a) => a.type === "EDITING");

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
          {formattedGrandTotal}
        </span>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-8 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Selected Package Bento Card */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full flex items-center gap-1">
              {activePackage?.category === "PODCAST" ? (
                <>
                  <Mic className="w-3 h-3" />
                  Podcast Setup
                </>
              ) : (
                "Studio Space"
              )}
            </span>
            <span className="text-[12px] font-medium text-slate-400">
              Base: {activePackage?.durationHours}
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

        {/* Additional Overtime Hours Stepper */}
        {overtimeRate > 0 && (
          <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-medium text-slate-900">
                  Extra Hours / Overtime
                </h2>
                <p className="text-[12px] text-slate-500">
                  +LKR {overtimeRate.toLocaleString()}/hour
                </p>
              </div>

              {/* Counter Buttons */}
              <div className="flex items-center gap-3 bg-[#FAF6F0] border border-[#E8E1D5] rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setExtraHours((prev) => Math.max(0, prev - 1))}
                  disabled={extraHours <= 0}
                  className="w-8 h-8 rounded-full bg-white text-slate-800 disabled:opacity-40 flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
                  aria-label="Decrease hours"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-semibold text-sm w-8 text-center text-[#0B1C30]">
                  +{extraHours}h
                </span>
                <button
                  type="button"
                  onClick={() => setExtraHours((prev) => prev + 1)}
                  className="w-8 h-8 rounded-full bg-[#FF6433] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
                  aria-label="Increase hours"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-2 pt-1">
              {[0, 1, 2, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setExtraHours(hrs)}
                  className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                    extraHours === hrs
                      ? "bg-[#0B1C30] text-white"
                      : "bg-[#F1F3F2] text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {hrs === 0 ? "Standard" : `+${hrs} Hour${hrs > 1 ? "s" : ""}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add-on Equipment Selection */}
        {equipmentAddons.length > 0 && (
          <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#FF6433]" />
              <h2 className="text-[14px] font-medium text-slate-900">
                Additional Equipment (Optional)
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {equipmentAddons.map((addon) => {
                const isSelected = !!selectedAddonIds[addon.id];
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#FFF0EB] border-[#FF6433]/40 shadow-xs"
                        : "bg-[#FAF6F0]/60 border-[#E8E1D5] hover:bg-[#FAF6F0]"
                    }`}
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-[#0B1C30]">{addon.name}</p>
                      <p className="text-[11px] text-[#8C8880]">{addon.description || "Studio rental kit"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#FF6433]">
                        +LKR {addon.priceLKR.toLocaleString()}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#FF6433] border-[#FF6433] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Video Editing Services */}
        {editingAddons.length > 0 && (
          <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#FF6433]" />
              <h2 className="text-[14px] font-medium text-slate-900">
                Post-Production & Editing (Optional)
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {editingAddons.map((addon) => {
                const isSelected = !!selectedAddonIds[addon.id];
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#FFF0EB] border-[#FF6433]/40 shadow-xs"
                        : "bg-[#FAF6F0]/60 border-[#E8E1D5] hover:bg-[#FAF6F0]"
                    }`}
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-[#0B1C30]">{addon.name}</p>
                      <p className="text-[11px] text-[#8C8880]">{addon.description || "Full post-production"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-semibold text-[#FF6433]">
                        +LKR {addon.priceLKR.toLocaleString()}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#FF6433] border-[#FF6433] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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

        {/* Price Breakdown Details */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-2 text-xs">
          <div className="flex justify-between py-1 text-slate-600">
            <span>Base Package ({activePackage?.durationHours})</span>
            <span className="font-mono font-semibold text-slate-900">
              LKR {basePrice.toLocaleString()}
            </span>
          </div>

          {extraHours > 0 && (
            <div className="flex justify-between py-1 text-emerald-700">
              <span>Overtime (+{extraHours} hr{extraHours > 1 ? "s" : ""})</span>
              <span className="font-mono font-semibold">
                +LKR {overtimeTotal.toLocaleString()}
              </span>
            </div>
          )}

          {addonsTotal > 0 && (
            <div className="flex justify-between py-1 text-[#FF6433]">
              <span>Equipment & Editing Add-ons</span>
              <span className="font-mono font-semibold">
                +LKR {addonsTotal.toLocaleString()}
              </span>
            </div>
          )}

          <div className="border-t border-slate-100 pt-2.5 mt-1 flex justify-between items-baseline">
            <span className="font-semibold text-slate-900 text-sm">Estimated Total</span>
            <span className="font-mono font-bold text-slate-900 text-base">
              {formattedGrandTotal}
            </span>
          </div>
        </div>

        {/* Total & Specular Proceed Action Bar */}
        <div className="bg-white rounded-[24px] p-4 border border-black/5 shadow-xs flex items-center justify-between gap-4 mt-0.5 shrink-0">
          <div className="flex flex-col pl-1">
            <span className="text-[11px] font-medium text-slate-400">Total Price</span>
            <span className="text-[18px] font-medium text-slate-900 leading-tight">
              {formattedGrandTotal}
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
