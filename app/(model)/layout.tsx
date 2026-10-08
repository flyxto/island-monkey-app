"use client";

import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PORTAL_CONFIGS } from "@/lib/portal/nav-config";
import { ModelProvider } from "@/lib/portal/ModelContext";
import { RoleRouteGuard } from "@/components/auth/RoleRouteGuard";

export default function ModelPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleRouteGuard expectedRole="model">
      <ModelProvider>
        <PortalLayout config={PORTAL_CONFIGS.model}>
          {children}
        </PortalLayout>
      </ModelProvider>
    </RoleRouteGuard>
  );
}
