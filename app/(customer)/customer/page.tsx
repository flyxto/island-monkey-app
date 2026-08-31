"use client";

import Link from "next/link";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { BalanceCard } from "@/components/portal/BalanceCard";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { SessionListItem } from "@/components/portal/SessionListItem";
import { QRModal } from "@/components/portal/QRModal";
import { MOCK_UPCOMING_SESSIONS } from "@/lib/mock-data/customer-portal";
import { Info, History, Handshake } from "lucide-react";

export default function CustomerHomePage() {
  const { user, balance, isQRModalOpen, setIsQRModalOpen } = useCustomer();

  return (
    <div className="flex flex-col gap-8 pt-8 pb-11.5">
      <div className="flex flex-col gap-4">
        {/* Greeting Row */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
            Good morning, {user.firstName}.
          </h1>
        </div>

        {/* Balance Card */}
        <BalanceCard
          points={balance.pointsBalance}
          formattedPoints={balance.formattedPoints}
        />

        {/* Info Row: 1 Point = 200 LKR Today */}
        <div className="flex items-center gap-2 p-3 rounded-lg ">
          <Info className="w-5 h-5 text-im-accent shrink-0" />
          <p className="text-[14px] leading-tight">
            <strong className="font-bold text-im-muted">
              1 Point = {balance.conversionRateLKR} LKR Today
            </strong>{" "}
            <span className="text-im-muted-light font-semibold">
              • Conversion rates are updated daily.
            </span>
          </p>
        </div>
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
          icon={Handshake}
          onClick={() => setIsQRModalOpen(true)}
        />
      </div>

      {/* Upcoming Sessions Section */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-im-heading">
            Upcoming Sessions
          </h2>
          <Link
            href="/customer/sessions"
            className="text-[12px] font-semibold text-im-accent hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="bg-white border border-[#C6C6CD4D]/30 rounded-lg shadow-sm overflow-hidden">
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
