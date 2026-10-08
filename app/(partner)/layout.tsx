"use client";

import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PORTAL_CONFIGS } from "@/lib/portal/nav-config";
import { PartnerProvider } from "@/lib/portal/PartnerContext";
import { RoleRouteGuard } from "@/components/auth/RoleRouteGuard";

export default function PartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleRouteGuard expectedRole="partner">
      <PartnerProvider>
        <PortalLayout config={PORTAL_CONFIGS.partner}>
          {children}
        </PortalLayout>
      </PartnerProvider>
    </RoleRouteGuard>
  );
}
