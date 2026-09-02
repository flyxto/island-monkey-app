"use client";

import { Card, CardContent } from "@/components/ui/card";

export interface BalanceCardProps {
  points?: number;
  formattedPoints: string;
  onQROpen?: () => void;
  variant?: "single-glow" | "double-glow";
}

/**
 * Balance Card Component using shadcn Card:
 * Solid black background (#000000), rounded-xl, padding 24px (p-6).
 * Label "Available Balance", stacked "Points" + large balance number (48px semibold white).
 * Support for variant="double-glow" (adds mirrored left/right glow blobs for Model Portal).
 */
export function BalanceCard({
  formattedPoints,
  onQROpen,
  variant = "single-glow",
}: BalanceCardProps) {
  return (
    <Card className="relative overflow-hidden bg-[#EE3523] text-white rounded-xl shadow-[0px_4px_12px_0px_#0F172A0D] border border-white/10 p-0">
      {/* Primary blurred glow shapes (Top-Right & Bottom-Left) */}
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-22 h-22 bg-white/40 rounded-full blur-2xl pointer-events-none" />

      {/* Mirrored secondary glow shapes for Model Portal (Top-Left & Bottom-Right) */}
      {variant === "double-glow" && (
        <>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </>
      )}

      <CardContent className="relative z-10 flex flex-col gap-1 p-6">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-[#BEC6E0] tracking-wide uppercase">
            Available Balance
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[48px] font-medium text-white">Points</span>
          <span className="text-[48px] sm:text-[48px] font-semibold leading-none text-white tracking-tight">
            {formattedPoints}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
