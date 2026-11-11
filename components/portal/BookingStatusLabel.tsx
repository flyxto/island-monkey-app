import { CheckCircle2 } from "lucide-react";

const DOT_STYLES: Record<string, string> = {
  Pending: "text-amber-600 bg-amber-500",
  Approved: "text-emerald-600 bg-emerald-500",
  Cancelled: "text-rose-600 bg-rose-500",
  Rejected: "text-rose-600 bg-rose-500",
};

/** Small status line shown under a booking row: dot + the booking's actual status. */
export function BookingStatusLabel({ status }: { status: string }) {
  if (status === "Completed") {
    return (
      <span className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-slate-400" />
        <span>Completed</span>
      </span>
    );
  }
  const [text, dot] = (DOT_STYLES[status] || "text-slate-500 bg-slate-400").split(" ");
  return (
    <span className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{status}</span>
    </span>
  );
}
