"use client";

import { useState } from "react";
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
  targetCustomerId = "ISLANDMONKEY-CUST-00000000-0000-0000-0000-000000000001",
}: ScannerViewfinderProps) {
  const router = useRouter();
  const [qrInput, setQrInput] = useState(targetCustomerId);

  const handleScan = (codeToUse?: string) => {
    const code = codeToUse || qrInput;
    if (code.trim()) {
      router.push(`/partner/customer/${encodeURIComponent(code.trim())}?discount=450`);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 256px Camera Viewport Container */}
      <div className="relative h-60 w-full bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-white/10 flex items-center justify-center">
        {/* Dimmed Background Overlay with Camera Pattern */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 z-0 flex items-center justify-center">
          <QrCode className="w-48 h-48 text-white/5" />
        </div>

        {/* Viewfinder Square (200px x 200px) */}
        <div className="relative z-10 w-44 h-44 border-2 border-dashed border-white/50 rounded-2xl p-2 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(70,72,212,0.3)]">
          {/* Viewfinder Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50 rounded-br-sm" />

          {/* Animated Sweeping Line (CSS keyframe motion) */}
          <div className="w-full h-0.5 bg-linear-to-r from-transparent via-[#FF6433] to-transparent shadow-[0_0_14px_#FF6433] animate-pulse my-auto" />
        </div>

        {/* Caption Pill at Bottom */}
        <div className="absolute bottom-3 z-20 px-4 py-1.5 bg-black/60 backdrop-blur-xs border border-white/15 rounded-full text-white text-[12px] font-medium tracking-wide">
          Align customer QR code within frame
        </div>
      </div>

      {/* QR Input & Lookup Section */}
      <div className="flex flex-col gap-2 bg-white rounded-2xl p-3.5 border border-black/5 shadow-xs">
        <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
          Scan or Enter Customer QR
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="e.g. ISLANDMONKEY-CUST-..."
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-mono text-slate-800 focus:outline-none focus:border-[#FF6433]"
          />
          <Button
            type="button"
            onClick={() => handleScan()}
            className="px-4 py-2 bg-[#FF6433] hover:bg-[#E84A23] text-white rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
