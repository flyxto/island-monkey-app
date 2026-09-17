"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopAppBar, TopAppBarAction } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";
import { ProgressiveBlur } from "./ProgressiveBlur";
import { ModelHeader } from "./ModelHeader";
import { PortalNavConfig } from "@/lib/portal/nav-config";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { QrCode, ScanLine, Bell} from "lucide-react";

export interface PortalLayoutProps {
  config: PortalNavConfig;
  rightAction?: TopAppBarAction;
  children: React.ReactNode;
  hideTopAppBar?: boolean;
}

/**
 * Shared PortalLayout shell.
 * Takes a PortalNavConfig object (wordmark, nav items, theme colors)
 * and wraps content in a mobile-first 390px-430px centered viewport container.
 */
export function PortalLayout({
  config,
  rightAction,
  children,
  hideTopAppBar,
}: PortalLayoutProps) {
  const pathname = usePathname() || "";
  const isModel = config.portalId === "model";
  const isModelHome = pathname === "/model";
  const isModelGigs = pathname === "/model/gigs";
  const isModelGigDetail = pathname.startsWith("/model/gigs/") && pathname !== "/model/gigs";
  const showModelHeader = isModel && (isModelHome || isModelGigs);
  const shouldHideTopBar = hideTopAppBar ?? (isModelHome || showModelHeader || isModelGigDetail);

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

  const isModelDarkLayout = isModel && (isModelHome || isModelGigs);

  return (
    <div
      className={`w-full ${
        isModelDarkLayout
          ? "fixed inset-0 w-full h-full overflow-hidden overscroll-none bg-[#000002] p-1 justify-between gap-3 sm:gap-4"
          : "min-h-svh bg-linear-to-b from-[#f8f9ff] to-[#ffffff] relative"
      } flex flex-col`}
    >
      {/* Model Persistent Header (Expanded on Home, Shrunk on Gigs) */}
      {showModelHeader ? (
        <ModelHeader isCompact={isModelGigs} />
      ) : (
        /* Fixed Top App Bar */
        !shouldHideTopBar && (
          <TopAppBar wordmark={config.wordmark} actions={resolvedAction} />
        )
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col w-full min-h-0 ${
          isModelHome
            ? "pt-0 pb-0 overflow-hidden h-full overscroll-none touch-none justify-between"
            : isModelGigs
            ? "pt-0 pb-0 overflow-hidden h-full"
            : isModelGigDetail
            ? "pt-0 pb-0 overflow-hidden h-full"
            : shouldHideTopBar
            ? "pt-0 pb-32 overflow-y-auto"
            : "pt-16 px-4 py-8 pb-32 gap-8 overflow-y-auto"
        }`}
      >
        {children}
      </main>

      {/* Progressive Blur from top to bottom at page bottom */}
      {!isModelGigDetail && (
        <ProgressiveBlur
          height="h-28 sm:h-32"
          showGradient={!isModelDarkLayout}
          gradientColor="from-transparent via-white/40 to-white/90"
        />
      )}

      {/* Fixed Bottom Navigation Bar */}
      {!isModelGigDetail && (
        <BottomNavBar
          navItems={config.navItems}
          currentPath={pathname}
          activeBadgeBg={config.activeBadgeBg}
          activeBadgeText={config.activeBadgeText}
        />
      )}
    </div>
  );
}
