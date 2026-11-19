"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2, UserRound } from "lucide-react";
import { cancelModelRequest, getMyModelRequests } from "@/lib/api";
import { getR2PublicUrl } from "@/lib/r2";

interface ModelSummary {
  id: string;
  modelCode: string;
  handle: string;
  avatarUrl: string | null;
  user: { firstName: string; lastName: string };
}

export interface CustomerModelRequest {
  id: string;
  requestCode: string;
  status: "pending" | "assigned" | "rejected" | "cancelled";
  preferredDate: string | null;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  requestedModel: ModelSummary;
  modelBooking: {
    id: string;
    dateTime: string;
    duration: string;
    location: string;
    paymentLkr: string | number;
    status: string;
    model: ModelSummary;
  } | null;
}

const STATUS_STYLES: Record<CustomerModelRequest["status"], { label: string; className: string }> = {
  pending: { label: "Awaiting studio", className: "bg-amber-50 text-amber-700 border-amber-200" },
  assigned: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Declined", className: "bg-rose-50 text-rose-600 border-rose-200" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-500 border-slate-200" },
};

const colomboDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

/** preferredDate is a calendar date stored at UTC midnight. */
const dateOnly = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" }).format(
    new Date(iso)
  );

const fullName = (m: ModelSummary) => `${m.user.firstName} ${m.user.lastName}`.trim();

export function ModelRequestList() {
  const [requests, setRequests] = useState<CustomerModelRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    getMyModelRequests()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load requests"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this model request?")) return;
    setCancellingId(id);
    try {
      await cancelModelRequest(id);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel request");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-1 shrink-0">
        <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">Model Requests</h1>
        <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
          {requests.length} Requests
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6433]" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center bg-white border border-black/5 rounded-2xl shadow-2xs">
            <p className="text-slate-400 text-[14px] font-medium">
              {error ? error : "No model requests yet. Open a model's profile on the Models tab to request a booking."}
            </p>
          </div>
        ) : (
          requests.map((r) => {
            const booking = r.modelBooking;
            const model = booking?.model ?? r.requestedModel;
            const status = STATUS_STYLES[r.status];
            const isExpanded = expandedId === r.id;
            const subtitle = booking
              ? colomboDateTime(booking.dateTime)
              : r.preferredDate
              ? `Preferred ${dateOnly(r.preferredDate)}`
              : "Date to be confirmed";

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-xs border border-black/5 hover:shadow-sm transition-all shrink-0 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-3 flex items-center gap-3.5 text-left cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl shrink-0 overflow-hidden bg-orange-100 text-[#FF6433] flex items-center justify-center">
                    {model.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={getR2PublicUrl(model.avatarUrl)} alt={fullName(model)} className="w-full h-full object-cover" />
                    ) : (
                      <UserRound className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[14px] font-medium text-slate-900 truncate">{fullName(model)}</span>
                    <span className="text-[12px] font-medium text-slate-400 mt-0.5 truncate">{subtitle}</span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-1 gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.className}`}>
                      {status.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 mx-3 mb-1 border-t border-dashed border-slate-200 flex flex-col gap-2.5 text-[13px]">
                    <Row label="Request ID" value={r.requestCode} />
                    <Row label="Model ID" value={model.modelCode} />
                    {booking ? (
                      <>
                        {booking.model.id !== r.requestedModel.id && (
                          <p className="text-[12px] font-medium text-amber-700 bg-amber-50 rounded-xl p-2.5">
                            The studio assigned {fullName(booking.model)} instead of {fullName(r.requestedModel)}.
                          </p>
                        )}
                        <Row label="Date & Time" value={colomboDateTime(booking.dateTime)} />
                        <Row label="Duration" value={booking.duration} />
                        <Row label="Location" value={booking.location} />
                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
                          <span className="font-medium text-slate-900">Price</span>
                          <span className="font-medium text-[#FF6433]">
                            LKR {Number(booking.paymentLkr || 0).toLocaleString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {r.preferredDate && <Row label="Preferred Date" value={dateOnly(r.preferredDate)} />}
                        {r.notes && <Row label="Your Notes" value={r.notes} />}
                        {r.status === "pending" && (
                          <>
                            <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                              The studio will contact the model and call you to confirm the date, time and price.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleCancel(r.id)}
                              disabled={cancellingId === r.id}
                              className="self-start mt-1 px-4 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[12px] font-medium cursor-pointer disabled:opacity-50"
                            >
                              {cancellingId === r.id ? "Cancelling..." : "Cancel Request"}
                            </button>
                          </>
                        )}
                        {r.status === "rejected" && r.adminNotes && <Row label="Studio Note" value={r.adminNotes} />}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-400 font-medium shrink-0">{label}</span>
      <span className="font-medium text-slate-900 text-right whitespace-pre-wrap">{value}</span>
    </div>
  );
}
