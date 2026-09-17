"use client";

import { ScannerViewfinder } from "@/components/portal/ScannerViewfinder";
import { TransactionForm } from "@/components/portal/TransactionForm";

export default function QRScanPage() {
  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Upper Status Row between top header and bottom card */}
      <div className="px-3 pt-1 pb-0.5 flex items-center justify-between shrink-0">
        <span className="text-[14px] font-medium text-white/90 tracking-tight">
          Customer QR Scanner
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Camera Active
        </span>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-4 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Viewfinder Section */}
        <ScannerViewfinder targetCustomerId="cust_8829" />

        {/* Deduction Form Bento Card */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3">
          <h2 className="text-[15px] font-medium text-slate-900 tracking-tight">
            Manual Deduction Entry
          </h2>
          <TransactionForm initialAmount="450" initialDescription="Blue Denim Jacket" />
        </div>
      </div>
    </div>
  );
}
