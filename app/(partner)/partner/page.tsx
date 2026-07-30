"use client";

import React from "react";
import Link from "next/link";
import { StatBentoCard } from "@/components/portal/StatBentoCard";
import {
  MOCK_STORE_PROFILE,
  MOCK_PARTNER_TRANSACTIONS,
} from "@/lib/mock-data/partner-portal";
import { QrCode, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PartnerHomePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Store Name Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#000000] tracking-tight">
          {MOCK_STORE_PROFILE.storeName}
        </h1>
        <Link
          href="/partner/scan"
          className="p-2.5 bg-[#e1e0ff] text-[#4648d4] rounded-full hover:bg-[#4648d4] hover:text-white transition-all shadow-sm flex items-center justify-center"
          title="Scan QR Code"
        >
          <QrCode className="w-5 h-5" />
        </Link>
      </div>

      {/* Daily Summary Bento Card */}
      <StatBentoCard
        mode="summary"
        pointsNumber={MOCK_STORE_PROFILE.dailyPointsProcessed}
        transactionsCount={MOCK_STORE_PROFILE.transactionsProcessedCount}
      />

      {/* Recent Activity Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#000000]">
            Recent Activity
          </h2>
          <Link
            href="/partner/history"
            className="text-[12px] font-semibold text-[#4648d4] hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Bordered List Card (#f8f9ff bg, border rgba(198,198,205,0.3)) */}
        <Card className="bg-[#f8f9ff] border border-[#c6c6cd]/30 rounded-xl overflow-hidden shadow-2xs p-0">
          <CardContent className="p-0 flex flex-col">
            {MOCK_PARTNER_TRANSACTIONS.map((tx, index) => (
              <div key={tx.id} className="flex flex-col w-full">
                <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Icon Thumbnail */}
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

                  {/* Deducted Amount Right-aligned */}
                  <span className="text-[14px] font-bold text-[#4648d4] shrink-0">
                    -{tx.pointsDeducted} pts
                  </span>
                </div>

                {index < MOCK_PARTNER_TRANSACTIONS.length - 1 && (
                  <div className="h-[1px] bg-[#c6c6cd]/30 mx-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
