"use client";

import { useState } from "react";
import { usePartner } from "@/lib/portal/PartnerContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { History, ShoppingBag, Search, Loader2, AlertCircle } from "lucide-react";

export default function PartnerHistoryPage() {
  const { transactions, loading, error } = usePartner();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    return (
      tx.description?.toLowerCase().includes(q) ||
      tx.user?.memberId?.toLowerCase().includes(q) ||
      tx.user?.firstName?.toLowerCase().includes(q) ||
      tx.user?.lastName?.toLowerCase().includes(q)
    );
  });

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

  return (
    <div className="flex flex-col gap-8 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-black tracking-tight">
          Transaction History
        </h1>
        <div className="p-2 bg-im-accent-light text-im-accent rounded-full">
          <History className="w-5 h-5" />
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search description or member ID..."
            className="w-full h-11 pl-4.5 pr-6.25 bg-white border border-im-border rounded-full text-[16px] text-[#000000] placeholder-[#6B7280] focus-visible:ring-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-im-accent-light text-im-accent rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-im-accent/90 hover:text-im-accent-light transition-colors"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-im-accent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 py-12 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center bg-white border border-im-border rounded-xl">
            <p className="text-[#9e9e9e] text-[15px]">
              {searchQuery ? `No transactions matching "${searchQuery}".` : "No transactions yet."}
            </p>
          </div>
        ) : (
          filtered.map((tx, index) => (
            <Card key={tx.id} className="w-full bg-white border border-im-border rounded-xl p-0 shadow-2xs hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-0 flex flex-col">
                <div className="flex items-center justify-between py-3.5 px-4 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-im-accent-light flex items-center justify-center text-im-accent shrink-0 border border-im-border/40">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-[#000000]">
                        {tx.description || "Points Deduction"}
                      </span>
                      <span className="text-[13px] text-im-body">
                        {formatTime(tx.createdAt)} • {tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : "Member"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-bold text-im-accent">
                      -{Math.abs(tx.amount)} pts
                    </span>
                    <span className="text-[11px] text-[#9e9e9e]">
                      LKR {(Math.abs(tx.amount) * 200).toLocaleString()}
                    </span>
                  </div>
                </div>
                {index < filtered.length - 1 && (
                  <div className="h-px bg-im-border/30 mx-4" />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
