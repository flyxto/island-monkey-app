"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PackageItem,
  MOCK_PACKAGES,
  MOCK_CUSTOMER_USER,
  MOCK_CUSTOMER_BALANCE,
  CustomerUser,
  BalanceInfo,
} from "@/lib/mock-data/customer-portal";
import { getPackages, getCustomerProfile } from "@/lib/api";

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
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
    };
    fetchUser();
  }, [router]);

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
          priceLKR: apiPkg.priceLkr,
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
        
        // Select best seller by default if available
        if (mappedPackages.length > 0) {
          setSelectedPackage(
            mappedPackages.find((p: PackageItem) => p.isBestSeller) || mappedPackages[0]
          );
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        // Fallback to empty array or mock packages as per user preference (using empty for real integration)
        setPackages([]);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    
    fetchPackages();
  }, []);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <CustomerContext.Provider
      value={{
        user,
        balance,
        isLoadingUser,
        packages,
        isLoadingPackages,
        selectedPackage: selectedPackage || packages[0] || MOCK_PACKAGES[0],
        setSelectedPackage: (pkg: PackageItem) => setSelectedPackage(pkg),
        isQRModalOpen,
        setIsQRModalOpen,
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
