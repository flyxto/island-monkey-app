"use client";

import { useState, useEffect } from "react";
import { getPartnerTransactions } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PartnerHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
    getPartnerTransactions()
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch partner transactions:", err);
        setTransactions([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTxs = transactions.filter((tx) => {
    const desc = (tx.description || "").toLowerCase();
    const customer = (
      [tx.user?.firstName, tx.user?.lastName].filter(Boolean).join(" ") +
      " " +
      (tx.user?.memberId || "") +
      " " +
      (tx.userId || "")
    ).toLowerCase();
    const q = searchQuery.toLowerCase();
    return desc.includes(q) || customer.includes(q);
  });

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Search Bar Row between top header and bottom card */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2.5 shrink-0">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search item or User ID..."
            className="w-full h-11 py-2 px-4 bg-[#1a1a1e] border border-white/10 rounded-xl text-[14px] font-medium text-white placeholder-white/40 focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] text-white border border-white/15 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
          aria-label="Search Transactions"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Header: Title and Count */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
            Transaction History
          </h1>
          <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
            {filteredTxs.length} Transactions
          </span>
        </div>

        {/* Transactions List */}
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF6433]" />
            </div>
          ) : filteredTxs.length > 0 ? (
            filteredTxs.map((tx, idx) => {
              const txDate = tx.createdAt ? new Date(tx.createdAt) : new Date();
              const month = txDate.toLocaleString("en-US", { month: "short" });
              const day = txDate.getDate().toString();
              const points = Math.abs(Number(tx.amount || 0));
              const amountLkr = points * 200;
              const customerName =
                [tx.user?.firstName, tx.user?.lastName].filter(Boolean).join(" ") ||
                (tx.user?.memberId ? `Member ${tx.user.memberId}` : "Customer");
              const timeStr = txDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() =>
                    setSelectedTx({
                      id: tx.id,
                      itemName: tx.description || "Point Redemption",
                      pointsDeducted: points,
                      amountLKR: amountLkr,
                      customerName,
                      userId: tx.user?.memberId || tx.userId || "Member",
                      timestamp: `${txDate.toLocaleDateString()} ${timeStr}`,
                    })
                  }
                  className="w-full text-left bg-white rounded-2xl p-3 shadow-xs border border-black/5 flex items-center gap-3.5 hover:shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  {/* Date Column with subtle vertical line */}
                  <div className="flex flex-col items-center justify-center w-7 shrink-0">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                      {month}
                    </span>
                    <span className="text-[18px] font-medium text-slate-800 leading-none mt-0.5">
                      {day}
                    </span>
                  </div>

                  <div className="w-px h-7 bg-slate-200/80 shrink-0" />

                  {/* Thumbnail */}
                  <div
                    className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center shadow-xs overflow-hidden ${
                      idx % 2 === 0
                        ? "bg-linear-to-br from-amber-500 via-orange-500 to-[#E84A23] text-white"
                        : "bg-linear-to-br from-teal-500 via-emerald-500 to-emerald-600 text-white"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 text-white/95" />
                  </div>

                  {/* Title & Details (Item Name, Timestamp & Customer User ID) */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[14px] font-medium text-slate-900 truncate">
                      {tx.description || "Point Redemption"}
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 truncate mt-0.5">
                      {timeStr} • {customerName}
                    </span>
                  </div>

                  {/* Points Deducted & Amount in LKR */}
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span className="text-[13px] font-medium text-[#FF6433]">
                      -{points.toLocaleString()} pts
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                      LKR {amountLkr.toLocaleString()}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200/60 rounded-2xl shadow-xs">
              <p className="text-slate-500 text-[14px] font-medium">
                {searchQuery
                  ? `No transactions found matching "${searchQuery}".`
                  : "No transactions recorded yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="max-w-[360px] p-6 bg-white rounded-3xl border border-slate-200 shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-[17px] font-medium text-slate-900 tracking-tight">
              Transaction Receipt
            </DialogTitle>
            <p className="text-[12px] font-medium text-slate-500">
              Verified Partner Redemption
            </p>
          </DialogHeader>

          {selectedTx && (
            <div className="flex flex-col gap-3.5 mt-2">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-slate-500">Item Redeemed</span>
                  <span className="text-slate-900">{selectedTx.itemName}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-slate-500">Points Deducted</span>
                  <span className="text-[#FF6433]">-{selectedTx.pointsDeducted.toLocaleString()} pts</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-slate-500">Total Value</span>
                  <span className="text-slate-900">LKR {selectedTx.amountLKR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-slate-500">Customer</span>
                  <span className="text-slate-700">{selectedTx.customerName || selectedTx.userId}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-slate-500">Time & Status</span>
                  <span className="text-slate-700">{selectedTx.timestamp} • Settled</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-slate-500">Reference ID</span>
                  <span className="text-slate-400 font-mono text-[11px]">{selectedTx.id}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full h-11 bg-slate-900 hover:bg-black text-white rounded-xl text-[13px] font-medium transition-colors cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
