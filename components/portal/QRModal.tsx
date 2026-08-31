"use client";

import { X, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QRCode } from "react-qr-code";

export interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName: string;
  qrValue: string;
  pointsBalance: string;
}

/**
 * QR Modal Component using shadcn Badge and Button:
 * Triggered by the QR icon button on Home.
 * Large QR code, caption: "Present this QR code at partner stores to pay or verify identity."
 */
export function QRModal({
  isOpen,
  onClose,
  userFullName,
  qrValue,
  pointsBalance,
}: QRModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Bottom Sheet Card */}
      <div className="relative z-10 w-full max-w-full bg-white rounded-t-[28px] p-6 pb-8 shadow-2xl flex flex-col items-center gap-5 border-t border-im-border/40 animate-in slide-in-from-bottom duration-300 ease-out">
        
        {/* Pull Indicator Pill */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full -mt-2 mb-1" />
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#9e9e9e] hover:text-im-heading hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center gap-1 text-center pt-2">
          <Badge className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full flex items-center gap-1 hover:bg-im-accent-light border-none">
            <ShieldCheck className="w-3.5 h-3.5" /> Customer Verification
          </Badge>
          <h3 className="text-[20px] font-bold text-im-heading">{userFullName}</h3>
          <p className="text-[14px] text-im-body">
            Balance: <span className="font-semibold text-im-accent">{pointsBalance} Points</span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-5 bg-white border-2 border-dashed border-im-accent/30 rounded-xl shadow-inner flex flex-col items-center justify-center">
          <QRCode
            value={qrValue || "https://example.com"}
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox="0 0 276 276"
            fgColor="#09090b"
            bgColor="#EE352333"
            level="M"
          />
          <span className="text-[10px] font-mono text-im-body mt-2 tracking-widest">
            {qrValue}
          </span>
        </div>

        {/* Caption */}
        <p className="text-[13px] text-im-body text-center leading-snug px-2">
          Present this QR code at partner stores to pay or verify identity.
        </p>
      </div>
    </div>
  );
}
