"use client";

import React from "react";
import Link from "next/link";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { BalanceCard } from "@/components/portal/BalanceCard";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { SessionListItem } from "@/components/portal/SessionListItem";
import { QRModal } from "@/components/portal/QRModal";
import { MOCK_UPCOMING_SESSIONS } from "@/lib/mock-data/customer-portal";
import { QrCode, Info, History, Store } from "lucide-react";

export default function CustomerHomePage() {
  const { user, balance, isQRModalOpen, setIsQRModalOpen } = useCustomer();

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#0b1c30] tracking-tight">
          Good morning, {user.firstName}.
        </h1>
        <button
          onClick={() => setIsQRModalOpen(true)}
          type="button"
          className="p-2.5 bg-[#e1e0ff] text-[#4648d4] rounded-full hover:bg-[#4648d4] hover:text-white transition-all shadow-sm"
          title="Open QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* Balance Card */}
      <BalanceCard
        points={balance.pointsBalance}
        formattedPoints={balance.formattedPoints}
      />

      {/* Info Row: 1 Point = 200 LKR Today */}
      <div className="flex items-center gap-2 p-3 bg-white border border-[#c6c6cd]/50 rounded-lg shadow-2xs">
        <Info className="w-4 h-4 text-[#4648d4] shrink-0" />
        <p className="text-[13px] leading-tight">
          <strong className="font-semibold text-[#0b1c30]">
            1 Point = {balance.conversionRateLKR} LKR Today
          </strong>{" "}
          <span className="text-[#9e9e9e]">
            • Conversion rates are updated daily.
          </span>
        </p>
      </div>

      {/* Quick Actions Row */}
      <div className="flex items-center gap-3">
        <QuickActionCard
          title="View History"
          icon={History}
          href="/customer/sessions"
        />
        <QuickActionCard
          title="Find Partners"
          icon={Store}
          onClick={() => setIsQRModalOpen(true)}
        />
      </div>

      {/* Upcoming Sessions Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#0b1c30]">
            Upcoming Sessions
          </h2>
          <Link
            href="/customer/sessions"
            className="text-[12px] font-semibold text-[#4648d4] hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="bg-white border border-[#c6c6cd] rounded-lg shadow-sm overflow-hidden">
          {MOCK_UPCOMING_SESSIONS.map((session, index) => (
            <SessionListItem
              key={session.id}
              title={session.title}
              timestamp={session.timestamp}
              studioTag={session.studioTag}
              showDivider={index < MOCK_UPCOMING_SESSIONS.length - 1}
            />
          ))}
        </div>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        userFullName={`${user.firstName} ${user.lastName}`}
        qrValue={user.qrCodeValue}
        pointsBalance={balance.formattedPoints}
      />
    </div>
  );
}
