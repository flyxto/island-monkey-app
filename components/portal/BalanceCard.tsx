"use client";

import React from "react";
import { QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface BalanceCardProps {
  points: number;
  formattedPoints: string;
  onQROpen?: () => void;
}

/**
 * Balance Card Component using shadcn Card:
 * Solid black background (#000000), rounded-xl, padding 24px (p-6).
 * Label "Available Balance", stacked "Points" + large balance number (48px semibold white).
 * Soft blurred white glow blobs in top-right and bottom-left corners.
 */
export function BalanceCard({ formattedPoints, onQROpen }: BalanceCardProps) {
  return (
    <Card className="relative overflow-hidden bg-black text-white rounded-xl shadow-xl border border-white/10 p-0">
      {/* Decorative blurred glow shapes */}
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/15 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="relative z-10 flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-white/70 tracking-wide uppercase">
            Available Balance
          </span>
          {onQROpen && (
            <button
              onClick={onQROpen}
              type="button"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
              title="Show QR Code"
            >
              <QrCode className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-white/80">Points</span>
          <span className="text-[44px] sm:text-[48px] font-semibold leading-none text-white tracking-tight">
            {formattedPoints}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
