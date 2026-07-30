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

interface CustomerContextType {
  user: CustomerUser;
  balance: BalanceInfo;
  packages: PackageItem[];
  selectedPackage: PackageItem;
  setSelectedPackage: (pkg: PackageItem) => void;
  isQRModalOpen: boolean;
  setIsQRModalOpen: (open: boolean) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<CustomerUser>(MOCK_CUSTOMER_USER);
  const [balance] = useState<BalanceInfo>(MOCK_CUSTOMER_BALANCE);
  const [packages] = useState<PackageItem[]>(MOCK_PACKAGES);
  // Default selected package is Growth Package
  const [selectedPackage, setSelectedPackage] = useState<PackageItem>(
    MOCK_PACKAGES.find((p) => p.isBestSeller) || MOCK_PACKAGES[0]
  );
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

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
