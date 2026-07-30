import { Home, Package, Camera, Building2, UserCheck } from "lucide-react";
import React from "react";

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: boolean;
}

export interface PortalNavConfig {
  portalId: "customer" | "partner" | "model";
  wordmark: string;
  navItems: NavItemConfig[];
  activeBadgeBg?: string; // Default #e1e0ff
  activeBadgeText?: string; // Default #4648d4
}

/**
 * Shared portal configs for all user-facing mobile portals.
 * Each portal passes its own config into PortalLayout.
 */
export const PORTAL_CONFIGS: Record<string, PortalNavConfig> = {
  customer: {
    portalId: "customer",
    wordmark: "IslandMonkey",
    activeBadgeBg: "#e1e0ff",
    activeBadgeText: "#4648d4",
    navItems: [
      {
        id: "home",
        label: "Home",
        href: "/customer",
        icon: Home,
      },
      {
        id: "packages",
        label: "Packages",
        href: "/customer/packages",
        icon: Package,
        matchPrefix: true,
      },
      {
        id: "sessions",
        label: "Sessions",
        href: "/customer/sessions",
        icon: Camera,
        matchPrefix: true,
      },
    ],
  },
  // Future Partner Portal reference configuration
  partner: {
    portalId: "partner",
    wordmark: "IslandMonkey Partner",
    activeBadgeBg: "#e1e0ff",
    activeBadgeText: "#4648d4",
    navItems: [
      { id: "dashboard", label: "Dashboard", href: "/partner", icon: Home },
      { id: "redemptions", label: "Redeem", href: "/partner/redemptions", icon: Building2 },
    ],
  },
  // Future Model Portal reference configuration
  model: {
    portalId: "model",
    wordmark: "IslandMonkey Talent",
    activeBadgeBg: "#e1e0ff",
    activeBadgeText: "#4648d4",
    navItems: [
      { id: "jobs", label: "Jobs", href: "/model", icon: Home },
      { id: "profile", label: "Profile", href: "/model/profile", icon: UserCheck },
    ],
  },
};
