"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPartnerTransactions } from "@/lib/api";
import { ScanLine, Tag, History, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";

export default function PartnerHomePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPartnerTransactions()
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch partner transactions:", err);
        setTransactions([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const recentTransactions = transactions.slice(0, 4);

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

        {/* Scrollable Transactions List */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col gap-2 pb-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF6433]" />
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center shadow-xs border border-black/5 flex flex-col items-center justify-center gap-2">
              <p className="text-[14px] font-medium text-slate-700">No transactions yet</p>
              <p className="text-[12px] text-slate-400">Scan customer QR codes to redeem points at your store.</p>
              <Link
                href="/partner/scan"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6433] text-white rounded-full text-[12px] font-medium shadow-xs hover:bg-[#E84A23] transition-colors"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scan Customer QR</span>
              </Link>
            </div>
          ) : (
            recentTransactions.map((tx, idx) => {
              const txDate = tx.createdAt ? new Date(tx.createdAt) : new Date();
              const month = txDate.toLocaleString("en-US", { month: "short" });
              const day = txDate.getDate().toString();
              const points = Math.abs(Number(tx.amount || 0));
              const amountLkr = points * 200;
              const customerName =
                [tx.user?.firstName, tx.user?.lastName].filter(Boolean).join(" ") ||
                (tx.user?.memberId ? `Member ${tx.user.memberId}` : "Customer");
              const timeStr = txDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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

                  {/* Title & Details (Item Name, Timestamp & Customer) */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[14px] font-medium text-slate-900 truncate">
                      {tx.description || "Point Redemption"}
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 truncate mt-0.5">
                      {timeStr} • {customerName}
                    </span>
                  </div>

                  {/* Points Deducted & Amount in LKR */}
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span className="text-[13px] font-medium text-[#FF6433]">
                      -{points.toLocaleString()} pts
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                      LKR {amountLkr.toLocaleString()}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
