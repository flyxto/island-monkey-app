"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyProfile, getMyBalance, getPackages, getConversionRate } from "@/lib/api/customer";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export interface CustomerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  qrCodeValue: string;
  memberId: string;
}

export interface BalanceInfo {
  pointsBalance: number;
  conversionRateLKR: number;
  formattedPoints: string;
  lastUpdated: string;
}

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  priceLkr: number;
  isBestSeller?: boolean;
  durationHours: number;
  studioName: string;
  photographersCount?: number;
  metaLine?: string;
  highlightFeature?: { title: string; subtitle: string };
  whatsIncluded?: string[];
}

interface CustomerContextType {
  user: CustomerUser | null;
  balance: BalanceInfo;
  packages: PackageItem[];
  selectedPackage: PackageItem | null;
  setSelectedPackage: (pkg: PackageItem) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  handleLogout: () => void;
}

const defaultBalance: BalanceInfo = {
  pointsBalance: 0,
  conversionRateLKR: 200,
  formattedPoints: "0.00",
  lastUpdated: "Now",
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [balance, setBalance] = useState<BalanceInfo>(defaultBalance);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profile, balanceData, pkgs, rateData] = await Promise.all([
        getMyProfile(),
        getMyBalance(),
        getPackages(),
        getConversionRate(),
      ]);

      setUser({
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        qrCodeValue: profile.qrCodeValue,
        memberId: profile.memberId,
      });

      const pts = Number(balanceData.pointsBalance ?? 0);
      setBalance({
        pointsBalance: pts,
        conversionRateLKR: rateData?.lkr ?? 200,
        formattedPoints: pts.toLocaleString("en-US", { minimumFractionDigits: 2 }),
        lastUpdated: "Now",
      });

      setPackages(pkgs || []);
      const bestSeller = (pkgs || []).find((p: PackageItem) => p.isBestSeller);
      setSelectedPackage(bestSeller || (pkgs || [])[0] || null);
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
    <CustomerContext.Provider
      value={{
        user,
        balance,
        packages,
        selectedPackage,
        setSelectedPackage,
        isQRModalOpen,
        setIsQRModalOpen,
        loading,
        error,
        refresh: fetchData,
        handleLogout,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) throw new Error("useCustomer must be used within a CustomerProvider");
  return context;
}
