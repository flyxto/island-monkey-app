"use client";

import React, { createContext, useContext, useState } from "react";
import {
  PackageItem,
  MOCK_PACKAGES,
  MOCK_CUSTOMER_USER,
  MOCK_CUSTOMER_BALANCE,
  CustomerUser,
  BalanceInfo,
} from "@/lib/mock-data/customer-portal";
import { getPackages } from "@/lib/api";

interface CustomerContextType {
  user: CustomerUser;
  balance: BalanceInfo;
  packages: PackageItem[];
  isLoadingPackages: boolean;
  selectedPackage: PackageItem | null;
  setSelectedPackage: (pkg: PackageItem) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<CustomerUser>(MOCK_CUSTOMER_USER);
  const [balance] = useState<BalanceInfo>(MOCK_CUSTOMER_BALANCE);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  
  // Default selected package is null until fetched
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  React.useEffect(() => {
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
        packages,
        isLoadingPackages,
        selectedPackage: selectedPackage || MOCK_PACKAGES[0],
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
