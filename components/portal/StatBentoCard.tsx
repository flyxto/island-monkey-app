"use client";

import { User, ChartNoAxesCombined} from "lucide-react";
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
    <Card className="relative overflow-hidden bg-[#faf6f0] text-black rounded-xl border border-im-border/20 p-0">
      {/* Soft blurred gray glow shapes */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-slate-300/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-slate-300/40 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="relative z-10 flex flex-col gap-3 p-6">
        {mode === "summary" ? (
          <>
            <h1 className="text-[14px] font-medium text-im-body tracking-wide">
              DAILY SUMMARY
            </h1>
            {/* Large Stat Number & Points label */}
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] sm:text-[48px] font-semibold text-black leading-none tracking-tight">
                {typeof pointsNumber === "number" ? pointsNumber.toLocaleString() : pointsNumber}
              </span>
              <span className="text-[18px] font-semibold text-im-body">
                Points
              </span>
            </div>

            {/* Subline with Icon */}
            <div className="flex items-center gap-2 pt-1 text-im-body text-[16px]">
              <ChartNoAxesCombined className="w-4 h-4 text-slate-700" />
              <span className="font-normal">
                {transactionsCount} Transactions Processed
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Customer Name */}
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                Customer Identity
              </span>
              <span className="text-[48px] sm:text-[48px] font-semibold text-black leading-none tracking-tight">
                {customerName}
              </span>
            </div>

            {/* Customer Phone / User ID subline */}
            <div className="flex items-center gap-2 pt-1 text-[#9195B1] text-[16px]">
              <div className="p-1 text-slate-700 rounded-full">
                <User className="w-4.5 h-4.5 fill-current stroke-1" />
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
