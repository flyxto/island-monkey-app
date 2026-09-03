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
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-semibold text-im-body tracking-wider">
          DISCOUNT AMOUNT
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[16px] font-normal text-im-body select-none">
            LKR
          </span>
          <span className="absolute right-3 text-[16px] font-normal text-im-body select-none">
            .00
          </span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="w-full h-11 pl-12 pr-4 bg-white border border-im-border rounded-lg text-[15px] text-[#000000] focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-semibold text-im-body tracking-wider">
          DESCRIPTION
        </label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., Blue Denim Jacket"
          className="w-full h-11 px-4 bg-white border border-im-border rounded-lg text-[15px] text-[#000000] focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
        />
      </div>

      {/* Deduct Points CTA Button */}
      <Button
        type="submit"
        className={`w-full h-12 mt-2 text-[15px] font-medium text-white rounded-lg transition-all flex items-center justify-center gap-2 ${
          isSuccess
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-im-btn-primary hover:bg-im-btn-primary-hover active:bg-im-btn-primary-active"
        }`}
      >
        {isSuccess ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Points Deducted Successfully!</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Deduct Points</span>
          </>
        )}
      </Button>
    </form>
  );
}
