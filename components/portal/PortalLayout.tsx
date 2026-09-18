"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopAppBar, TopAppBarAction } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";
import { ProgressiveBlur } from "./ProgressiveBlur";
import { ModelHeader } from "./ModelHeader";
import { PartnerHeader } from "./PartnerHeader";
import { CustomerHeader } from "./CustomerHeader";
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
  const isModelBookings = pathname === "/model/bookings";
  const isCompactModelHeader = isModelGigs || isModelBookings;
  const isModelGigDetail = pathname.startsWith("/model/gigs/") && pathname !== "/model/gigs";
  const isModelBookingDetail = pathname.startsWith("/model/bookings/") && pathname !== "/model/bookings";
  const isModelDetail = isModelGigDetail || isModelBookingDetail;
  const isModelProfile = pathname === "/model/profile";
  const showModelHeader = isModel && (isModelHome || isCompactModelHeader || isModelProfile);

  // Partner Portal Route Flags
  const isPartner = config.portalId === "partner";
  const isPartnerHome = pathname === "/partner";
  const isPartnerOffers = pathname === "/partner/offers";
  const isPartnerHistory = pathname === "/partner/history";
  const isPartnerScan = pathname === "/partner/scan";
  const isPartnerOfferDetail = pathname.startsWith("/partner/offers/") && pathname !== "/partner/offers";
  const isPartnerCustomerDetail = pathname.startsWith("/partner/customer/");
  const isPartnerDetail = isPartnerOfferDetail || isPartnerCustomerDetail;
  const isPartnerProfile = pathname === "/partner/profile";
  const isCompactPartnerHeader = isPartnerOffers || isPartnerHistory || isPartnerScan;
  const showPartnerHeader = isPartner && (isPartnerHome || isCompactPartnerHeader || isPartnerProfile);

  // Customer Portal Route Flags
  const isCustomer = config.portalId === "customer";
  const isCustomerHome = pathname === "/customer";
  const isCustomerPackages = pathname === "/customer/packages";
  const isCustomerSessions = pathname === "/customer/sessions";
  const isCustomerPackageDetail = pathname.startsWith("/customer/packages/") && pathname !== "/customer/packages";
  const isCustomerBooking = pathname.startsWith("/customer/booking");
  const isCustomerDetail = isCustomerPackageDetail;
  const isCustomerProfile = pathname === "/customer/profile";
  const isCompactCustomerHeader = isCustomerPackages || isCustomerSessions;
  const showCustomerHeader = isCustomer && (isCustomerHome || isCompactCustomerHeader || isCustomerProfile);

  const shouldHideTopBar = hideTopAppBar ?? (
    isModelHome || showModelHeader || isModelDetail || isModelProfile ||
    showPartnerHeader || isPartnerDetail || isPartnerProfile ||
    showCustomerHeader || isCustomerDetail || isCustomerProfile || isCustomerBooking
  );

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
  };

  const resolvedAction = rightAction ? [rightAction] : resolveTopBarActions();

  const isDarkLayout =
    (isModel && (isModelHome || isCompactModelHeader)) ||
    (isPartner && (isPartnerHome || isCompactPartnerHeader)) ||
    (isCustomer && (isCustomerHome || isCompactCustomerHeader || isCustomerBooking));

  return (
    <div
      className={`w-full ${
        isDarkLayout
          ? "fixed inset-0 w-full h-full overflow-hidden overscroll-none bg-[#000002] p-1 justify-between gap-3 sm:gap-4"
          : isModelProfile || isPartnerProfile || isCustomerProfile
          ? "min-h-svh bg-gradient-to-b from-[#FFEFE8] via-[#FAF6F3] to-[#F6F7F9] relative"
          : isModelDetail || isPartnerDetail || isCustomerDetail
          ? "fixed inset-0 w-full h-full overflow-hidden overscroll-none bg-[#000002] p-1"
          : "min-h-svh bg-linear-to-b from-[#f8f9ff] to-[#ffffff] relative"
      } flex flex-col`}
    >
      {/* Persistent Headers (Model, Partner & Customer Orange Cards) */}
      {showModelHeader ? (
        <ModelHeader isCompact={isCompactModelHeader} isProfile={isModelProfile} />
      ) : showPartnerHeader ? (
        <PartnerHeader isCompact={isCompactPartnerHeader} isProfile={isPartnerProfile} />
      ) : showCustomerHeader ? (
        <CustomerHeader isCompact={isCompactCustomerHeader} isProfile={isCustomerProfile} />
      ) : (
        /* Fixed Top App Bar */
        !shouldHideTopBar && (
          <TopAppBar wordmark={config.wordmark} actions={resolvedAction} />
        )
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col w-full min-h-0 ${
          isModelHome || isPartnerHome || isCustomerHome || isCustomerBooking
            ? "pt-0 pb-0 overflow-hidden h-full overscroll-none touch-none justify-between"
            : isCompactModelHeader || isCompactPartnerHeader || isCompactCustomerHeader
            ? "pt-0 pb-0 overflow-hidden h-full"
            : isModelDetail || isPartnerDetail || isCustomerDetail
            ? "pt-0 pb-0 overflow-hidden h-full"
            : isModelProfile || isPartnerProfile || isCustomerProfile
            ? "pt-3.5 px-4 pb-32 gap-5 overflow-y-auto"
            : shouldHideTopBar
            ? "pt-0 pb-32 overflow-y-auto"
            : "pt-16 px-4 py-8 pb-32 gap-8 overflow-y-auto"
        }`}
      >
        {children}
      </main>

      {/* Progressive Blur from top to bottom at page bottom */}
      {!isModelDetail && !isPartnerDetail && !isCustomerDetail && !isCustomerBooking && (
        <ProgressiveBlur
          height="h-28 sm:h-32"
          showGradient={!isDarkLayout && !isModelProfile && !isPartnerProfile && !isCustomerProfile}
          gradientColor="from-transparent via-white/40 to-white/90"
        />
      )}

      {/* Fixed Bottom Navigation Bar */}
      {!isModelDetail && !isPartnerDetail && !isCustomerDetail && !isCustomerBooking && (
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
