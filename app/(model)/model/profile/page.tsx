"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_MODEL_PROFILE } from "@/lib/mock-data/model-portal";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Star,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Shield,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  Camera,
  CalendarCheck,
  ChevronRight,
  Sliders,
} from "lucide-react";

export default function ModelProfilePage() {
  const profile = MOCK_MODEL_PROFILE;
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Profile Header Card */}
      <Card className="bg-white border border-im-border/40 rounded-2xl shadow-xs overflow-hidden">
        <div className="h-20 bg-linear-to-r from-[#FF6644] to-[#C85A17] relative" />
        <CardContent className="p-5 pt-0 relative flex flex-col items-center text-center">
          {/* Avatar with status indicator */}
          <div className="relative -mt-12 mb-3">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-medium text-2xl border border-slate-200 overflow-hidden">
                <span className="text-im-accent font-medium tracking-wider">
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="absolute bottom-1 right-1 p-1.5 bg-black text-white rounded-full shadow hover:bg-slate-800 transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Name & Handle */}
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-medium text-black tracking-tight">
              {profile.firstName} {profile.lastName}
            </h1>
            <CheckCircle2 className="w-4.5 h-4.5 text-[#C85A17] shrink-0" />
          </div>

          <p className="text-xs text-im-muted font-medium mt-0.5">
            {profile.handle} • ID: #TM-7824
          </p>

          {/* Specialization Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            {profile.categories?.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 bg-im-accent-light text-im-accent text-[11px] font-medium rounded-full border border-im-accent/15"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-[13px] text-im-body mt-3 leading-relaxed max-w-sm">
              {profile.bio}
            </p>
          )}

          {/* Availability Toggle */}
          <div className="w-full mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span className="text-xs font-medium text-slate-700">
                {isAvailable ? "Available for Bookings" : "Currently Unavailable"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`text-[11px] font-medium px-3 py-1 rounded-full transition-colors ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {isAvailable ? "Pause" : "Activate"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Rating */}
        <div className="bg-white border border-im-border/30 rounded-xl p-3.5 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-medium text-slate-700">Rating</span>
          </div>
          <span className="text-xl font-medium text-black tracking-tight">
            {profile.rating}
            <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
          </span>
          <span className="text-[11px] text-slate-500">124 verified reviews</span>
        </div>

        {/* Completed Bookings */}
        <div className="bg-white border border-im-border/30 rounded-xl p-3.5 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-im-accent">
            <CalendarCheck className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-700">Completed</span>
          </div>
          <span className="text-xl font-medium text-black tracking-tight">
            {profile.completedBookingsCount}
          </span>
          <span className="text-[11px] text-slate-500">Gigs fulfilled</span>
        </div>

        {/* Balance */}
        <div className="bg-white border border-im-border/30 rounded-xl p-3.5 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Sparkles className="w-4 h-4 text-im-accent" />
            <span className="text-xs font-medium text-slate-700">Points</span>
          </div>
          <span className="text-xl font-medium text-black tracking-tight">
            {profile.formattedPoints}
          </span>
          <span className="text-[11px] text-slate-500">Available to redeem</span>
        </div>

        {/* Agency */}
        <div className="bg-white border border-im-border/30 rounded-xl p-3.5 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Shield className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-700">Agency</span>
          </div>
          <span className="text-sm font-medium text-black tracking-tight line-clamp-1">
            Island Monkey
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">Verified Talent</span>
        </div>
      </div>

      {/* Model Specifications Card */}
      <Card className="bg-white border border-im-border/30 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-black flex items-center gap-2">
            <Sliders className="w-4 h-4 text-im-accent" />
            Physical Specifications
          </h2>
          <span className="text-[11px] text-im-accent font-medium hover:underline cursor-pointer">
            Edit Specs
          </span>
        </div>
        <CardContent className="p-4 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Height</span>
            <span className="text-slate-800 font-medium">{profile.height}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Measurements</span>
            <span className="text-slate-800 font-medium">{profile.measurements}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Shoe Size</span>
            <span className="text-slate-800 font-medium">{profile.shoeSize}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Eyes / Hair</span>
            <span className="text-slate-800 font-medium">
              {profile.eyeColor} • {profile.hairColor}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card className="bg-white border border-im-border/30 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-medium text-black flex items-center gap-2">
            <User className="w-4 h-4 text-im-accent" />
            Contact & Location
          </h2>
        </div>
        <CardContent className="p-4 flex flex-col gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-im-accent font-medium">{profile.instagram}</span>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Payout & Bank Account Details</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Account & Privacy Preferences</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => alert("Signed out.")}
          className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-50 text-red-600 border border-red-200/70 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors mt-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
