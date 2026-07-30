"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { MOCK_BOOKINGS, BookingItem } from "@/lib/mock-data/model-portal";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
  FileText,
} from "lucide-react";

export default function SingleBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [currentStatus, setCurrentStatus] = useState<BookingItem["status"] | null>(null);

  const booking: BookingItem =
    MOCK_BOOKINGS.find((b) => b.id === resolvedParams.id) || MOCK_BOOKINGS[0];

  const activeStatus = currentStatus || booking.status;
  const formattedPayment = `LKR ${booking.paymentLKR.toLocaleString()}`;

  const handleAccept = () => {
    setCurrentStatus("accepted");
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/model/bookings"
            className="p-2 bg-white border border-[#c6c6cd] text-[#0b1c30] rounded-full hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Back to bookings"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-[24px] font-semibold text-[#0b1c30] tracking-tight">
            Booking Details
          </h1>
        </div>
        <StatusBadge status={activeStatus} />
      </div>

      {/* Main Bento Detail Card */}
      <Card className="bg-white rounded-xl border border-[#c6c6cd] shadow-lg p-0">
        <CardContent className="p-6 flex flex-col gap-5">
          {/* Client Header */}
          <div className="flex items-center justify-between border-b border-[#c6c6cd]/30 pb-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-semibold text-[#9e9e9e] uppercase tracking-wider">
                Client / Brand
              </span>
              <h2 className="text-[24px] font-bold text-[#0b1c30]">
                {booking.clientName}
              </h2>
            </div>
            <span className="text-[20px] font-bold text-[#4648d4]">
              {formattedPayment}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 text-[15px]">
            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e1e0ff] text-[#4648d4] rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9e9e9e]">Date & Time</span>
                <span className="font-semibold text-[#0b1c30]">
                  {booking.dateTime}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e1e0ff] text-[#4648d4] rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9e9e9e]">Duration</span>
                <span className="font-semibold text-[#0b1c30]">
                  {booking.duration}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e1e0ff] text-[#4648d4] rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9e9e9e]">Location</span>
                <span className="font-semibold text-[#0b1c30]">
                  {booking.location}
                </span>
              </div>
            </div>

            {/* Compensation */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e1e0ff] text-[#4648d4] rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-[#9e9e9e]">Total Payment</span>
                <span className="font-semibold text-[#0b1c30]">
                  {formattedPayment}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {booking.notes && (
            <div className="p-3.5 bg-slate-50 border border-[#c6c6cd]/50 rounded-xl flex items-start gap-2.5 text-[14px] text-[#45464d]">
              <FileText className="w-4 h-4 text-[#4648d4] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-[#0b1c30]">
                  Client Notes
                </strong>
                {booking.notes}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accept Booking CTA for Pending Bookings */}
      {activeStatus === "pending" && (
        <Button
          type="button"
          onClick={handleAccept}
          className="w-full h-12 bg-black hover:bg-black/90 active:bg-black/80 text-white text-[16px] font-medium rounded-[2px] transition-all shadow-md flex items-center justify-center gap-2 mt-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Accept Booking</span>
        </Button>
      )}
    </div>
  );
}
