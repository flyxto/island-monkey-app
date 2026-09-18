"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getModelProfile, updateModelAvailability, logoutApi } from "@/lib/api";

export interface ModelUser {
  id: string;
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

export interface ModelBalanceInfo {
  pointsBalance: number;
  formattedPoints: string;
  conversionRateLKR: number;
  lastUpdated: string;
}

export interface ModelContextType {
  user: ModelUser | null;
  balance: ModelBalanceInfo | null;
  isLoadingUser: boolean;
  error: string | null;
  refreshModel: () => Promise<void>;
  updateAvailability: (availability: "Available" | "Unavailable") => Promise<void>;
  logout: () => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<ModelUser | null>(null);
  const [balance, setBalance] = useState<ModelBalanceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = React.useCallback(async () => {
    try {
      setIsLoadingUser(true);
      setError(null);
      const data = await getModelProfile();
      setUser({
        id: data.userId || data.id,
        profileId: data.id,
        firstName: data.user?.firstName || data.firstName || "Model",
        lastName: data.user?.lastName || data.lastName || "",
        email: data.user?.email || data.email || "",
        phone: data.user?.phone || data.phone || "",
        status: data.availability || data.status || "Available",
      });
      
      const points = typeof data.balance === "number" ? data.balance : (data.balance?.pointsBalance || 0);
      const conversionRate = typeof data.balance === "number" ? 200 : (data.balance?.conversionRateLKR || 200);

      setBalance({
        pointsBalance: points,
        formattedPoints: points.toLocaleString("en-US", { minimumFractionDigits: 2 }),
        conversionRateLKR: conversionRate,
        lastUpdated: "Now",
      });
    } catch (err: any) {
      console.error("Failed to fetch model profile:", err);
      setError(err.message || "Failed to load profile.");
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // Route Guard
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchUser();
  }, [router, fetchUser]);

  const handleUpdateAvailability = async (availability: "Available" | "Unavailable") => {
    if (!user) return;
    try {
      await updateModelAvailability(user.profileId, availability);
      setUser((prev) => (prev ? { ...prev, status: availability } : null));
    } catch (err) {
      console.error("Failed to update availability:", err);
      throw err;
    }
  };

  const logout = React.useCallback(() => {
    logoutApi();
    setUser(null);
    setBalance(null);
    router.replace("/login");
  }, [router]);

  return (
    <ModelContext.Provider
      value={{
        user,
        balance,
        isLoadingUser,
        error,
        refreshModel: fetchUser,
        updateAvailability: handleUpdateAvailability,
        logout,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
