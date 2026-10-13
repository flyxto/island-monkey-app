import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F5]">
      {/* Left Pane - Branding/Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 bg-[#0E0E12] text-white relative overflow-hidden select-none">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF6433]/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF7A45]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Brand Mark */}
        <div className="relative z-10 flex items-center">
          <Image
            src="/logo.webp"
            alt="Island Monkey"
            width={48}
            height={48}
            className="w-12 h-12 object-contain rounded-2xl"
            priority
          />
        </div>

        {/* Central Hero Message */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[12px] font-medium text-[#FF8C6E] inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A45]" />
            <span>Exclusive Island Experiences</span>
          </span>
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
            Discover the island&apos;s premier creative &amp; lifestyle hub.
          </h1>
          <p className="text-[15px] text-slate-400 font-normal leading-relaxed max-w-md">
            Connect with curated photography studios, verified talent, and premier island partner venues effortlessly.
          </p>
        </div>

        {/* Bottom Highlights Row */}
        <div className="relative z-10 flex items-center gap-4 text-white/50 text-[12px] font-medium">
          <span className="text-white/80">Studio Network</span>
          <span>•</span>
          <span className="text-white/80">VIP Rewards</span>
          <span>•</span>
          <span className="text-white/80">Talent Booking</span>
        </div>
      </div>

      {/* Right Pane - Form Content Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-[420px] bg-white rounded-[32px] p-6 sm:p-8 border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-300">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center mb-1">
            <Image
              src="/logo.webp"
              alt="Island Monkey"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
              priority
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
