"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_MODEL_PROFILE } from "@/lib/mock-data/model-portal";
import {
  Camera,
  Calendar,
  Clock,
  Sliders,
  CreditCard,
  ShieldCheck,
  Bell,
  MessageSquare,
  LogOut,
  Star,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

export default function ModelProfilePage() {
  const [profile, setProfile] = useState(MOCK_MODEL_PROFILE);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Form edit states
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    handle: profile.handle || "@shalini_perera",
    email: profile.email || "shalini.perera@islandmonkey.io",
    phone: profile.phone || "+94 77 234 5678",
    bio: profile.bio || "",
    location: profile.location || "Colombo, Sri Lanka",
    instagram: profile.instagram || "@shalini.modele",
  });

  // Listen for open edit modal event from top orange card
  React.useEffect(() => {
    const handleOpenEdit = () => setIsEditModalOpen(true);
    window.addEventListener("open-model-edit-modal", handleOpenEdit);
    return () => window.removeEventListener("open-model-edit-modal", handleOpenEdit);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      ...formData,
    };
    setProfile(updated);
    window.dispatchEvent(new CustomEvent("model-profile-updated", { detail: updated }));
    setIsEditModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto select-none">
      {/* 3 Model Metric Stat Cards (Mirroring Reference Layout) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Completed Bookings */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-slate-900 tracking-tight leading-none">
            {profile.completedBookingsCount}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Bookings
          </span>
        </div>

        {/* Client Rating */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-[18px] font-medium text-slate-900 tracking-tight">
              {profile.rating}
            </span>
            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          </div>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Rating
          </span>
        </div>

        {/* Points / Earnings */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-[#FF6433] tracking-tight leading-none">
            75.5k
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Points
          </span>
        </div>
      </div>

      {/* Section 1: Work & Portfolio */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1">
          Work & Portfolio
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
          {/* My Gigs & Packages */}
          <Link
            href="/model/gigs"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  My Gigs & Packages
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Active shoot packages & hourly rates
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Booking History */}
          <Link
            href="/model/bookings"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Booking History
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {profile.completedBookingsCount} fulfilled sessions & client history
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </Link>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Availability Status Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Booking Availability
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {isAvailable ? "Open for casting requests" : "Temporarily paused"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{isAvailable ? "Available" : "Paused"}</span>
            </button>
          </div>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Physical Specifications / Comp Card */}
          <button
            type="button"
            onClick={() => setIsSpecsModalOpen(true)}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Physical Specifications
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {profile.height} • {profile.measurements} • {profile.shoeSize}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Section 2: Agency & Account */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1 mt-1">
          Agency & Account
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
          {/* Payout & Bank Account */}
          <button
            type="button"
            onClick={() => setActiveModal("Payout & Bank Account")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Payouts & Bank Account
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Direct LKR local transfer linked
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Agency Verification */}
          <button
            type="button"
            onClick={() => setActiveModal("Agency Verification")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Talent Agency Agreement
                </span>
                <span className="text-[11px] font-medium text-emerald-600">
                  Verified • Island Monkey Agency
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Notifications & Alerts */}
          <button
            type="button"
            onClick={() => setActiveModal("Notifications & Alerts")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Notifications & Alerts
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Direct SMS & push notifications
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Talent Support */}
          <button
            type="button"
            onClick={() => setActiveModal("Talent Concierge Support")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-slate-700 stroke-[1.8]" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-800">
                  Talent Support
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  24/7 dedicated Island Monkey assistance
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="h-px bg-slate-100 mx-3" />

          {/* Sign Out */}
          <button
            type="button"
            onClick={() => alert("Signed out of Model Portal.")}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50/50 transition-colors cursor-pointer text-left w-full text-rose-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-rose-600 stroke-[1.8]" />
              <span className="text-[14px] font-medium">Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Edit Personal Info Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-medium text-slate-900 tracking-tight">
                Update Personal Info
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Email Address
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">
                  Bio / Experience
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
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

      {/* Comp Card / Physical Specifications Modal */}
      {isSpecsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-medium text-slate-900 tracking-tight flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF6433]" />
                Physical Specifications (Comp Card)
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
                <span className="text-slate-400 font-medium block">Height</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block">
                  {profile.height}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Bust / Waist / Hips</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block">
                  {profile.measurements}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Shoe Size</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block">
                  {profile.shoeSize}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Eyes / Hair</span>
                <span className="text-slate-800 font-medium text-[14px] mt-0.5 block">
                  {profile.eyeColor} • {profile.hairColor}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[12px] font-medium text-slate-500">Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.categories?.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 bg-orange-50 text-[#FF6433] border border-orange-200/60 rounded-full text-[12px] font-medium"
                  >
                    {cat}
                  </span>
                ))}
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

      {/* Info Dialog for Agency, Payout, Notifications, Support */}
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
              {activeModal === "Payout & Bank Account" &&
                "Direct LKR bank account is connected with commercial escrow payouts released within 24 hours of gig completion."}
              {activeModal === "Agency Verification" &&
                "Your Island Monkey Talent Agency agreement is active. Verified talent status guarantees priority casting recommendations across international campaigns."}
              {activeModal === "Notifications & Alerts" &&
                "SMS and in-app notifications are active for new shoot booking requests, direct client messages, and payment releases."}
              {activeModal === "Talent Concierge Support" &&
                "Contact your dedicated Island Monkey model coordinator at +94 11 789 0000 or email models@islandmonkey.io for 24/7 on-set support."}
            </p>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-full bg-slate-900 text-white text-[14px] font-medium hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Save Toast Feedback */}
      {saveToast && (
        <div className="fixed top-6 inset-x-4 z-50 max-w-sm mx-auto bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-[13px] font-medium animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully</span>
        </div>
      )}
    </div>
  );
}
