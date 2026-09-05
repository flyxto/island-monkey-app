"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyPartnerProfile, getMyTransactions } from "@/lib/api/partner";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export interface PartnerProfile {
  id: string;
  storeName: string;
  email: string;
  isActive: boolean;
}

export interface PartnerTransaction {
  id: string;
  description: string;
  createdAt: string;
  amount: number;
  user?: { firstName: string; lastName: string; memberId: string };
}

interface PartnerContextType {
  profile: PartnerProfile | null;
  transactions: PartnerTransaction[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  handleLogout: () => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [transactions, setTransactions] = useState<PartnerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prof, txns] = await Promise.all([
        getMyPartnerProfile(),
        getMyTransactions(),
      ]);
      setProfile(prof);
      setTransactions(Array.isArray(txns) ? txns : []);
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
    <PartnerContext.Provider value={{ profile, transactions, loading, error, refresh: fetchData, handleLogout }}>
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (!context) throw new Error("usePartner must be used within a PartnerProvider");
  return context;
}
