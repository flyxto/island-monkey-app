import { Home, Package, Camera, Building2, UserCheck, History, Tag, Calendar, User } from "lucide-react";
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
    activeBadgeBg: "#f1f5f9",
    activeBadgeText: "#0f172a",
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
  partner: {
    portalId: "partner",
    wordmark: "IslandMonkey",
    activeBadgeBg: "#f1f5f9",
    activeBadgeText: "#0f172a",
    navItems: [
      { 
        id: "home", 
        label: "Home", 
        href: "/partner", 
        icon: Home 
      },
      { 
        id: "history", 
        label: "History", 
        href: "/partner/history", 
        icon: History, 
        matchPrefix: true 
      },
      { 
        id: "offers", 
        label: "Offers", 
        href: "/partner/offers", 
        icon: Tag, 
        matchPrefix: true 
      },
    ],
  },
  model: {
    portalId: "model",
    wordmark: "IslandMonkey",
    activeBadgeBg: "#f1f5f9",
    activeBadgeText: "#0f172a",
    navItems: [
      { 
        id: "home", 
        label: "Home", 
        href: "/model", 
        icon: Home 
      },
      { 
        id: "gigs", 
        label: "Gigs", 
        href: "/model/gigs", 
        icon: Camera, 
        matchPrefix: true 
      },
      { 
        id: "bookings", 
        label: "Bookings", 
        href: "/model/bookings", 
        icon: Calendar, 
        matchPrefix: true 
      },
      { 
        id: "profile", 
        label: "Profile", 
        href: "/model/profile", 
        icon: User, 
        matchPrefix: true 
      },
    ],
  },
};
