"use client";

import { useState } from "react";
import { usePartner } from "@/lib/portal/PartnerContext";
import { lookupCustomerByQR, deductPoints } from "@/lib/api/partner";
import { ScanLine, User, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  memberId: string;
  pointsBalance: number;
}

export default function QRScanPage() {
  const { profile, refresh } = usePartner();

  const [qrInput, setQrInput] = useState("");
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [deductLoading, setDeductLoading] = useState(false);
  const [deductError, setDeductError] = useState<string | null>(null);
  const [deductSuccess, setDeductSuccess] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!qrInput.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    setCustomer(null);
    setDeductSuccess(null);
    try {
      const data = await lookupCustomerByQR(qrInput.trim());
      setCustomer(data);
    } catch (e: any) {
      setLookupError(e.message || "Customer not found");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleDeduct = async () => {
    if (!customer || !amount || Number(amount) <= 0) return;
    setDeductLoading(true);
    setDeductError(null);
    setDeductSuccess(null);
    try {
      await deductPoints({
        userId: customer.id,
        amount: Number(amount),
        description: description || undefined,
      });
      setDeductSuccess(`Successfully deducted ${amount} pts from ${customer.firstName} ${customer.lastName}`);
      setAmount("");
      setDescription("");
      setCustomer(null);
      setQrInput("");
      refresh(); // Refresh partner transactions
    } catch (e: any) {
      setDeductError(e.message || "Failed to deduct points");
    } finally {
      setDeductLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#000000] tracking-tight">
          {profile?.storeName || "My Store"}
        </h1>
        <span className="px-3 py-1 bg-im-accent-light text-im-accent text-[12px] font-semibold rounded-full">
          QR Scanner Mode
        </span>
      </div>

      {/* QR Input Block */}
      <div className="bg-[#f8f9ff] border-2 border-dashed border-im-accent/30 rounded-2xl p-6 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-im-accent-light flex items-center justify-center">
          <ScanLine className="w-8 h-8 text-im-accent" />
        </div>
        <p className="text-[14px] text-im-muted text-center">
          Enter the customer&apos;s QR code value or member ID to look up their account.
        </p>
        <div className="flex gap-2 w-full">
          <Input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            placeholder="QR Code or Member ID (e.g. NX-123-A)"
            className="flex-1 bg-white border border-im-border rounded-xl focus-visible:ring-im-accent"
          />
          <Button
            onClick={handleLookup}
            disabled={lookupLoading || !qrInput.trim()}
            className="bg-im-accent hover:bg-im-accent/90 text-white rounded-xl px-4"
          >
            {lookupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup"}
          </Button>
        </div>
        {lookupError && (
          <div className="flex items-center gap-2 text-red-500 w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm">{lookupError}</span>
          </div>
        )}
      </div>

      {/* Customer Found Card */}
      {customer && (
        <div className="bg-white border border-im-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-im-hero flex items-center justify-center text-im-accent border border-im-border/40">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-im-heading">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-[12px] text-im-muted">
                ID: {customer.memberId} • Balance: {customer.pointsBalance?.toLocaleString() ?? "—"} pts
              </p>
            </div>
          </div>

          {/* Deduction Form */}
          <div className="bg-[#F8F9FF] border border-im-border rounded-xl p-4 flex flex-col gap-3">
            <h2 className="text-[16px] font-bold text-[#000000]">Point Deduction Details</h2>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Points to deduct (e.g. 450)"
              min="1"
              className="bg-white border-im-border focus-visible:ring-im-accent"
            />
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Item / description (optional)"
              className="bg-white border-im-border focus-visible:ring-im-accent"
            />
            {deductError && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-sm">{deductError}</span>
              </div>
            )}
            <Button
              onClick={handleDeduct}
              disabled={deductLoading || !amount || Number(amount) <= 0}
              className="w-full bg-im-btn-primary hover:bg-im-btn-primary/90 text-white font-semibold rounded-xl h-11"
            >
              {deductLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
              ) : (
                "Confirm Deduction"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {deductSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-[14px] text-emerald-700 font-medium">{deductSuccess}</p>
        </div>
      )}
    </div>
  );
}
