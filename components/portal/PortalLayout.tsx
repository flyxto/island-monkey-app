"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopAppBar, TopAppBarAction } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";
import { ProgressiveBlur } from "./ProgressiveBlur";
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
  const isModelHome = pathname === "/model";
  const shouldHideTopBar = hideTopAppBar ?? isModelHome;

  // Track navigation direction for swipe animations between navbar tabs
  const [prevPath, setPrevPath] = React.useState(pathname);
  const [direction, setDirection] = React.useState<"right" | "left" | "none">("none");

  if (prevPath !== pathname) {
    const getIndex = (path: string) => {
      return config.navItems.findIndex((item) => {
        if (item.href === path) return true;
        if (item.matchPrefix && item.href !== "/" && item.href !== "/model" && path.startsWith(item.href)) {
          return true;
        }
        return false;
      });
    };

    const prevIdx = getIndex(prevPath);
    const currIdx = getIndex(pathname);

    let newDir: "right" | "left" | "none" = "none";
    if (currIdx !== -1 && prevIdx !== -1 && currIdx !== prevIdx) {
      newDir = currIdx > prevIdx ? "right" : "left";
    } else if (pathname.startsWith(prevPath) && pathname !== prevPath) {
      newDir = "right";
    } else if (prevPath.startsWith(pathname) && pathname !== prevPath) {
      newDir = "left";
    }

    setPrevPath(pathname);
    setDirection(newDir);
  }

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
    <div
      className={`w-full ${
        isModelHome
          ? "fixed inset-0 w-full h-full overflow-hidden overscroll-none touch-none bg-[#000002]"
          : "min-h-svh bg-linear-to-b from-[#f8f9ff] to-[#ffffff] relative"
      } flex flex-col`}
    >
      {/* Fixed Top App Bar */}
      {!shouldHideTopBar && (
        <TopAppBar wordmark={config.wordmark} actions={resolvedAction} />
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col w-full overflow-x-hidden ${
          isModelHome
            ? "pt-0 pb-0 overflow-hidden h-full overscroll-none touch-none"
            : shouldHideTopBar
            ? "pt-0 pb-32 overflow-y-auto"
            : "pt-16 px-4 py-8 pb-32 gap-8 overflow-y-auto"
        }`}
      >
        <div
          key={pathname}
          className={`w-full flex-1 flex flex-col ${
            isModelHome ? "h-full" : ""
          } ${
            direction === "right"
              ? "animate-page-swipe-right"
              : direction === "left"
              ? "animate-page-swipe-left"
              : ""
          }`}
        >
          {children}
        </div>
      </main>

      {/* Progressive Blur from top to bottom at page bottom */}
      <ProgressiveBlur
        height="h-28 sm:h-32"
        showGradient={!isModelHome}
        gradientColor="from-transparent via-white/40 to-white/90"
      />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavBar
        navItems={config.navItems}
        currentPath={pathname}
        activeBadgeBg={config.activeBadgeBg}
        activeBadgeText={config.activeBadgeText}
      />
    </div>
  );
}
