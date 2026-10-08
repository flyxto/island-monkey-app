"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export type AllowedRole = "customer" | "model" | "partner";

interface RoleRouteGuardProps {
  expectedRole: AllowedRole;
  children: React.ReactNode;
}

/**
 * Route Guard wrapper for mobile portals.
 * Ensures the user is authenticated AND possesses the specific role required by the portal.
 * If unauthenticated -> redirects to /login
 * If wrong role -> redirects to their corresponding role portal
 */
export function RoleRouteGuard({ expectedRole, children }: RoleRouteGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role !== expectedRole) {
      // Redirect to their respective authorized home or login
      if (role === "customer") {
        router.replace("/customer");
      } else if (role === "model") {
        router.replace("/model");
      } else if (role === "partner") {
        router.replace("/partner");
      } else {
        router.replace("/login");
      }
      return;
    }

    setIsAuthorized(true);
  }, [expectedRole, router]);

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#000002] flex flex-col items-center justify-center gap-3 z-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6433]" />
        <span className="text-xs font-medium text-white/60 tracking-tight">
          Verifying access...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
