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
    <Card className="relative overflow-hidden bg-white text-slate-900 rounded-[24px] border border-black/5 shadow-xs p-0">
      <CardContent className="relative z-10 flex flex-col gap-3 p-5 sm:p-6">
        {mode === "summary" ? (
          <>
            <span className="text-[12px] font-medium uppercase tracking-wider text-slate-400">
              Daily Summary
            </span>
            {/* Large Stat Number & Points label */}
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] sm:text-[44px] font-medium text-slate-900 leading-none tracking-tight">
                {typeof pointsNumber === "number" ? pointsNumber.toLocaleString() : pointsNumber}
              </span>
              <span className="text-[18px] font-medium text-[#FF6433]">
                Points
              </span>
            </div>

            {/* Subline with Icon */}
            <div className="flex items-center gap-2 pt-1 text-slate-500 text-[14px]">
              <ChartNoAxesCombined className="w-4 h-4 text-slate-400" />
              <span className="font-medium">
                {transactionsCount} Transactions Processed
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Customer Name */}
            <div className="flex flex-col gap-1">
              <span className="px-2.5 py-0.5 bg-orange-50 text-[#FF6433] rounded-full text-[11px] font-medium border border-orange-200/60 w-fit tracking-wide uppercase">
                Customer Identity
              </span>
              <span className="text-[28px] sm:text-[32px] font-medium text-slate-900 leading-tight tracking-tight mt-1">
                {customerName}
              </span>
            </div>

            {/* Customer Phone / User ID subline */}
            <div className="flex items-center gap-2 pt-1 text-slate-500 text-[14px]">
              <div className="p-1 text-slate-400 rounded-full bg-slate-100">
                <User className="w-4 h-4 stroke-[1.8]" />
              </div>
              <span className="font-medium">
                {customerSubtext}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
