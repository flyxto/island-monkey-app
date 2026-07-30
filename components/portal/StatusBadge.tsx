"use client";

import React from "react";
import { Clock, Check, X } from "lucide-react";

export type StatusType = "pending" | "accepted" | "live" | "rejected" | "completed";

export interface StatusBadgeProps {
  status: StatusType;
  customLabel?: string;
  className?: string;
}

/**
 * Reusable StatusBadge Component for Model Portal Gigs & Bookings:
 * - pending: yellow bg (#ffffbf), border (#c0aa00), text (#c0aa00), clock icon
 * - accepted / live: green bg (#c5ffbf), border (#2dc000), text (#2dc000), check icon
 * - rejected: red bg (#ffbfbf), border (#c00000), text (#c00000), cross icon
 * - completed: gray bg (#ededed), border (#828282), text (#595959), no icon
 */
export function StatusBadge({ status, customLabel, className = "" }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-[#ffffbf]",
          border: "border-[#c0aa00]",
          text: "text-[#807000]",
          icon: Clock,
          label: "Pending",
        };
      case "accepted":
      case "live":
        return {
          bg: "bg-[#c5ffbf]",
          border: "border-[#2dc000]",
          text: "text-[#1e8000]",
          icon: Check,
          label: status === "live" ? "Live" : "Accepted",
        };
      case "rejected":
        return {
          bg: "bg-[#ffbfbf]",
          border: "border-[#c00000]",
          text: "text-[#c00000]",
          icon: X,
          label: "Rejected",
        };
      case "completed":
        return {
          bg: "bg-[#ededed]",
          border: "border-[#828282]",
          text: "text-[#595959]",
          icon: null,
          label: "Completed",
        };
      default:
        return {
          bg: "bg-gray-100",
          border: "border-gray-300",
          text: "text-gray-700",
          icon: null,
          label: status,
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-[12px] font-semibold tracking-wide ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{customLabel || style.label}</span>
    </span>
  );
}
