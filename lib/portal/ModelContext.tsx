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
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          status: data.status,
        });
        setBalance({
          pointsBalance: data.balance.pointsBalance,
          formattedPoints: data.balance.formattedPoints,
          conversionRateLKR: data.balance.conversionRateLKR,
          lastUpdated: data.balance.lastUpdated,
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
