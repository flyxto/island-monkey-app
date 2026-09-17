"use client";

import { useState } from "react";
import { MOCK_PARTNER_TRANSACTIONS } from "@/lib/mock-data/partner-portal";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search } from "lucide-react";

export default function PartnerHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTxs = MOCK_PARTNER_TRANSACTIONS.filter(
    (tx) =>
      tx.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Search Bar Row between top header and bottom card */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2.5 shrink-0">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search item or User ID..."
            className="w-full h-11 py-2 px-4 bg-[#1a1a1e] border border-white/10 rounded-xl text-[14px] font-medium text-white placeholder-white/40 focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] text-white border border-white/15 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
          aria-label="Search Transactions"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Header: Title and Count */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
            Transaction History
          </h1>
          <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
            {filteredTxs.length} Transactions
          </span>
        </div>

        {/* Transactions List */}
        <div className="flex flex-col gap-2.5">
          {filteredTxs.length > 0 ? (
            filteredTxs.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-2xl p-3.5 border border-black/5 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/50 flex items-center justify-center text-[#FF6433] shrink-0">
                    <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-medium text-slate-900 truncate">
                      {tx.itemName}
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 mt-0.5">
                      {tx.timestamp} • User {tx.userId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[13px] font-medium text-[#FF6433]">
                    -{tx.pointsDeducted} pts
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    LKR {tx.amountLKR.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white border border-black/5 rounded-2xl shadow-2xs">
              <p className="text-slate-400 text-[14px] font-medium">
                No transactions found matching &quot;{searchQuery}&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
