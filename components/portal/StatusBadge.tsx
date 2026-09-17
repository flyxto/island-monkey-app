"use client";

import { Clock, Check, X } from "lucide-react";

export type StatusType = "pending" | "accepted" | "live" | "rejected" | "completed";

export interface StatusBadgeProps {
  status: StatusType;
  customLabel?: string;
  className?: string;
}

/**
 * Reusable StatusBadge Component for Model Portal Gigs & Bookings:
 * - pending: warm amber/orange with clock icon
 * - accepted / live: soft modern emerald with check icon
 * - rejected: soft rose with cross icon
 * - completed: neutral slate with check icon
 */
export function StatusBadge({ status, customLabel, className = "" }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200/80",
          text: "text-amber-700",
          icon: Clock,
          label: "Pending",
        };
      case "accepted":
      case "live":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200/80",
          text: "text-emerald-700",
          icon: Check,
          label: status === "live" ? "Live" : "Accepted",
        };
      case "rejected":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200/80",
          text: "text-rose-700",
          icon: X,
          label: "Rejected",
        };
      case "completed":
        return {
          bg: "bg-slate-100",
          border: "border-slate-200",
          text: "text-slate-600",
          icon: Check,
          label: "Completed",
        };
      default:
        return {
          bg: "bg-slate-100",
          border: "border-slate-200",
          text: "text-slate-600",
          icon: null,
          label: status,
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[11px] font-medium tracking-tight shadow-2xs ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0 stroke-[2.2]" />}
      <span>{customLabel || style.label}</span>
    </span>
  );
}
