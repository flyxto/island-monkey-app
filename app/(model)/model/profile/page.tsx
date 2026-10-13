"use client";

import React, { useState, useEffect } from "react";
import { useModel } from "@/lib/portal/ModelContext";
import { getModelBookings } from "@/lib/api";
import { MOCK_MODEL_PROFILE } from "@/lib/mock-data/model-portal";
import {
  Camera,
  Clock,
  Sliders,
  CreditCard,
  ShieldCheck,
  Bell,
  MessageSquare,
  LogOut,
  ChevronRight,
  X,
  Check,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { uploadDirectToR2 } from "@/lib/upload";
import { getR2PublicUrl } from "@/lib/r2";
import { ImageCropperModal } from "@/components/ui/image-cropper-modal";

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Image Cropper states
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCropSrc, setImageToCropSrc] = useState<string>("");
  const [uploadPercent, setUploadPercent] = useState<number>(0);

  // Form edit states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || profile.firstName || "",
    lastName: user?.lastName || profile.lastName || "",
    handle: profileData?.handle || (user?.firstName ? `@${user.firstName.toLowerCase()}${user?.lastName ? `_${user.lastName.toLowerCase()}` : ""}` : ""),
    email: user?.email || profile.email || "",
    phone: user?.phone || profile.phone || "",
    bio: profileData?.bio || profile.bio || "",
    location: profileData?.location || profile.location || "",
    instagram: profileData?.instagram || profile.instagram || "",
    whatsapp: profileData?.whatsapp || "",
  });

  // Physical Comp Card Specs state (strictly dynamic without fake fallbacks)
  const [specsData, setSpecsData] = useState({
    height: profileData?.height || "",
    weight: profileData?.weight || "",
    bust: profileData?.bust || "",
    waist: profileData?.waist || "",
    hips: profileData?.hips || "",
    shoeSize: profileData?.shoeSize || "",
    dressSize: profileData?.dressSize || "",
    hairColor: profileData?.hairColor || "",
    eyeColor: profileData?.eyeColor || "",
    skinComplexion: profileData?.skinComplexion || "",
  });

  useEffect(() => {
    if (user) {
      setIsAvailable(user.status === "Available");
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        handle: prev.handle || (user.firstName ? `@${user.firstName.toLowerCase()}${user.lastName ? `_${user.lastName.toLowerCase()}` : ""}` : ""),
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
        height: profileData.height ?? prev.height,
        weight: profileData.weight ?? prev.weight,
        bust: profileData.bust ?? prev.bust,
        waist: profileData.waist ?? prev.waist,
        hips: profileData.hips ?? prev.hips,
        shoeSize: profileData.shoeSize ?? prev.shoeSize,
        dressSize: profileData.dressSize ?? prev.dressSize,
        hairColor: profileData.hairColor ?? prev.hairColor,
        eyeColor: profileData.eyeColor ?? prev.eyeColor,
        skinComplexion: profileData.skinComplexion ?? prev.skinComplexion,
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

  // Listen for open edit modal and avatar upload event from top card
  useEffect(() => {
    const handleOpenEdit = () => setIsEditModalOpen(true);
    const handleTriggerAvatarUpload = () => {
      fileInputRef.current?.click();
    };

    window.addEventListener("open-model-edit-modal", handleOpenEdit);
    window.addEventListener("trigger-avatar-upload", handleTriggerAvatarUpload);
    return () => {
      window.removeEventListener("open-model-edit-modal", handleOpenEdit);
      window.removeEventListener("trigger-avatar-upload", handleTriggerAvatarUpload);
    };
  }, []);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("Image file size must be less than 15MB.");
      return;
    }

    // Create object URL and open 1:1 image cropper
    const objectUrl = URL.createObjectURL(file);
    setImageToCropSrc(objectUrl);
    setCropperOpen(true);

    // Reset input value so user can pick the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCroppedUpload = async (_blob: Blob, croppedFile: File) => {
    setCropperOpen(false);
    if (imageToCropSrc) {
      URL.revokeObjectURL(imageToCropSrc);
      setImageToCropSrc("");
    }

    try {
      setIsUploadingAvatar(true);
      setUploadPercent(0);
      setAvatarUploadError(null);

      // Upload directly to Cloudflare R2 with progress
      const result = await uploadDirectToR2(croppedFile, {
        type: "profile",
        modelId: user?.profileId || user?.id,
        category: "models",
        onProgress: (percent) => setUploadPercent(percent),
      });

      // Save R2 key in the database via PATCH /api/models/me
      await updateProfile({
        avatarUrl: result.r2Key,
      });

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      setAvatarUploadError(err.message || "Failed to update profile photo");
      alert(err.message || "Failed to update profile photo. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
      setUploadPercent(0);
    }
  };

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

  // Helper to compute specs preview label
  const specsSummaryParts = [
    specsData.height,
    specsData.bust && specsData.waist ? `${specsData.bust} / ${specsData.waist}` : (specsData.bust || specsData.waist),
    specsData.shoeSize,
  ].filter(Boolean);
  const specsSummary = specsSummaryParts.length > 0 ? specsSummaryParts.join(" • ") : "Tap to add your measurements";

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto select-none">
      {/* 2 Model Metric Stat Cards (Rating Removed) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Completed Bookings */}
        <div className="bg-white rounded-[22px] py-3.5 px-3 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-slate-900 tracking-tight leading-none">
            {bookingsCount}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Bookings
          </span>
        </div>

        {/* Points / Earnings */}
        <div className="bg-white rounded-[22px] py-3.5 px-3 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-[#FF6433] tracking-tight leading-none">
            {balance?.formattedPoints || (typeof balance?.pointsBalance === "number" ? balance.pointsBalance.toLocaleString() : "0")}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Points
          </span>
        </div>
      </div>

      {/* Section 1: Availability & Specifications */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1">
          Talent Status & Comp Card
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
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
            {/* Themed Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              disabled={isUpdatingAvailability}
              onClick={handleToggleAvailability}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                isAvailable ? "bg-[#FF6433]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
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
                  {specsSummary}
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
              {/* Profile Photo Quick Change */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="relative w-14 h-14 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                  {profileData?.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getR2PublicUrl(profileData.avatarUrl)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[18px] font-medium text-slate-500">
                      {formData.firstName?.[0] || "M"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-[13px] font-medium text-slate-800">
                    Profile Photo
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-[12px] font-medium text-[#FF6433] w-fit shadow-2xs transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isUploadingAvatar ? "Uploading..." : "Change Photo"}</span>
                  </button>
                </div>
              </div>

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
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />
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

            <p className="text-[14px] font-medium text-slate-600 leading-relaxed py-1">
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
                  className="relative overflow-hidden flex-1 py-3 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-700 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    logout();
                  }}
                  className="relative overflow-hidden flex-1 py-3 bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 border border-white/30 rounded-full font-medium text-[14px] text-white shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_16px_rgba(225,29,72,0.3)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="relative overflow-hidden w-full py-3 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-700 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1:1 Profile Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={imageToCropSrc}
        aspect={1}
        cropShape="round"
        title="Crop Profile Photo"
        onCancel={() => {
          setCropperOpen(false);
          if (imageToCropSrc) {
            URL.revokeObjectURL(imageToCropSrc);
            setImageToCropSrc("");
          }
        }}
        onCropComplete={handleCroppedUpload}
      />

      {/* Hidden File Input for Profile Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* Avatar Uploading Progress Overlay */}
      {isUploadingAvatar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3.5 max-w-xs w-full text-center border border-black/5 animate-in zoom-in-95 duration-200">
            <div className="relative w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6433]">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[15px] font-medium text-slate-900 tracking-tight">
                Saving Your Photo
              </h4>
              <p className="text-[12px] font-medium text-slate-500">
                {uploadPercent > 0 && uploadPercent < 100
                  ? `Uploading photo (${uploadPercent}%)...`
                  : uploadPercent === 100
                  ? "Almost done! Updating profile..."
                  : "Optimizing and updating your profile picture..."}
              </p>
              {uploadPercent > 0 && uploadPercent < 100 && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#FF6433] h-full transition-all duration-200 rounded-full"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
              )}
            </div>
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
