"use client";

import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PORTAL_CONFIGS } from "@/lib/portal/nav-config";
import { CustomerProvider } from "@/lib/portal/CustomerContext";

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerProvider>
      <PortalLayout config={PORTAL_CONFIGS.customer}>{children}</PortalLayout>
    </CustomerProvider>
  );
}
