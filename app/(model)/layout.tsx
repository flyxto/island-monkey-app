"use client";

import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PORTAL_CONFIGS } from "@/lib/portal/nav-config";

export default function ModelPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayout config={PORTAL_CONFIGS.model}>
      {children}
    </PortalLayout>
  );
}
