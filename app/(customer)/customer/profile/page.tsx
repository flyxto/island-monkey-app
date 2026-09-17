"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_CUSTOMER_USER, MOCK_CUSTOMER_BALANCE } from "@/lib/mock-data/customer-portal";
import {
  Package,
  Calendar,
  QrCode,
  Sparkles,
  CreditCard,
  Bell,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Star,
  Check,
  X,
} from "lucide-react";

export default function CustomerProfilePage() {
  const [userData, setUserData] = useState(MOCK_CUSTOMER_USER);
  const [phone, setPhone] = useState("+94 77 123 4567");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPerksModalOpen, setIsPerksModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Form edit states
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: "+94 77 123 4567",
  });

  // Listen for open edit modal trigger from top orange card
  useEffect(() => {
    const handleOpenEdit = () => setIsEditModalOpen(true);
    window.addEventListener("open-customer-edit-modal", handleOpenEdit);
    return () => window.removeEventListener("open-customer-edit-modal", handleOpenEdit);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };
    setUserData((prev) => ({ ...prev, ...updated }));
    setPhone(formData.phone);
    window.dispatchEvent(new CustomEvent("customer-profile-updated", { detail: updated }));
    setIsEditModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleOpenQR = () => {
    window.dispatchEvent(new CustomEvent("open-customer-qr-modal"));
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto select-none">
      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Available Points */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-[#FF6433] tracking-tight leading-none">
            124.5k
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Points
          </span>
        </div>

        {/* Sessions Booked */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-slate-900 tracking-tight leading-none">
            8
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Sessions
          </span>
        </div>

        {/* Member Tier */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-[18px] font-medium text-slate-900 tracking-tight">
              VIP
            </span>
            <Star className="w-3.5 h-3.5 fill-[#FF6433] text-[#FF6433]" />
          </div>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Platinum
          </span>
        </div>
      </div>

      {/* Section 1: Membership & Studio Benefits */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1">
          Membership & Studio Benefits
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
          {/* Packages */}
          <Link
            href="/customer/packages"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Studio Packages
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Portrait, commercial, and event photography
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Booked Sessions */}
          <Link
            href="/customer/sessions"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  My Booked Sessions
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  2 upcoming studio shoots scheduled
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Digital Member Pass / QR */}
          <button
            type="button"
            onClick={handleOpenQR}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Digital Member Pass
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Scan QR code for check-in & points redemption
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* VIP Studio Perks Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsPerksModalOpen(true)}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#FF6433] stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  VIP Studio Perks
                </span>
                <span className="text-[11px] font-medium text-[#FF6433]">
                  15% off sessions • Priority slots • Free retouching
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Section 2: Account & Preferences */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1 mt-1">
          Account & Preferences
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
          {/* Payment Methods */}
          <button
            type="button"
            onClick={() => setActiveInfoModal("Payment Methods")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Payment Methods
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Visa ending in •••• 4242 connected
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Studio Notifications Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Studio Notifications
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {notificationsEnabled ? "Shoot reminders & booking updates enabled" : "Notifications muted"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                notificationsEnabled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  notificationsEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{notificationsEnabled ? "Active" : "Muted"}</span>
            </button>
          </div>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Member Agreement */}
          <button
            type="button"
            onClick={() => setActiveInfoModal("Member Terms & Conditions")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Member Agreement
                </span>
                <span className="text-[11px] font-medium text-emerald-600">
                  Verified • Island Monkey VIP Club
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Sign Out */}
          <button
            type="button"
            onClick={() => setActiveInfoModal("Sign Out Confirmation")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 transition-colors cursor-pointer text-left w-full text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[14px] font-medium">Sign Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-black/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-medium text-slate-900">
                Edit Member Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-400 px-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-[14px] font-medium text-slate-800 focus:outline-none focus:border-[#FF6433]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-400 px-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-[14px] font-medium text-slate-800 focus:outline-none focus:border-[#FF6433]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-400 px-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-[14px] font-medium text-slate-800 focus:outline-none focus:border-[#FF6433]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-400 px-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-[14px] font-medium text-slate-800 focus:outline-none focus:border-[#FF6433]"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[14px] font-medium rounded-full cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-linear-to-b from-[#FF6433] to-[#E05020] hover:from-[#FF7547] hover:to-[#E55524] text-white text-[14px] font-medium rounded-full cursor-pointer shadow-md shadow-[#FF6433]/25 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIP Perks Modal */}
      {isPerksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-black/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF6433]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-[17px] font-medium text-slate-900">
                  VIP Studio Perks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPerksModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 py-1">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-slate-800">15% Off All Studio Sessions</span>
                  <span className="text-[11px] font-medium text-slate-400">Applies automatically at checkout on all packages.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-slate-800">Priority Booking Window</span>
                  <span className="text-[11px] font-medium text-slate-400">Book prime weekend studio slots 14 days in advance.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-slate-800">Free High-Res Retouching Credit</span>
                  <span className="text-[11px] font-medium text-slate-400">5 complimentary retouched deliverables per month.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-slate-800">Partner Merchant Discounts</span>
                  <span className="text-[11px] font-medium text-slate-400">Redeem points for coffee, retail, and wardrobe rental.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPerksModalOpen(false)}
              className="w-full py-3 bg-[#FF6433] hover:bg-[#E05020] text-white text-[14px] font-medium rounded-full cursor-pointer transition-all shadow-md shadow-[#FF6433]/25"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Info / Confirmation Modals */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-black/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-medium text-slate-900">
                {activeInfoModal}
              </h3>
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
              {activeInfoModal === "Payment Methods"
                ? "Primary card: Visa ending in •••• 4242. To add or modify payment methods or link Apple Pay, please contact studio administration."
                : activeInfoModal === "Member Terms & Conditions"
                ? "Your membership is in good standing under Island Monkey Studio Member Agreement v2.6. Points accrued never expire and can be redeemed across all certified partners."
                : "Are you sure you want to sign out of your Island Monkey Member account on this device?"}
            </p>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[14px] font-medium rounded-full cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-[13px] font-medium shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully</span>
        </div>
      )}
    </div>
  );
}
