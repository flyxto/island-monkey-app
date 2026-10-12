"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useModel } from "@/lib/portal/ModelContext";
import { getModelBookings } from "@/lib/api";
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
  Loader2,
} from "lucide-react";

export default function ModelProfilePage() {
  const { user, profileData, balance, updateAvailability, updateProfile, logout } = useModel();
  const [profile, setProfile] = useState(MOCK_MODEL_PROFILE);
  const [isAvailable, setIsAvailable] = useState(user?.status === "Available");
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Form edit states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || profile.firstName,
    lastName: user?.lastName || profile.lastName,
    handle: profileData?.handle || profile.handle || "@model",
    email: user?.email || profile.email || "",
    phone: user?.phone || profile.phone || "",
    bio: profileData?.bio || profile.bio || "",
    location: profileData?.location || profile.location || "Colombo, Sri Lanka",
    instagram: profileData?.instagram || profile.instagram || "",
    whatsapp: profileData?.whatsapp || "",
  });

  // Physical Comp Card Specs state
  const [specsData, setSpecsData] = useState({
    height: profileData?.height || profile.height || "175 cm / 5' 9\"",
    weight: profileData?.weight || "55 kg / 121 lbs",
    bust: profileData?.bust || "84 cm / 33 in",
    waist: profileData?.waist || "60 cm / 23.5 in",
    hips: profileData?.hips || "89 cm / 35 in",
    shoeSize: profileData?.shoeSize || profile.shoeSize || "39 EU / 8.5 US",
    dressSize: profileData?.dressSize || "34 EU / 4 US",
    hairColor: profileData?.hairColor || profile.hairColor || "Natural Black",
    eyeColor: profileData?.eyeColor || profile.eyeColor || "Dark Brown",
    skinComplexion: profileData?.skinComplexion || "Medium",
  });

  useEffect(() => {
    if (user) {
      setIsAvailable(user.status === "Available");
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (profileData) {
      setFormData((prev) => ({
        ...prev,
        handle: profileData.handle || prev.handle,
        bio: profileData.bio || prev.bio,
        location: profileData.location || prev.location,
        instagram: profileData.instagram || prev.instagram,
        whatsapp: profileData.whatsapp || prev.whatsapp,
      }));
      setSpecsData((prev) => ({
        ...prev,
        height: profileData.height || prev.height,
        weight: profileData.weight || prev.weight,
        bust: profileData.bust || prev.bust,
        waist: profileData.waist || prev.waist,
        hips: profileData.hips || prev.hips,
        shoeSize: profileData.shoeSize || prev.shoeSize,
        dressSize: profileData.dressSize || prev.dressSize,
        hairColor: profileData.hairColor || prev.hairColor,
        eyeColor: profileData.eyeColor || prev.eyeColor,
        skinComplexion: profileData.skinComplexion || prev.skinComplexion,
      }));
    }
  }, [profileData]);

  useEffect(() => {
    getModelBookings()
      .then((data) => {
        if (Array.isArray(data)) {
          setBookingsCount(data.length);
        }
      })
      .catch((err) => {
        console.warn("Failed to load bookings count:", err);
      });
  }, []);

  const handleToggleAvailability = async () => {
    if (isUpdatingAvailability) return;
    const nextStatus = isAvailable ? "Unavailable" : "Available";
    setIsAvailable(!isAvailable);
    setIsUpdatingAvailability(true);
    try {
      await updateAvailability(nextStatus);
    } catch (err) {
      console.error("Failed to update availability:", err);
      setIsAvailable(isAvailable);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  // Listen for open edit modal event from top card
  useEffect(() => {
    const handleOpenEdit = () => setIsEditModalOpen(true);
    window.addEventListener("open-model-edit-modal", handleOpenEdit);
    return () => window.removeEventListener("open-model-edit-modal", handleOpenEdit);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        handle: formData.handle,
        bio: formData.bio,
        location: formData.location,
        instagram: formData.instagram,
        whatsapp: formData.whatsapp,
      });
      setIsEditModalOpen(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSpecs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        height: specsData.height,
        weight: specsData.weight,
        bust: specsData.bust,
        waist: specsData.waist,
        hips: specsData.hips,
        shoeSize: specsData.shoeSize,
        dressSize: specsData.dressSize,
        hairColor: specsData.hairColor,
        eyeColor: specsData.eyeColor,
        skinComplexion: specsData.skinComplexion,
      });
      setIsSpecsModalOpen(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err) {
      console.error("Failed to save specs:", err);
      alert("Failed to save specs. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto select-none">
      {/* 3 Model Metric Stat Cards (Mirroring Reference Layout) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Completed Bookings */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-slate-900 tracking-tight leading-none">
            {bookingsCount}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Bookings
          </span>
        </div>

        {/* Client Rating */}
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

        {/* Points / Earnings */}
        <div className="bg-white rounded-[22px] py-3.5 px-2 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-[#FF6433] tracking-tight leading-none">
            {balance?.formattedPoints || (typeof balance?.pointsBalance === "number" ? balance.pointsBalance.toLocaleString() : "0")}
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
                  {bookingsCount} fulfilled sessions & client history
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
              disabled={isUpdatingAvailability}
              onClick={handleToggleAvailability}
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
                <span className="text-[11px] font-medium text-slate-400 truncate max-w-[220px]">
                  {specsData.height || profile.height} • {specsData.bust ? `${specsData.bust} / ${specsData.waist}` : profile.measurements} • {specsData.shoeSize || profile.shoeSize}
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
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-full bg-slate-100 text-slate-700 text-[14px] font-medium hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-full bg-[#FF6433] text-white text-[14px] font-medium hover:bg-[#E84A23] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Saving..." : "Save Changes"}
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

            <form onSubmit={handleSaveSpecs} className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Height</label>
                  <input
                    type="text"
                    value={specsData.height}
                    onChange={(e) => setSpecsData({ ...specsData, height: e.target.value })}
                    placeholder="e.g. 175 cm / 5' 9&quot;"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Weight</label>
                  <input
                    type="text"
                    value={specsData.weight}
                    onChange={(e) => setSpecsData({ ...specsData, weight: e.target.value })}
                    placeholder="e.g. 55 kg / 121 lbs"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Bust</label>
                  <input
                    type="text"
                    value={specsData.bust}
                    onChange={(e) => setSpecsData({ ...specsData, bust: e.target.value })}
                    placeholder="84 cm / 33&quot;"
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Waist</label>
                  <input
                    type="text"
                    value={specsData.waist}
                    onChange={(e) => setSpecsData({ ...specsData, waist: e.target.value })}
                    placeholder="60 cm / 23.5&quot;"
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Hips</label>
                  <input
                    type="text"
                    value={specsData.hips}
                    onChange={(e) => setSpecsData({ ...specsData, hips: e.target.value })}
                    placeholder="89 cm / 35&quot;"
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Shoe Size</label>
                  <input
                    type="text"
                    value={specsData.shoeSize}
                    onChange={(e) => setSpecsData({ ...specsData, shoeSize: e.target.value })}
                    placeholder="e.g. 39 EU / 8.5 US"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Dress Size</label>
                  <input
                    type="text"
                    value={specsData.dressSize}
                    onChange={(e) => setSpecsData({ ...specsData, dressSize: e.target.value })}
                    placeholder="e.g. 34 EU / 4 US"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Hair Color</label>
                  <input
                    type="text"
                    value={specsData.hairColor}
                    onChange={(e) => setSpecsData({ ...specsData, hairColor: e.target.value })}
                    placeholder="e.g. Natural Black"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-slate-500">Eye Color</label>
                  <input
                    type="text"
                    value={specsData.eyeColor}
                    onChange={(e) => setSpecsData({ ...specsData, eyeColor: e.target.value })}
                    placeholder="e.g. Dark Brown"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-slate-500">Skin Complexion</label>
                <input
                  type="text"
                  value={specsData.skinComplexion}
                  onChange={(e) => setSpecsData({ ...specsData, skinComplexion: e.target.value })}
                  placeholder="e.g. Medium / Olive"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF6433]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSpecsModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-full bg-slate-100 text-slate-700 text-[14px] font-medium hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-full bg-[#FF6433] text-white text-[14px] font-medium hover:bg-[#E84A23] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Saving..." : "Save Comp Card"}
                </button>
              </div>
            </form>
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
              {activeModal === "Sign Out Confirmation" &&
                "Are you sure you want to sign out of your Island Monkey Model account on this device?"}
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
          <span>Profile updated successfully</span>
        </div>
      )}
    </div>
  );
}
