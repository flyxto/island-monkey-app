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
      <div className="w-full max-w-[360px] bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-5 border border-[#c6c6cd]/40 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#9e9e9e] hover:text-[#0b1c30] hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center gap-1 text-center pt-2">
          <Badge className="px-3 py-1 bg-[#e1e0ff] text-[#4648d4] text-[12px] font-semibold rounded-full flex items-center gap-1 hover:bg-[#e1e0ff] border-none">
            <ShieldCheck className="w-3.5 h-3.5" /> Customer Verification
          </Badge>
          <h3 className="text-[20px] font-bold text-[#0b1c30]">{userFullName}</h3>
          <p className="text-[13px] text-[#9e9e9e]">
            Balance: <span className="font-semibold text-[#4648d4]">{pointsBalance} Points</span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white border-2 border-dashed border-[#4648d4]/30 rounded-xl shadow-inner flex flex-col items-center justify-center">
          {/* Stylized QR Code SVG */}
          <div className="w-[180px] h-[180px] bg-slate-950 p-3 rounded-lg flex items-center justify-center relative">
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
        <p className="text-[13px] text-[#45464d] text-center leading-snug px-2">
          Present this QR code at partner stores to pay or verify identity.
        </p>

        {/* Dismiss CTA using shadcn Button */}
        <Button
          onClick={onClose}
          className="w-full py-2.5 bg-black text-white text-[14px] font-medium rounded-[2px] hover:bg-black/90 transition-colors h-auto"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
