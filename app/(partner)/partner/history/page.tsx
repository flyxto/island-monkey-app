"use client";

import React, { useState } from "react";
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#000000] tracking-tight">
          Transaction History
        </h1>
        <div className="p-2 bg-[#e1e0ff] text-[#4648d4] rounded-full">
          <History className="w-5 h-5" />
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by item or User ID..."
            className="w-full h-11 pl-4 pr-10 bg-white border border-[#c6c6cd] rounded-full text-[15px] text-[#000000] placeholder-[#9e9e9e] focus-visible:ring-[#4648d4] focus-visible:border-[#4648d4] shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-[#4648d4] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-[#4648d4]/90 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Transactions List */}
      <Card className="bg-[#f8f9ff] border border-[#c6c6cd]/30 rounded-xl overflow-hidden shadow-2xs p-0">
        <CardContent className="p-0 flex flex-col">
          {filteredTxs.length > 0 ? (
            filteredTxs.map((tx, index) => (
              <div key={tx.id} className="flex flex-col w-full">
                <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#4648d4] shrink-0 border border-[#c6c6cd]/40">
                      <ShoppingBag className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-[#000000]">
                        {tx.itemName}
                      </span>
                      <span className="text-[13px] text-[#45464d]">
                        {tx.timestamp} • User ID: {tx.userId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-bold text-[#4648d4]">
                      -{tx.pointsDeducted} pts
                    </span>
                    <span className="text-[11px] text-[#9e9e9e]">
                      LKR {tx.amountLKR.toLocaleString()}
                    </span>
                  </div>
                </div>

                {index < filteredTxs.length - 1 && (
                  <div className="h-[1px] bg-[#c6c6cd]/30 mx-4" />
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white">
              <p className="text-[#9e9e9e] text-[15px]">
                No transactions found matching &quot;{searchQuery}&quot;.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
