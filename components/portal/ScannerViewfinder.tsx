"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCode, ArrowRight, Camera, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isReactNativeWebView,
  requestNativeQRScanner,
  subscribeToNativeMessages,
  triggerNativeHaptic,
} from "@/lib/native-bridge";

export interface ScannerViewfinderProps {
  targetCustomerId?: string;
}

/**
 * ScannerViewfinder Component:
 * - Integrates with React Native WebView Bridge: opens native hardware camera scanner
 *   and listens for QR_SCANNED messages.
 * - In standard browser mode: provides camera capture trigger and manual QR entry.
 */
export function ScannerViewfinder({
  targetCustomerId = "",
}: ScannerViewfinderProps) {
  const router = useRouter();
  const [qrInput, setQrInput] = useState(targetCustomerId);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(isReactNativeWebView());

    // Listen for native scanner scan events
    const unsubscribe = subscribeToNativeMessages((msg) => {
      if (msg.type === "QR_SCANNED" && msg.qrCode) {
        triggerNativeHaptic("success");
        setQrInput(msg.qrCode);
        router.push(`/partner/customer/${encodeURIComponent(msg.qrCode.trim())}?discount=450`);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  const handleScan = (codeToUse?: string) => {
    const code = codeToUse || qrInput;
    if (code.trim()) {
      router.push(`/partner/customer/${encodeURIComponent(code.trim())}?discount=450`);
    }
  };

  const handleNativeCameraTrigger = () => {
    triggerNativeHaptic("medium");
    requestNativeQRScanner();
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Camera Viewport Container */}
      <div className="relative h-60 w-full bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-white/10 flex flex-col items-center justify-center p-4">
        {/* Dimmed Background Overlay with Camera Pattern */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 z-0 flex items-center justify-center">
          <QrCode className="w-48 h-48 text-white/5" />
        </div>

        {/* Viewfinder Square (180px x 180px) */}
        <div className="relative z-10 w-44 h-44 border-2 border-dashed border-white/50 rounded-2xl p-2 flex flex-col justify-between overflow-hidden shadow-[0_0_20px_rgba(255,100,51,0.2)]">
          {/* Viewfinder Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF6433] rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF6433] rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF6433] rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF6433] rounded-br-sm" />

          {/* Animated Sweeping Line */}
          <div className="w-full h-0.5 bg-linear-to-r from-transparent via-[#FF6433] to-transparent shadow-[0_0_14px_#FF6433] animate-pulse my-auto" />

          {/* Native Camera Button Overlay if running in app */}
          {isNative ? (
            <button
              type="button"
              onClick={handleNativeCameraTrigger}
              className="z-20 my-auto py-2 px-3 bg-[#FF6433] hover:bg-[#E84A23] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Open Scanner</span>
            </button>
          ) : null}
        </div>

        {/* Caption Pill at Bottom */}
        <div className="absolute bottom-3 z-20 px-4 py-1.5 bg-black/60 backdrop-blur-xs border border-white/15 rounded-full text-white text-[12px] font-medium tracking-wide flex items-center gap-1.5">
          {isNative ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#FF6433]" />
              <span>Native Camera Ready</span>
            </>
          ) : (
            <span>Align customer QR code within frame</span>
          )}
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
            placeholder="e.g. NX-682-A or Customer QR"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-mono text-slate-800 focus:outline-none focus:border-[#FF6433]"
          />
          <Button
            type="button"
            onClick={() => handleScan()}
            disabled={!qrInput.trim()}
            className="px-4 py-2 bg-[#FF6433] hover:bg-[#E84A23] text-white rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <span>Lookup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
