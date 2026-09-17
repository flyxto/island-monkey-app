"use client";

import Link from "next/link";
import { MOCK_PARTNER_TRANSACTIONS } from "@/lib/mock-data/partner-portal";
import { ScanLine, Tag, History, ArrowRight, ShoppingBag } from "lucide-react";

export default function PartnerHomePage() {
  const recentTransactions = MOCK_PARTNER_TRANSACTIONS.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4">
      {/* Quick Actions Row: White Glass Style matching Home & Gigs Card */}
      <div className="px-3 pt-2 pb-0.5 flex items-center gap-2.5 shrink-0">
        <Link
          href="/partner/scan"
          className="relative overflow-hidden flex-1 h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-2xl font-medium text-[13px] text-slate-900 px-4 flex items-center justify-between shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all group cursor-pointer"
        >
          {/* Upper Specular Glass Sheen */}
          <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-2xl pointer-events-none" />
          <span className="relative z-10 text-slate-900 tracking-tight">Scan QR</span>
          <ScanLine className="relative z-10 w-4 h-4 text-slate-700 group-hover:text-slate-950 transition-colors" />
        </Link>

        <Link
          href="/partner/offers"
          className="relative overflow-hidden flex-1 h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-2xl font-medium text-[13px] text-slate-900 px-4 flex items-center justify-between shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all group cursor-pointer"
        >
          {/* Upper Specular Glass Sheen */}
          <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-2xl pointer-events-none" />
          <span className="relative z-10 text-slate-900 tracking-tight">Offers</span>
          <Tag className="relative z-10 w-4 h-4 text-slate-700 group-hover:text-slate-950 transition-colors" />
        </Link>

        <Link
          href="/partner/history"
          className="relative overflow-hidden w-12 h-12 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-2xl text-slate-900 flex items-center justify-center shrink-0 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
          title="Transaction History"
        >
          {/* Upper Specular Glass Sheen */}
          <div className="absolute inset-x-1.5 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-2xl pointer-events-none" />
          <History className="relative z-10 w-4.5 h-4.5 text-slate-800" />
        </Link>
      </div>

      {/* Bottom Sheet Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-28 flex flex-col gap-3 overflow-hidden">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Section Header */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <h2 className="text-[15px] font-medium text-slate-900 tracking-tight">
            Recent Activity
          </h2>
          <Link
            href="/partner/history"
            className="text-[12px] font-medium text-slate-500 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scrollable Transactions List - Matching Recent Booking List Item UI */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col gap-2 pb-4">
          {recentTransactions.map((tx, idx) => {
            const isYesterday = tx.timestamp.toLowerCase().includes("yesterday");
            const month = "Oct";
            const day = isYesterday ? "23" : "24";

            return (
              <Link
                key={tx.id}
                href="/partner/history"
                className="bg-white rounded-2xl p-3 shadow-xs border border-black/5 flex items-center gap-3.5 hover:shadow-sm transition-all shrink-0"
              >
                {/* Date Column with subtle vertical line */}
                <div className="flex flex-col items-center justify-center w-7 shrink-0">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                    {month}
                  </span>
                  <span className="text-[18px] font-medium text-slate-800 leading-none mt-0.5">
                    {day}
                  </span>
                </div>

                <div className="w-px h-7 bg-slate-200/80 shrink-0" />

                {/* Thumbnail */}
                <div
                  className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center shadow-xs overflow-hidden ${
                    idx % 2 === 0
                      ? "bg-linear-to-br from-amber-500 via-orange-500 to-[#E84A23] text-white"
                      : "bg-linear-to-br from-teal-500 via-emerald-500 to-emerald-600 text-white"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-white/95" />
                </div>

                {/* Title & Details (Item Name, Timestamp & Customer User ID) */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[14px] font-medium text-slate-900 truncate">
                    {tx.itemName}
                  </span>
                  <span className="text-[12px] font-medium text-slate-400 truncate mt-0.5">
                    {tx.timestamp} • User {tx.userId}
                  </span>
                </div>

                {/* Points Deducted & Amount in LKR */}
                <div className="flex flex-col items-end shrink-0 pl-1">
                  <span className="text-[13px] font-medium text-[#FF6433]">
                    -{tx.pointsDeducted} pts
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                    LKR {tx.amountLKR.toLocaleString()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
