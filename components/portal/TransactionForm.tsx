"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";

export interface TransactionFormProps {
  initialAmount?: string;
  initialDescription?: string;
  onSubmit?: (data: { amount: string; description: string }) => Promise<void> | void;
  isProcessing?: boolean;
}

export function TransactionForm({
  initialAmount = "450",
  initialDescription = "Blue Denim Jacket",
  onSubmit,
  isProcessing = false,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [description, setDescription] = useState(initialDescription);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ amount, description });
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to process transaction");
    } finally {
      setLoading(false);
    }
  };

  const points = Number(amount) || 0;
  const lkrValue = points * 200;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl">
          {error}
        </div>
      )}

      {/* Points Deduction Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
          Points to Deduct
        </label>
        <div className="relative flex items-center">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="1"
            required
            className="w-full h-11 pl-4 pr-16 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
          />
          <span className="absolute right-3.5 text-[13px] font-medium text-slate-400 select-none">
            pts
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          ≈ LKR {lkrValue.toLocaleString()} redemption value (1 pt = 200 LKR)
        </span>
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
          Item Description
        </label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Blue Denim Jacket"
          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
        />
      </div>

      {/* Deduct Points CTA Button */}
      <Button
        type="submit"
        disabled={loading || isProcessing}
        className={`w-full h-11 mt-1 text-[14px] font-medium text-white rounded-full transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
          isSuccess
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-[#FF6433] hover:bg-[#E84A23] active:scale-[0.985]"
        }`}
      >
        {isSuccess ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Points Deducted Successfully!</span>
          </>
        ) : loading || isProcessing ? (
          <span>Processing Deduction...</span>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Deduct Points</span>
          </>
        )}
      </Button>
    </form>
  );
}
