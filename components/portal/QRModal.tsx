"use client";

import { X, ShieldCheck, CheckCircle2 } from "lucide-react";
import { QRCode } from "react-qr-code";

export interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName: string;
  qrValue: string;
  pointsBalance: string;
}

/**
 * QR Modal Component:
 * Styled as the signature Island Monkey VIP Digital Member Pass.
 * Features an orange gradient outer frame, member avatar monogram,
 * crisp white pass with authentic die-cut ticket notches, and QR code.
 */
export function QRModal({
  isOpen,
  onClose,
  userFullName,
  qrValue,
  pointsBalance,
}: QRModalProps) {
  if (!isOpen) return null;

  const names = userFullName.trim().split(" ");
  const initials = names.length >= 2
    ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
    : userFullName.slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-200 animate-in fade-in select-none">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Island Monkey VIP Pass Card */}
      <div className="relative z-10 w-full max-w-sm bg-gradient-to-b from-[#E84A23] via-[#FF6A48] to-[#FF8C6E] rounded-[36px] p-3.5 shadow-2xl border border-white/25 flex flex-col gap-3 animate-in zoom-in-95 duration-200">
        
        {/* Pass Top Header: Member Info & Close Action */}
        <div className="flex items-center justify-between px-1 pt-1">
          {/* Avatar + Monogram + Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0 w-11 h-11 rounded-full bg-white/20 border border-white/40 p-0.5 shadow-xs flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#E84A23] font-medium text-[13px] shadow-xs">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-white text-[#E84A23] rounded-full shadow-xs flex items-center justify-center border border-white">
                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-medium text-white text-[15px] tracking-tight leading-tight truncate">
                {userFullName}
              </span>
              <span className="text-[11px] font-medium text-white/80 mt-0.5">
                Island Monkey VIP Member
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close pass"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Inner Crisp White Pass */}
        <div className="bg-white rounded-[26px] p-4 sm:p-5 shadow-inner flex flex-col items-center gap-3.5 relative overflow-hidden">
          
          {/* Verification Badge */}
          <div className="px-3 py-1 bg-[#FFF0EB] text-[#FF6433] text-[11px] font-medium rounded-full flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Member Pass</span>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-[#FAF6F4] border-2 border-dashed border-[#FF6433]/30 rounded-[22px] flex flex-col items-center justify-center shadow-2xs">
            <QRCode
              value={qrValue || "https://example.com"}
              size={180}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
              fgColor="#09090B"
              bgColor="#FAF6F4"
              level="M"
            />
            <span className="text-[10px] font-mono font-medium text-slate-400 mt-2 tracking-wider">
              {qrValue}
            </span>
          </div>

          {/* Die-Cut Ticket Divider with Punch Notches */}
          <div className="relative w-full flex items-center justify-center my-0.5">
            <div className="absolute -left-7 w-5 h-5 rounded-full bg-[#FF6A48]" />
            <div className="w-full border-t-2 border-dashed border-slate-200/90" />
            <div className="absolute -right-7 w-5 h-5 rounded-full bg-[#FF6A48]" />
          </div>

          {/* Balance & Rate Information */}
          <div className="flex items-center justify-between w-full px-1">
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-400">
                Available Balance
              </span>
              <span className="text-[15px] font-medium text-slate-900">
                {pointsBalance} Points
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[11px] font-medium text-slate-400">
                Redemption Rate
              </span>
              <span className="text-[13px] font-medium text-[#FF6433]">
                1 Pt = 200 LKR
              </span>
            </div>
          </div>

          {/* Footer Instruction */}
          <p className="text-[11px] font-medium text-slate-400 text-center leading-snug px-2">
            Present at studio check-in or certified partner boutiques to redeem points.
          </p>
        </div>

        {/* Specular Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md text-white text-[13px] font-medium rounded-full transition-all text-center cursor-pointer shadow-xs active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
