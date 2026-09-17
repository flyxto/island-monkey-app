"use client";

import { use } from "react";
import Link from "next/link";
import { TransactionForm } from "@/components/portal/TransactionForm";
import { MOCK_CUSTOMER_LOOKUPS } from "@/lib/mock-data/partner-portal";
import { ChevronLeft, CheckCircle2, User, Phone } from "lucide-react";

export default function CustomerDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ discount?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  const customer =
    MOCK_CUSTOMER_LOOKUPS[resolvedParams.id] || MOCK_CUSTOMER_LOOKUPS.cust_8829;

  const prefilledDiscount = resolvedSearchParams.discount || "450";

  return (
    <div className="relative flex-1 flex flex-col w-full h-full overflow-hidden bg-black select-none">
      {/* Hero Header Block */}
      <div className="relative h-56 sm:h-64 w-full bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#0c0a09] flex flex-col items-center justify-center overflow-hidden shrink-0">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent pointer-events-none" />

        {/* Floating Back Button */}
        <Link
          href="/partner/scan"
          className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95"
          aria-label="Back to scan"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2]" />
        </Link>

        {/* Active Member Status Pill */}
        <div className="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium rounded-full shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active Member</span>
        </div>

        {/* Customer Identity Hero Presentation */}
        <div className="flex flex-col items-center justify-center z-10 -mt-2">
          <div className="w-16 h-16 rounded-full bg-white/20 p-1 border border-white/40 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#E84A23] font-medium text-xl shadow-xs">
              <User className="w-7 h-7 text-[#FF6433]" />
            </div>
          </div>
          <h1 className="text-[20px] font-medium text-white tracking-tight mt-2.5">
            {customer.name}
          </h1>
          <div className="flex items-center gap-1.5 text-white/70 text-[12px] font-medium mt-0.5">
            <Phone className="w-3 h-3" />
            <span>{customer.phone}</span>
          </div>
        </div>

        {/* Gradient Fade to Bottom Sheet */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Sheet Container */}
      <div className="relative z-20 flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] -mt-6 pt-3 px-4 sm:px-5 pb-8 flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col gap-3.5 pt-1">
          {/* Customer Balance Card */}
          <div className="bg-white rounded-[24px] p-4 border border-black/5 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Available Balance
              </span>
              <span className="text-[13px] font-medium text-slate-700 mt-0.5">
                Member ID: #{resolvedParams.id}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-medium text-[#FF6433] tracking-tight">
                {customer.formattedBalance}
              </span>
              <span className="text-[12px] font-medium text-slate-400">
                pts
              </span>
            </div>
          </div>

          {/* Points Deduction Bento Form */}
          <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col gap-3">
            <h2 className="text-[15px] font-medium text-slate-900 tracking-tight">
              Process Points Deduction
            </h2>
            <TransactionForm
              initialAmount={prefilledDiscount}
              initialDescription="Blue Denim Jacket"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
