"use client";

import { use } from "react";
import Link from "next/link";
import { StatBentoCard } from "@/components/portal/StatBentoCard";
import { TransactionForm } from "@/components/portal/TransactionForm";
import { MOCK_CUSTOMER_LOOKUPS } from "@/lib/mock-data/partner-portal";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="flex flex-col gap-6 pt-8 pb-8">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/partner/scan"
            className="p-2 bg-white border border-im-border text-black rounded-full hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Back to scan"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-[24px] font-semibold text-black tracking-tight">
            Customer Verified
          </h1>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[12px] font-semibold rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Active Member
        </span>
      </div>

      {/* Customer Identity Bento Card */}
      <StatBentoCard
        mode="customer"
        customerName={customer.name}
        customerSubtext={`Phone: ${customer.phone}`}
      />

      {/* Points Balance Status */}
      <Card className="bg-white border border-im-border rounded-xl p-0 shadow-2xs">
        <CardContent className="p-4 flex items-center justify-between">
          <span className="text-[14px] text-im-body font-medium">
            Available Balance
          </span>
          <span className="text-[18px] font-bold text-im-accent">
            {customer.formattedBalance} Points
          </span>
        </CardContent>
      </Card>

      {/* Reused Transaction Form */}
      <div className="bg-white border border-im-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
        <h2 className="text-[16px] font-bold text-black">
          Process Points Deduction
        </h2>
        <TransactionForm
          initialAmount={prefilledDiscount}
          initialDescription="Blue Denim Jacket"
        />
      </div>
    </div>
  );
}
