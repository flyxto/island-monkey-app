"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { getCustomerBookings } from "@/lib/api";
import {
  QrCode,
  Sparkles,
  CreditCard,
  Bell,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { uploadDirectToR2 } from "@/lib/upload";
import { ImageCropperModal } from "@/components/ui/image-cropper-modal";

export default function CustomerProfilePage() {
  const { user, balance, logout, refreshCustomer, updateProfile } = useCustomer();
  const [sessionsCount, setSessionsCount] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPerksModalOpen, setIsPerksModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Avatar upload states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCropSrc, setImageToCropSrc] = useState<string>("");
  const [uploadPercent, setUploadPercent] = useState<number>(0);

  // Form edit states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    async function loadSessions() {
      try {
        const bookings = await getCustomerBookings();
        if (Array.isArray(bookings)) {
          setSessionsCount(bookings.length);
        }
      } catch (e) {
        console.error("Failed to load sessions count:", e);
      }
    }
    loadSessions();
  }, []);

  // Listen for open edit modal and avatar upload triggers from top orange card
  useEffect(() => {
    const handleOpenEdit = () => setIsEditModalOpen(true);
    const handleTriggerAvatarUpload = () => {
      fileInputRef.current?.click();
    };

    window.addEventListener("open-customer-edit-modal", handleOpenEdit);
    window.addEventListener("trigger-avatar-upload", handleTriggerAvatarUpload);
    return () => {
      window.removeEventListener("open-customer-edit-modal", handleOpenEdit);
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

    const objectUrl = URL.createObjectURL(file);
    setImageToCropSrc(objectUrl);
    setCropperOpen(true);

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

      const result = await uploadDirectToR2(croppedFile, {
        type: "profile",
        modelId: user?.id,
        category: "customers",
        onProgress: (percent) => setUploadPercent(percent),
      });

      await updateProfile({
        avatarUrl: result.r2Key,
      });

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err: any) {
      console.error("Customer avatar upload failed:", err);
      setAvatarUploadError(err.message || "Failed to update profile photo");
      alert(err.message || "Failed to update profile photo. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
      setUploadPercent(0);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setIsEditModalOpen(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    } catch (err: any) {
      alert(err.message || "Failed to save profile changes.");
    }
  };

  const handleOpenQR = () => {
    window.dispatchEvent(new CustomEvent("open-customer-qr-modal"));
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto select-none">
      {/* 2 Customer Metric Stat Cards (Removed hardcoded VIP rating card) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Sessions Booked */}
        <div className="bg-white rounded-[22px] py-3.5 px-3 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-slate-900 tracking-tight leading-none">
            {sessionsCount}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Sessions
          </span>
        </div>

        {/* Available Points */}
        <div className="bg-white rounded-[22px] py-3.5 px-3 flex flex-col items-center justify-center shadow-xs border border-black/5">
          <span className="text-[18px] font-medium text-[#FF6433] tracking-tight leading-none">
            {balance?.formattedPoints || "0.00"}
          </span>
          <span className="text-[12px] font-medium text-slate-400 mt-1.5">
            Points
          </span>
        </div>
      </div>

      {/* Section 1: Membership & Studio Perks */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-medium text-slate-900 px-1">
          Membership & Studio Perks
        </h2>

        <div className="bg-white rounded-[24px] p-1.5 sm:p-2 shadow-xs border border-black/5 flex flex-col">
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
                  Digital payment & cards
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
            {/* Themed Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                notificationsEnabled ? "bg-[#FF6433]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
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

      {/* Info / Confirmation Drawer */}
      {activeInfoModal && (
        <div
          onClick={() => setActiveInfoModal(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-medium text-slate-900 tracking-tight">
                {activeInfoModal}
              </h3>
              <button
                type="button"
                onClick={() => setActiveInfoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[14px] font-medium text-slate-600 leading-relaxed py-1">
              {activeInfoModal === "Payment Methods"
                ? "To add or modify payment methods or link Apple Pay, please contact studio administration."
                : activeInfoModal === "Member Terms & Conditions"
                ? "Your membership is in good standing under Island Monkey Studio Member Agreement v2.6. Points accrued never expire and can be redeemed across all certified partners."
                : "Are you sure you want to sign out of your Island Monkey Member account on this device?"}
            </p>

            <div className="flex gap-2.5 pt-1">
              {activeInfoModal === "Sign Out Confirmation" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal(null)}
                    className="relative overflow-hidden flex-1 py-3 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-700 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInfoModal(null);
                      logout();
                    }}
                    className="relative overflow-hidden flex-1 py-3 bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 border border-white/30 rounded-full font-medium text-[14px] text-white shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_16px_rgba(225,29,72,0.3)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveInfoModal(null)}
                  className="relative overflow-hidden w-full py-3 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-700 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for Customer Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* 1:1 Round Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={imageToCropSrc}
        aspect={1}
        cropShape="round"
        title="Crop Profile Picture"
        subtitle="Adjust and position your photo for your profile"
        onCancel={() => {
          setCropperOpen(false);
          if (imageToCropSrc) {
            URL.revokeObjectURL(imageToCropSrc);
            setImageToCropSrc("");
          }
        }}
        onCropComplete={handleCroppedUpload}
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
