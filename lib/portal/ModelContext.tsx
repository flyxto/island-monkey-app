"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyModelProfile, getMyModelBookings, getConversionRate } from "@/lib/api/model";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export interface ModelProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  availability: string;
  bio?: string;
}

export interface ModelBooking {
  id: string;
  status: string;
  notes?: string;
  paymentLkr?: number;
  createdAt: string;
  gig?: { title: string; hourlyRateLkr: number; venueName: string; durationHours: string };
  client?: { firstName: string; lastName: string };
}

interface ModelContextType {
  profile: ModelProfile | null;
  bookings: ModelBooking[];
  pointsBalance: number;
  conversionRate: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  handleLogout: () => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<ModelProfile | null>(null);
  const [bookings, setBookings] = useState<ModelBooking[]>([]);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [conversionRate, setConversionRate] = useState(200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prof, bkgs, rate] = await Promise.all([
        getMyModelProfile(),
        getMyModelBookings(),
        getConversionRate(),
      ]);
      setProfile(prof);
      setBookings(Array.isArray(bkgs) ? bkgs : []);
      setPointsBalance(Number(prof?.pointsBalance ?? 0));
      setConversionRate(rate?.lkr ?? 200);
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        router.push("/login");
        return;
      }
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <ModelContext.Provider value={{ profile, bookings, pointsBalance, conversionRate, loading, error, refresh: fetchData, handleLogout }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) throw new Error("useModel must be used within a ModelProvider");
  return context;
}
