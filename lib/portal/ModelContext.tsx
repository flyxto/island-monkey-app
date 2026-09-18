"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getModelProfile } from "@/lib/api";

export interface ModelUser {
  id: string;
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
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<ModelUser | null>(null);
  const [balance, setBalance] = useState<ModelBalanceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Route Guard
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoadingUser(true);
        const data = await getModelProfile();
        setUser({
          id: data.userId || data.id,
          firstName: data.user?.firstName || data.firstName || "Model",
          lastName: data.user?.lastName || data.lastName || "",
          email: data.user?.email || data.email || "",
          phone: data.user?.phone || data.phone || "",
          status: data.availability || data.status || "Available",
        });
        
        // Backend currently returns a flat number for model balance, 
        // whereas customer balance returns an object. We parse safely.
        const points = typeof data.balance === 'number' ? data.balance : (data.balance?.pointsBalance || 0);
        const conversionRate = typeof data.balance === 'number' ? 200 : (data.balance?.conversionRateLKR || 200);

        setBalance({
          pointsBalance: points,
          formattedPoints: points.toLocaleString('en-US', { minimumFractionDigits: 2 }),
          conversionRateLKR: conversionRate,
          lastUpdated: 'Now',
        });
      } catch (err: any) {
        console.error("Failed to fetch model profile:", err);
        setError(err.message || "Failed to load profile.");
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, [router]);

  return (
    <ModelContext.Provider
      value={{
        user,
        balance,
        isLoadingUser,
        error,
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
