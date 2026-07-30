"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MinusCircle, CheckCircle } from "lucide-react";

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
        <label className="text-[14px] font-semibold text-[#000000]">
          Discount Amount
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[14px] font-semibold text-[#9e9e9e] select-none">
            LKR
          </span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="w-full h-11 pl-12 pr-4 bg-white border border-[#c6c6cd] rounded-[4px] text-[15px] text-[#000000] focus-visible:ring-[#4648d4] focus-visible:border-[#4648d4] shadow-none"
          />
        </div>
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-semibold text-[#000000]">
          Description
        </label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., Blue Denim Jacket"
          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-[4px] text-[15px] text-[#000000] focus-visible:ring-[#4648d4] focus-visible:border-[#4648d4] shadow-none"
        />
      </div>

      {/* Deduct Points CTA Button */}
      <Button
        type="submit"
        className={`w-full h-12 mt-2 text-[15px] font-medium text-white rounded-[4px] transition-all flex items-center justify-center gap-2 ${
          isSuccess
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-black hover:bg-black/90 active:bg-black/80"
        }`}
      >
        {isSuccess ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Points Deducted Successfully!</span>
          </>
        ) : (
          <>
            <MinusCircle className="w-5 h-5" />
            <span>Deduct Points</span>
          </>
        )}
      </Button>
    </form>
  );
}
