"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NavItemConfig } from "@/lib/portal/nav-config";

export interface BottomNavBarProps {
  navItems: NavItemConfig[];
  currentPath: string;
  activeBadgeBg?: string;
  activeBadgeText?: string;
}

export function BottomNavBar({
  navItems,
  currentPath,
}: BottomNavBarProps) {
  const [activePath, setActivePath] = useState(currentPath);

  useEffect(() => {
    setActivePath(currentPath);
  }, [currentPath]);

  const isItemActive = (item: NavItemConfig) => {
    if (item.matchPrefix) {
      return activePath.startsWith(item.href);
    }
    return activePath === item.href;
  };

  return (
    <div className="fixed bottom-5 sm:bottom-6 left-0 right-0 z-40 flex justify-center items-center pointer-events-none px-3 w-full">
      <nav className="pointer-events-auto inline-flex items-center gap-2 p-2 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.14),inset_0_1px_2px_rgba(255,255,255,0.9)] rounded-full ring-1 ring-black/5">
        {navItems.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              onClick={() => setActivePath(item.href)}
              className={`relative flex items-center justify-center py-2.5 px-4.5 sm:py-3 sm:px-5.5 rounded-full cursor-pointer select-none transition-all duration-300 ease-out ${
                active
                  ? "bg-white text-black shadow-[0_3px_10px_rgba(0,0,0,0.1)]"
                  : "text-neutral-500 hover:text-black hover:bg-white/40"
              }`}
            >
              <Icon
                className={`w-6 h-6 shrink-0 transition-transform duration-300 ease-out ${
                  active
                    ? "text-black stroke-[2.2] scale-105"
                    : "text-neutral-500 stroke-[1.8] scale-100"
                }`}
              />
              <span
                className={`overflow-hidden whitespace-nowrap text-[15px] font-medium text-black tracking-tight leading-none transition-all duration-300 ease-out ${
                  active
                    ? "max-w-32 opacity-100 ml-2"
                    : "max-w-0 opacity-0 ml-0 pointer-events-none"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
