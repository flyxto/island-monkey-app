"use client";

import React from "react";
import { X, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-90 bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-5 border border-im-border/40 relative">
        {/* Close Button */}
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
          <p className="text-[13px] text-[#9e9e9e]">
            Balance: <span className="font-semibold text-im-accent">{pointsBalance} Points</span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white border-2 border-dashed border-im-accent/30 rounded-xl shadow-inner flex flex-col items-center justify-center">
          {/* Stylized QR Code SVG */}
          <div className="w-45 h-45 bg-slate-950 p-3 rounded-lg flex items-center justify-center relative">
            <div className="w-full h-full bg-white p-2 rounded flex flex-col justify-between">
              {/* Grid pattern simulating high-res QR code */}
              <div className="grid grid-cols-5 gap-1 w-full h-full">
                <div className="bg-black rounded-sm" />
                <div className="bg-black rounded-sm" />
                <div className="bg-white" />
                <div className="bg-black rounded-sm" />
                <div className="bg-black rounded-sm" />

                <div className="bg-black rounded-sm" />
                <div className="bg-white" />
                <div className="bg-black rounded-sm" />
                <div className="bg-white" />
                <div className="bg-black rounded-sm" />

                <div className="bg-white" />
                <div className="bg-black rounded-sm" />
                <div className="bg-black rounded-sm" />
                <div className="bg-black rounded-sm" />
                <div className="bg-white" />

                <div className="bg-black rounded-sm" />
                <div className="bg-white" />
                <div className="bg-black rounded-sm" />
                <div className="bg-white" />
                <div className="bg-black rounded-sm" />

                <div className="bg-black rounded-sm" />
                <div className="bg-black rounded-sm" />
                <div className="bg-white" />
                <div className="bg-black rounded-sm" />
                <div className="bg-black rounded-sm" />
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#9e9e9e] mt-2 tracking-widest">
            {qrValue}
          </span>
        </div>

        {/* Caption */}
        <p className="text-[13px] text-im-body text-center leading-snug px-2">
          Present this QR code at partner stores to pay or verify identity.
        </p>

        {/* Dismiss CTA using shadcn Button */}
        <Button
          onClick={onClose}
          className="w-full py-2.5 bg-black text-white text-[14px] font-medium rounded-XS hover:bg-black/90 transition-colors h-auto"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
