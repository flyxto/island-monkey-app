"use client";

import Link from "next/link";
import { StatBentoCard } from "@/components/portal/StatBentoCard";
import { usePartner } from "@/lib/portal/PartnerContext";
import { ScanLine, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PartnerHomePage() {
  const { profile, transactions, loading, error } = usePartner();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-im-accent" />
        <p className="text-sm text-im-muted">Loading your store...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-7 h-7 text-red-400" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // Compute daily totals from transactions
  const today = new Date().toDateString();
  const todayTxns = transactions.filter(
    (tx) => new Date(tx.createdAt).toDateString() === today
  );
  const dailyPointsProcessed = todayTxns.reduce(
    (acc, tx) => acc + Math.abs(tx.amount),
    0
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    if (isToday) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    if (isYesterday) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      {/* Store Name Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#000000] tracking-tight">
          {profile?.storeName || "My Store"}
        </h1>
      </div>

      {/* Daily Summary Bento Card */}
      <StatBentoCard
        mode="summary"
        pointsNumber={dailyPointsProcessed}
        transactionsCount={todayTxns.length}
      />

      {/* Recent Activity Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#000000]">
            Recent Activity
          </h2>
          <Link
            href="/partner/history"
            className="text-[14px] font-semibold text-im-accent hover:underline"
          >
            View All
          </Link>
        </div>

        <Card className="bg-[#f8f9ff] border border-im-border/30 rounded-xl overflow-hidden shadow-2xs p-0">
          <CardContent className="p-0 flex flex-col">
            {recentTxns.length === 0 ? (
              <div className="py-8 text-center text-sm text-im-muted">
                No transactions yet today.
              </div>
            ) : (
              recentTxns.map((tx, index) => (
                <div key={tx.id} className="flex flex-col w-full">
                  <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-im-accent-light flex items-center justify-center text-im-accent shrink-0 border border-im-border/40">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-black">
                          {tx.description || "Points Deduction"}
                        </span>
                        <span className="text-[12px] font-normal text-im-body">
                          {formatTime(tx.createdAt)} • {tx.user?.memberId || "Member"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[14px] font-medium text-im-accent shrink-0">
                      -{Math.abs(tx.amount)} pts
                    </span>
                  </div>
                  {index < recentTxns.length - 1 && (
                    <div className="h-px bg-im-border/30 mx-4" />
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
