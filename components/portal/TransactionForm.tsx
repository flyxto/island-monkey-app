"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";

export interface TransactionFormProps {
  initialAmount?: string;
  initialDescription?: string;
  onSubmit?: (data: { amount: string; description: string }) => void;
}

/**
 * Shared TransactionForm Component:
 * Discount Amount input (prefixed with "LKR") + Description input + Full-width black Deduct Points CTA.
 * NOTE (Design Spec Alignment): Uses rounded-[4px] border radius per Partner Portal Figma spec,
 * in contrast to Customer Portal's rounded-[2px] buttons.
 */
export function TransactionForm({
  initialAmount = "450",
  initialDescription = "Blue Denim Jacket",
  onSubmit,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [description] = useState(initialDescription);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    onSubmit?.({ amount, description });
    setTimeout(() => {
      setIsSuccess(false);
    }, 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Discount Amount Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
          Discount Amount (LKR)
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-[14px] font-medium text-slate-400 select-none">
            LKR
          </span>
          <span className="absolute right-3.5 text-[14px] font-medium text-slate-400 select-none">
            .00
          </span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="w-full h-11 pl-13 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
          />
        </div>
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
          Item Description
        </label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., Blue Denim Jacket"
          className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus-visible:ring-[#FF6433] focus-visible:border-[#FF6433] shadow-none"
        />
      </div>

      {/* Deduct Points CTA Button */}
      <Button
        type="submit"
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
