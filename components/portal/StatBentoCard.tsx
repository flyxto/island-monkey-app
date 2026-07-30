"use client";

import React from "react";
import { User, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface StatBentoCardProps {
  mode: "summary" | "customer";
  // Summary mode props
  pointsNumber?: string | number;
  transactionsCount?: number;
  // Customer mode props
  customerName?: string;
  customerSubtext?: string;
}

/**
 * StatBentoCard Component:
 * Bento/stat card background: #eff4ff (light indigo tint), rounded-xl.
 * Soft blurred indigo glow blobs (rgba(70,72,212,0.12) / rgba(70,72,212,0.24)) top-right & bottom-left.
 * Adaptable for Home Daily Summary or Customer Identity Lookup.
 */
export function StatBentoCard({
  mode,
  pointsNumber = "1,240",
  transactionsCount = 28,
  customerName = "John Doe",
  customerSubtext = "65466565436",
}: StatBentoCardProps) {
  return (
    <Card className="relative overflow-hidden bg-[#eff4ff] text-[#000000] rounded-xl shadow-md border border-[#c6c6cd]/50 p-0">
      {/* Indigo-tinted soft blurred glow shapes */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#4648d4]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#4648d4]/20 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="relative z-10 flex flex-col gap-3 p-6">
        {mode === "summary" ? (
          <>
            {/* Large Stat Number & Points label */}
            <div className="flex items-baseline gap-2">
              <span className="text-[44px] sm:text-[48px] font-semibold text-[#000000] leading-none tracking-tight">
                {typeof pointsNumber === "number" ? pointsNumber.toLocaleString() : pointsNumber}
              </span>
              <span className="text-[18px] font-semibold text-[#000000]">
                Points
              </span>
            </div>

            {/* Subline with Icon */}
            <div className="flex items-center gap-2 pt-1 text-[#45464d] text-[14px]">
              <div className="p-1 bg-[#4648d4]/10 text-[#4648d4] rounded-full">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-medium">
                {transactionsCount} Transactions Processed
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Customer Name */}
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#4648d4]">
                Customer Identity
              </span>
              <span className="text-[36px] sm:text-[44px] font-semibold text-[#000000] leading-none tracking-tight">
                {customerName}
              </span>
            </div>

            {/* Customer Phone / User ID subline */}
            <div className="flex items-center gap-2 pt-1 text-[#45464d] text-[14px]">
              <div className="p-1 bg-[#4648d4]/10 text-[#4648d4] rounded-full">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium tracking-wide">
                {customerSubtext}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
