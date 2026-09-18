"use client";

import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PORTAL_CONFIGS } from "@/lib/portal/nav-config";
import { PartnerProvider } from "@/lib/portal/PartnerContext";

export default function PartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PartnerProvider>
      <PortalLayout config={PORTAL_CONFIGS.partner}>
        {children}
      </PortalLayout>
    </PartnerProvider>
  );
}
