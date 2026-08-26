"use client";

import { useState } from "react";
import { MOCK_PARTNER_TRANSACTIONS } from "@/lib/mock-data/partner-portal";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { History, ShoppingBag, Search } from "lucide-react";

/**
 * Functional Extension Page:
 * Created to fulfill the bottom nav item "History" and the "View All" link from Home.
 */
export default function PartnerHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTxs = MOCK_PARTNER_TRANSACTIONS.filter(
    (tx) =>
      tx.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-black tracking-tight">
          Transaction History
        </h1>
        <div className="p-2 bg-im-accent-light text-im-accent rounded-full">
          <History className="w-5 h-5" />
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search item or User ID..."
            className="w-full h-11 pl-4.5 pr-6.25 pb-2.25 pt-2.25 bg-white border border-im-border rounded-full text-[16px] text-[#000000] placeholder-[#6B7280] focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-im-accent-light text-im-accent rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-im-accent/90 hover:text-im-accent-light transition-colors"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Transactions List */}
        {filteredTxs.length > 0 ? (
          filteredTxs.map((tx, index) => (
            <Card key={tx.id} className="rounded-xl overflow-hidden p-0">
              <CardContent className="p-0 flex flex-col">      
                <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-im-accent-light flex items-center justify-center text-im-accent shrink-0 border border-im-border/40">
                      <ShoppingBag className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-[#000000]">
                        {tx.itemName}
                      </span>
                      <span className="text-[13px] text-im-body">
                        {tx.timestamp} • User ID: {tx.userId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-bold text-im-accent">
                      -{tx.pointsDeducted} pts
                    </span>
                    <span className="text-[11px] text-[#9e9e9e]">
                      LKR {tx.amountLKR.toLocaleString()}
                    </span>
                  </div>
                </div>
                  {index < filteredTxs.length - 1 && (
                    <div className="h-px bg-im-border/30 mx-4" />
                  )}                  
              </CardContent>
            </Card>
          ))
          ) : (
              <div className="p-8 text-center bg-white">
                <p className="text-[#9e9e9e] text-[15px]">
                  No transactions found matching &quot;{searchQuery}&quot;.
                </p>
              </div>
            )}
      </div>
    </div>
  );
}
