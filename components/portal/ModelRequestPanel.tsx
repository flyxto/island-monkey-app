"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Loader2, Send } from "lucide-react";
import { createModelRequest } from "@/lib/api";
import { triggerNativeHaptic } from "@/lib/native-bridge";

const primaryBtn =
  "relative overflow-hidden w-full h-12 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center gap-2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_24px_rgba(232,74,35,0.35)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

/** Today's date in Sri Lanka as YYYY-MM-DD, used as the earliest selectable date. */
function todayInColombo(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());
}

interface ModelRequestPanelProps {
  modelId: string;
  modelName: string;
  isAvailable: boolean;
}

/** Footer of the model profile sheet: lets a customer ask the studio to book this model. */
export function ModelRequestPanel({ modelId, modelName, isAvailable }: ModelRequestPanelProps) {
  const [step, setStep] = useState<"idle" | "form" | "sent">("idle");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAvailable) {
    return (
      <p className="text-center text-[12px] font-medium text-slate-500 py-2">
        {modelName} isn&apos;t taking bookings right now.
      </p>
    );
  }

  if (step === "sent") {
    return (
      <div className="flex flex-col items-center text-center gap-2 py-1">
        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        <p className="text-[14px] font-medium text-slate-900">Request sent</p>
        <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
          The studio will contact {modelName} and call you to confirm the date, time and price.
        </p>
        <Link href="/customer/sessions?tab=models" className="text-[13px] font-medium text-[#FF6433] mt-1">
          Track your request
        </Link>
      </div>
    );
  }

  if (step === "idle") {
    return (
      <button
        type="button"
        onClick={() => {
          triggerNativeHaptic("light");
          setStep("form");
        }}
        className={primaryBtn}
      >
        <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />
        <CalendarDays className="w-4 h-4" />
        Request Booking
      </button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createModelRequest({
        modelId,
        preferredDate: preferredDate || undefined,
        notes: notes.trim() || undefined,
      });
      triggerNativeHaptic("success");
      setStep("sent");
    } catch (err) {
      triggerNativeHaptic("error");
      setError(err instanceof Error ? err.message : "Could not send your request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="preferredDate" className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Preferred date (optional)
        </label>
        <input
          id="preferredDate"
          type="date"
          min={todayInColombo()}
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          className="h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[14px] font-medium text-slate-800 outline-none focus:border-[#FF6433] focus:ring-2 focus:ring-[#FF6433]/20"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="requestNotes" className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          What is the shoot for? (optional)
        </label>
        <textarea
          id="requestNotes"
          rows={3}
          maxLength={1000}
          placeholder="e.g. Product shoot for a clothing brand, about 3 hours"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-[14px] font-medium text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:border-[#FF6433] focus:ring-2 focus:ring-[#FF6433]/20"
        />
      </div>
      {error && <p className="text-[12px] font-medium text-rose-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep("idle")}
          disabled={isSubmitting}
          className="h-12 px-5 rounded-full bg-slate-100 text-slate-700 text-[14px] font-medium hover:bg-slate-200 cursor-pointer"
        >
          Back
        </button>
        <button type="submit" disabled={isSubmitting} className={primaryBtn}>
          <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send Request
        </button>
      </div>
      <p className="text-[11px] font-medium text-slate-400 text-center">
        No payment now. The studio confirms details with you by phone.
      </p>
    </form>
  );
}
