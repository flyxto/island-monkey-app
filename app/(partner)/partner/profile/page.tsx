"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePartner } from "@/lib/portal/PartnerContext";
import { MOCK_STORE_PROFILE } from "@/lib/mock-data/partner-portal";
import {
  Tag,
  History,
  Clock,
  Sliders,
  CreditCard,
  ShieldCheck,
  ScanLine,
  MessageSquare,
  LogOut,
  Star,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

export default function PartnerProfilePage() {
  const { partner, dailyPointsProcessed, transactionsProcessedCount, logout } = usePartner();
  const [store, setStore] = useState(MOCK_STORE_PROFILE);
  const [isAcceptingPoints, setIsAcceptingPoints] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Form edit states
  const [formData, setFormData] = useState({
    storeName: partner?.storeName || store.storeName,
    email: partner?.user?.email || (partner as any)?.email || store.email || "partner@pepperst.com",
    phone: partner?.phone || store.phone || "+94 11 268 4500",
    location: partner?.address || store.location || "42 Ward Place, Colombo 07, Sri Lanka",
    instagram: store.instagram || "@pepperst.official",
    about: partner?.description || store.about || "",
  });

  useEffect(() => {
    if (partner) {
      setFormData((prev) => ({
        ...prev,
        storeName: partner.storeName || prev.storeName,
        email: partner.user?.email || (partner as any)?.email || prev.email,
        phone: partner.phone || prev.phone,
        location: partner.address || prev.location,
        about: partner.description || prev.about,
      }));
    }
  }, [partner]);

  // Listen for open edit modal trigger from top orange card
  useEffect(() => {
    const handleOpenEdit = () => setIsEditModalOpen(true);
    window.addEventListener("open-partner-edit-modal", handleOpenEdit);
    return () => window.removeEventListener("open-partner-edit-modal", handleOpenEdit);
  }, []);

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...store,
      ...formData,
    };
    setStore(updated);
    window.dispatchEvent(new CustomEvent("partner-store-updated", { detail: updated }));
    setIsEditModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto select-none">
      {/* 3 Store Metric Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Total Redemptions */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-slate-900 tracking-tight leading-none">
            {transactionsProcessedCount}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Redemptions
          </span>
        </div>

        {/* Store Rating */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-[18px] font-medium text-slate-900 tracking-tight">
              4.9
            </span>
            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          </div>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Rating
          </span>
        </div>

        {/* Total Points Processed */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-[#FF6433] tracking-tight leading-none">
            {(dailyPointsProcessed ?? 0).toLocaleString()}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Daily Pts
          </span>
        </div>
      </div>

      {/* Section 1: Store & Operations */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1">
          Store & Operations
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
          {/* Active Offers */}
          <Link
            href="/partner/offers"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Active Shop Offers
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  5 live merchant offers & customer discounts
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Redemption History */}
          <Link
            href="/partner/history"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Redemption History
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {store.transactionsProcessedCount} completed customer point deductions
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Point Acceptance Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Point Acceptance
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {isAcceptingPoints ? "Open for customer point redemptions" : "Temporarily paused"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAcceptingPoints(!isAcceptingPoints)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                isAcceptingPoints
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isAcceptingPoints ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{isAcceptingPoints ? "Active" : "Paused"}</span>
            </button>
          </div>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Store Specifications Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsSpecsModalOpen(true)}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Store Specifications
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {store.category} • Colombo 07
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Section 2: Merchant & Account */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1 mt-1">
          Merchant & Account
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
          {/* Daily Settlements */}
          <button
            type="button"
            onClick={() => setActiveModal("Settlements & Payouts")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Daily Settlements
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Direct LKR local bank account connected
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Partner Agreement */}
          <button
            type="button"
            onClick={() => setActiveModal("Merchant Partner Agreement")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Partner Agreement
                </span>
                <span className="text-[11px] font-medium text-emerald-600">
                  Verified • Island Monkey Partner Network
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* POS Terminal & Staff PINs */}
          <button
            type="button"
            onClick={() => setActiveModal("POS Terminal & Staff Access")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <ScanLine className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  POS Terminal & Staff
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Terminal #{store.posTerminalId} • 3 Staff PINs
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Merchant Support */}
          <button
            type="button"
            onClick={() => setActiveModal("Merchant Desk Support")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Merchant Support
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  24/7 dedicated Island Monkey merchant desk
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Sign Out */}
          <button
            type="button"
            onClick={() => setActiveModal("Sign Out Confirmation")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50/50 transition-colors cursor-pointer text-left w-full text-rose-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-rose-600 stroke-[1.8]" />
              <span className="text-[14px] font-medium">Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Edit Store Info Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-medium text-slate-900 tracking-tight">
                Update Store Info
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="flex flex-col gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Store / Brand Name
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Store Location / Address
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Store Bio / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433] resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 h-11 rounded-full bg-slate-100 text-slate-700 text-[14px] font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#FF6433] text-white text-[14px] font-medium hover:bg-[#E84A23] transition-colors shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Store Specifications Modal */}
      {isSpecsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-medium text-slate-900 tracking-tight flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF6433]" />
                Store Specifications
              </h3>
              <button
                type="button"
                onClick={() => setIsSpecsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Category</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block truncate">
                  {store.category}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Business Reg</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block">
                  {store.businessRegNumber}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">POS Terminal</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block">
                  {store.posTerminalId}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Operating Hours</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block">
                  10 AM - 8 PM
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 pt-1">
              <span className="text-[12px] font-medium text-slate-500">Supported Redemption Products</span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                <span className="px-2.5 py-1 bg-orange-50 text-[#FF6433] border border-orange-200/60 rounded-full text-[12px] font-medium">
                  Apparel
                </span>
                <span className="px-2.5 py-1 bg-orange-50 text-[#FF6433] border border-orange-200/60 rounded-full text-[12px] font-medium">
                  Organic Linen
                </span>
                <span className="px-2.5 py-1 bg-orange-50 text-[#FF6433] border border-orange-200/60 rounded-full text-[12px] font-medium">
                  Leather Goods
                </span>
                <span className="px-2.5 py-1 bg-orange-50 text-[#FF6433] border border-orange-200/60 rounded-full text-[12px] font-medium">
                  Studio Vouchers
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSpecsModalOpen(false)}
              className="w-full h-11 rounded-full bg-slate-900 text-white text-[14px] font-medium hover:bg-slate-800 transition-colors cursor-pointer mt-1"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Info Dialog for Settlements, Agreement, Terminal, Support */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-medium text-slate-900 tracking-tight">
                {activeModal}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[14px] font-medium text-slate-600 leading-relaxed py-2">
              {activeModal === "Settlements & Payouts" &&
                "Commercial Bank of Ceylon LKR account ending in *8842 is linked with automated daily T+1 midnight settlement transfers for all customer point redemptions."}
              {activeModal === "Merchant Partner Agreement" &&
                "Pepper St. is an authorized Tier-1 retail partner in the Island Monkey Merchant Network. Contract renewal is active with guaranteed 200 LKR per point settlement."}
              {activeModal === "POS Terminal & Staff Access" &&
                "POS terminal #IM-POS-7741 is active. 3 cashier staff PINs are configured for checkout authorization and customer QR scanning."}
              {activeModal === "Merchant Desk Support" &&
                "Direct line to Island Monkey Merchant Operations: +94 11 268 4501 or partners@islandmonkey.io. 24/7 technical and terminal support."}
              {activeModal === "Sign Out Confirmation" &&
                "Are you sure you want to sign out of the Partner Store Portal on this device?"}
            </p>

            {activeModal === "Sign Out Confirmation" ? (
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[14px] font-medium rounded-full cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    logout();
                  }}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-[14px] font-medium rounded-full cursor-pointer transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full h-11 rounded-full bg-slate-900 text-white text-[14px] font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Save Toast Feedback */}
      {saveToast && (
        <div className="fixed top-6 inset-x-4 z-50 max-w-sm mx-auto bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-[13px] font-medium animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Store profile updated successfully</span>
        </div>
      )}
    </div>
  );
}
