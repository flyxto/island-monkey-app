"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { TransactionForm } from "@/components/portal/TransactionForm";
import { lookupCustomerByQr, deductPoints } from "@/lib/api";
import { usePartner } from "@/lib/portal/PartnerContext";
import { ChevronLeft, CheckCircle2, User, Phone, Loader2, AlertCircle } from "lucide-react";

export default function CustomerDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ discount?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const { refreshPartner } = usePartner();

  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prefilledDiscount = resolvedSearchParams.discount || "450";

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await lookupCustomerByQr(decodeURIComponent(resolvedParams.id));
        setCustomer(data);
      } catch (err: any) {
        console.error("Failed to lookup customer:", err);
        setError(err?.message || "Customer not found");
      } finally {
        setIsLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchCustomer();
    }
  }, [resolvedParams.id]);

  const handleDeduct = async (formData: { amount: string; description: string }) => {
    if (!customer?.id) return;
    const pts = Number(formData.amount);
    const result = await deductPoints({
      userId: customer.id,
      amount: pts,
      description: formData.description,
    });
    // Update local customer balance
    if (result && typeof result.newBalance === "number") {
      setCustomer((prev: any) => ({ ...prev, balance: result.newBalance }));
    } else {
      setCustomer((prev: any) => ({
        ...prev,
        balance: Math.max(0, (prev?.balance || 0) - pts),
      }));
    }
    // Refresh partner stats
    await refreshPartner();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6433]" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black p-6 gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-white text-[16px] font-medium">{error || "Customer not found"}</p>
        <p className="text-slate-400 text-[13px] max-w-xs">
          No customer found matching code &ldquo;{decodeURIComponent(resolvedParams.id)}&rdquo;.
        </p>
        <Link
          href="/partner/scan"
          className="mt-2 px-5 py-2.5 bg-[#FF6433] hover:bg-[#E84A23] text-white text-[13px] font-medium rounded-full transition-colors"
        >
          Back to Scanner
        </Link>
      </div>
    );
  }

  const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Member";
  const customerPhone = customer.phone || "No phone provided";
  const formattedBalance = Number(customer.balance || 0).toLocaleString();

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
            {customerName}
          </h1>
          <div className="flex items-center gap-1.5 text-white/70 text-[12px] font-medium mt-0.5">
            <Phone className="w-3 h-3" />
            <span>{customerPhone}</span>
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
                Member ID: #{customer.memberId || customer.id.slice(0, 8)}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-medium text-[#FF6433] tracking-tight">
                {formattedBalance}
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
              initialDescription="Point Redemption"
              onSubmit={handleDeduct}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
