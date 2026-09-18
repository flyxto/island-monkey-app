"use client";

import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PORTAL_CONFIGS } from "@/lib/portal/nav-config";
import { CustomerProvider, useCustomer } from "@/lib/portal/CustomerContext";
import { QRModal } from "@/components/portal/QRModal";

function CustomerPortalContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, balance, isQRModalOpen, setIsQRModalOpen } = useCustomer();
  return (
      <PortalLayout config={PORTAL_CONFIGS.customer}>
        {children}
        {/* Global QR Modal accessible across all customer tabs */}
        {user && balance && (
          <QRModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            userFullName={`${user.firstName} ${user.lastName}`}
            qrValue={user.qrCodeValue}
            pointsBalance={balance.formattedPoints}
          />
        )}
      </PortalLayout>
  );
}

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerProvider>
      <CustomerPortalContent>{children}</CustomerPortalContent>
    </CustomerProvider>
  );
}