"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ScannerViewfinderProps {
  targetCustomerId?: string;
}

/**
 * ScannerViewfinder Component:
 * 256px tall dark camera view placeholder.
 * Dashed-border square viewfinder in center with an animated scanning line sweeping through it.
 * Caption pill at bottom: "Align QR code within frame".
 * Dev-trigger button that navigates to Customer Details for lookup.
 */
export function ScannerViewfinder({
  targetCustomerId = "cust_8829",
}: ScannerViewfinderProps) {
  const router = useRouter();

  const handleSimulateScan = () => {
    router.push(`/partner/customer/${targetCustomerId}?discount=450`);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 256px Camera Viewport Container */}
      <div className="relative h-[256px] w-full bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-white/10 flex items-center justify-center">
        {/* Dimmed Background Overlay with Camera Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0 flex items-center justify-center">
          <QrCode className="w-48 h-48 text-white/5" />
        </div>

        {/* Viewfinder Square (200px x 200px) */}
        <div className="relative z-10 w-[190px] h-[190px] border-2 border-dashed border-[#4648d4] rounded-2xl p-2 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(70,72,212,0.3)]">
          {/* Viewfinder Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#4648d4] rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#4648d4] rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#4648d4] rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#4648d4] rounded-br-sm" />

          {/* Animated Sweeping Line (CSS keyframe motion) */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#4648d4] to-transparent shadow-[0_0_12px_#4648d4] animate-pulse my-auto" />
        </div>

        {/* Caption Pill at Bottom */}
        <div className="absolute bottom-3 z-20 px-4 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white text-[12px] font-medium tracking-wide">
          Align QR code within frame
        </div>
      </div>

      {/* Dev Trigger / Demo Scan CTA */}
      <Button
        type="button"
        onClick={handleSimulateScan}
        className="w-full py-3 bg-[#e1e0ff] text-[#4648d4] hover:bg-[#4648d4] hover:text-white transition-all text-[14px] font-semibold rounded-[4px] flex items-center justify-center gap-2 border border-[#4648d4]/30 h-auto"
      >
        <span>Simulate QR Scan (John Doe #8829)</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
