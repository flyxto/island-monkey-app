"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPartnerProfile, logoutApi } from "@/lib/api";

export interface PartnerUser {
  id: string;
  storeName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  description?: string;
  createdAt: string;
  dailyPointsProcessed: number;
  transactionsProcessedCount: number;
}

export interface PartnerContextType {
  partner: PartnerUser | null;
  dailyPointsProcessed: number;
  transactionsProcessedCount: number;
  isLoading: boolean;
  error: string | null;
  refreshPartner: () => Promise<void>;
  logout: () => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartner = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPartnerProfile();
      setPartner({
        id: data.id,
        storeName: data.storeName || "Partner Store",
        email: data.email || "",
        phone: data.phone || "",
        avatarUrl: data.avatarUrl || "",
        createdAt: data.createdAt,
        dailyPointsProcessed: Number(data.dailyPointsProcessed || 0),
        transactionsProcessedCount: Number(data.transactionsProcessedCount || 0),
      });
    } catch (err: any) {
      console.error("Failed to fetch partner profile:", err);
      setError(err.message || "Failed to load partner store.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchPartner();
  }, [router, fetchPartner]);

  const logout = useCallback(() => {
    logoutApi();
    setPartner(null);
    router.replace("/login");
  }, [router]);

  return (
    <PartnerContext.Provider
      value={{
        partner,
        dailyPointsProcessed: partner?.dailyPointsProcessed ?? 0,
        transactionsProcessedCount: partner?.transactionsProcessedCount ?? 0,
        isLoading,
        error,
        refreshPartner: fetchPartner,
        logout,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartner must be used within a PartnerProvider");
  }
  return context;
}
