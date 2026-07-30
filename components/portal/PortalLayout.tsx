"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopAppBar } from "./TopAppBar";
import { BottomNavBar } from "./BottomNavBar";
import { PortalNavConfig } from "@/lib/portal/nav-config";

export interface PortalLayoutProps {
  config: PortalNavConfig;
  children: React.ReactNode;
}

/**
 * Shared PortalLayout shell.
 * Takes a PortalNavConfig object (wordmark, nav items, theme colors)
 * and wraps content in a mobile-first 390px-430px centered viewport container.
 */
export function PortalLayout({ config, children }: PortalLayoutProps) {
  const pathname = usePathname() || "";

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center py-0 sm:py-6">
      {/* Mobile-first Viewport Container (Centered on desktop) */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[880px] sm:h-[880px] bg-gradient-to-b from-[#f8f9ff] to-[#ffffff] relative flex flex-col shadow-2xl sm:rounded-[32px] overflow-hidden border border-[#c6c6cd]/40">
        {/* Fixed Top App Bar */}
        <TopAppBar wordmark={config.wordmark} />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 pt-[64px] pb-[80px] overflow-y-auto px-4 py-8 flex flex-col gap-8">
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
