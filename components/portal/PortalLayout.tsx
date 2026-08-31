"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopAppBar, TopAppBarAction } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";
import { PortalNavConfig } from "@/lib/portal/nav-config";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { QrCode, ScanLine, Bell} from "lucide-react";

export interface PortalLayoutProps {
  config: PortalNavConfig;
  rightAction?: TopAppBarAction;
  children: React.ReactNode;
}

/**
 * Shared PortalLayout shell.
 * Takes a PortalNavConfig object (wordmark, nav items, theme colors)
 * and wraps content in a mobile-first 390px-430px centered viewport container.
 */
export function PortalLayout({ config, rightAction, children }: PortalLayoutProps) {
  const pathname = usePathname() || "";

  // Safe consumer check for CustomerContext
  let isQRModalOpen = false;
  let setIsQRModalOpen: ((open: boolean) => void) | undefined;
  try {
    const customer = useCustomer();
    isQRModalOpen = customer.isQRModalOpen;
    setIsQRModalOpen = customer.setIsQRModalOpen;
  } catch {
    // Outside CustomerProvider (partner / model portal)
  }

  // Auto-resolve Partner rightAction if not explicitly supplied as a prop
  const resolveTopBarActions = (): TopAppBarAction[] => {
    // Customer Portal: QR Modal Button + Notification Bell
    if (config.portalId === "customer") {
      return [
        {
          icon: QrCode,
          onClick: () => setIsQRModalOpen?.(true),
          ariaLabel: "Open My QR Code",
        },
        {
          icon: Bell,
          badgeDot: true,
          ariaLabel: "Notifications",
        },
      ];
    }

    // Partner Portal: QR Scanner Link to /partner/scan
    if (config.portalId === "partner") {
      return [
        {
          icon: ScanLine,
          href: "/partner/scan",
          ariaLabel: "Scan Customer QR Code",
        },
        {
          icon: Bell,
          badgeDot: true,
          ariaLabel: "Notifications",
        },
      ];
    }

    // Model Portal (or default): Notification Bell only
    return [
      {
        icon: Bell,
        badgeDot: true,
        ariaLabel: "Notifications",
      },
    ];
  };;

  const resolvedAction = rightAction ? [rightAction] : resolveTopBarActions();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center py-0 sm:py-6">
      {/* Mobile-first Viewport Container (Centered on desktop) */}
      <div className="w-full max-w-107.5 min-h-screen sm:min-h-220 sm:h-220 bg-linear-to-b from-[#f8f9ff] to-[#ffffff] relative flex flex-col shadow-2xl sm:rounded-[32px] overflow-hidden border border-im-border/40">
        {/* Fixed Top App Bar */}
        <TopAppBar wordmark={config.wordmark} actions={resolvedAction} />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 pt-16 pb-20 overflow-y-auto px-4 py-8 flex flex-col gap-8">
          {children}
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNavBar
          navItems={config.navItems}
          currentPath={pathname}
          activeBadgeBg={config.activeBadgeBg}
          activeBadgeText={config.activeBadgeText}
        />
      </div>
    </div>
  );
}
