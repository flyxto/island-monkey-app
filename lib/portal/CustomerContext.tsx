"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PackageItem,
  CustomerUser,
  BalanceInfo,
} from "@/lib/mock-data/customer-portal";
import { getPackages, getCustomerProfile, logoutApi } from "@/lib/api";

export interface CustomerContextType {
  user: CustomerUser | null;
  balance: BalanceInfo | null;
  isLoadingUser: boolean;
  packages: PackageItem[];
  isLoadingPackages: boolean;
  selectedPackage: PackageItem | null;
  setSelectedPackage: (pkg: PackageItem) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
  refreshCustomer: () => Promise<void>;
  logout: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  
  // Default selected package is null until fetched
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  const fetchUser = React.useCallback(async () => {
    try {
      setIsLoadingUser(true);
      const data = await getCustomerProfile();
      setUser({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        qrCodeValue: data.qrCodeValue,
        memberId: data.memberId,
        role: data.role,
      });
      setBalance({
        pointsBalance: data.balance.pointsBalance,
        formattedPoints: data.balance.formattedPoints,
        conversionRateLKR: data.balance.conversionRateLKR,
        lastUpdated: data.balance.lastUpdated,
      });
    } catch (error) {
      console.error("Failed to fetch customer profile:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchUser();
  }, [router, fetchUser]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoadingPackages(true);
        const data = await getPackages();
        // Map API response to PackageItem interface
        const mappedPackages = data.map((apiPkg: any) => ({
          id: apiPkg.id,
          name: apiPkg.name,
          description: apiPkg.description,
          priceLKR: Number(apiPkg.priceLkr),
          isBestSeller: apiPkg.isBestSeller,
          durationHours: apiPkg.durationHours,
          studioName: apiPkg.studioName,
          photographersCount: apiPkg.photographersCount,
          metaLine: apiPkg.metaLine,
          highlightFeature: {
            title: apiPkg.highlightTitle,
            subtitle: apiPkg.highlightSubtitle,
          },
          whatsIncluded: apiPkg.whatsIncluded || [],
          imageUrl: apiPkg.imageUrl
        }));
        
        setPackages(mappedPackages);
        
        if (mappedPackages.length > 0) {
          setSelectedPackage(
            mappedPackages.find((p: PackageItem) => p.isBestSeller) || mappedPackages[0]
          );
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        setPackages([]);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    
    fetchPackages();
  }, []);

  const logout = React.useCallback(() => {
    logoutApi();
    setUser(null);
    setBalance(null);
    router.replace("/login");
  }, [router]);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <CustomerContext.Provider
      value={{
        user,
        balance,
        isLoadingUser,
        packages,
        isLoadingPackages,
        selectedPackage: selectedPackage || packages[0] || null,
        setSelectedPackage: (pkg: PackageItem) => setSelectedPackage(pkg),
        isQRModalOpen,
        setIsQRModalOpen,
        refreshCustomer: fetchUser,
        logout,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
