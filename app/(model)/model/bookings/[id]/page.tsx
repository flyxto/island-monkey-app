"use client";

import { use, useState } from "react";
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
  Camera,
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
    <div className="flex flex-col gap-8 py-2 pt-6 pb-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Link
            href="/model/bookings"
            className="p-1 bg-white border border-im-border text-im-heading rounded-full hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Back to bookings"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-[24px] font-medium text-im-heading tracking-tight">
            Booking Details
          </h1>
        </div>
      </div>

      {/* Booking Preview */}
      <div className="flex flex-col items-center justify-center bg-im-accent/10 text-im-accent/70 border rounded-sm h-41.75">
          <Camera className="w-16 h-16 opacity-80" />
          <span className="text-[14px] font-medium mt-1">Booking Preview</span>
      </div>

       {/* Client Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-normal text-[#9e9e9e] uppercase tracking-wider">
            Client / Brand
          </span>
          <h2 className="text-[24px] font-medium text-im-heading">
            {booking.clientName}
          </h2>
        </div>
        
        <StatusBadge status={activeStatus} />

      </div>

      {/* Main Bento Detail Card */}
      <Card className="bg-white rounded-xl border border-[#EFEFEF] p-0">
        <CardContent className="p-6 flex flex-col gap-5">
          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 text-[15px]">
            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-im-accent-light text-im-accent rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] text-[#9e9e9e]">Date & Time</span>
                <span className="font-medium text-[16px] text-im-heading">
                  {booking.dateTime}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-im-accent-light text-im-accent rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] text-[#9e9e9e]">Duration</span>
                <span className="font-medium text-[16px] text-im-heading">
                  {booking.duration}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-im-accent-light text-im-accent rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] text-[#9e9e9e]">Location</span>
                <span className="font-medium text-[16px] text-im-heading">
                  {booking.location}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {booking.notes && (
            <div className="p-3.5 bg-slate-50 border border-im-border/50 rounded-xl flex items-start gap-2.5 text-[14px] text-im-body">
              <FileText className="w-4 h-4 text-im-accent shrink-0 mt-0.5" />
              <div>
                <strong className="font-medium block text-im-heading">
                  Client Notes
                </strong>
                {booking.notes}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between px-1">
        <span className="text-[20px] font-medium text-im-body">Total Payment:</span>
        <span className="font-medium text-[20px] text-im-heading">
          {formattedPayment}
        </span>
      </div>

      {/* Accept Booking CTA for Pending Bookings */}
      {activeStatus === "pending" && (
        <Button
          type="button"
          onClick={handleAccept}
          className="w-full h-13 bg-im-btn-primary hover:bg-im-btn-primary/90 active:bg-im-btn-primary/80 text-white text-[16px] font-medium rounded-sm transition-all shadow-md flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>Accept Booking</span>
        </Button>
      )}
    </div>
  );
}
