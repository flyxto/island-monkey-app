"use client";

import { ScannerViewfinder } from "@/components/portal/ScannerViewfinder";
import { TransactionForm } from "@/components/portal/TransactionForm";
import { MOCK_STORE_PROFILE } from "@/lib/mock-data/partner-portal";

export default function QRScanPage() {
  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#000000] tracking-tight">
          {MOCK_STORE_PROFILE.storeName}
        </h1>
        <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
          QR Scanner Mode
        </span>
      </div>

      {/* QR Scanner Block */}
      <ScannerViewfinder targetCustomerId="cust_8829" />

      {/* Transaction Form Section */}
      <div className="bg-[#F8F9FF] border border-im-border rounded-xl p-5 flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-[#000000]">
          Point Deduction Details
        </h2>
        <TransactionForm initialAmount="450" initialDescription="Blue Denim Jacket" />
      </div>
    </div>
  );
}
