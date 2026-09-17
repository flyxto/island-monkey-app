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
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center items-center pointer-events-none px-4 max-w-107.5 mx-auto">
      <nav className="pointer-events-auto inline-flex items-center gap-1.5 p-1.5 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] rounded-full ring-1 ring-black/5">
        {navItems.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              onClick={() => setActivePath(item.href)}
              className={`relative flex items-center justify-center py-2 px-3.5 rounded-full cursor-pointer select-none transition-all duration-300 ease-out ${
                active
                  ? "bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  : "text-neutral-500 hover:text-black hover:bg-white/40"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ease-out ${
                  active
                    ? "text-black stroke-[2.2] scale-105"
                    : "text-neutral-500 stroke-[1.8] scale-100"
                }`}
              />
              <span
                className={`overflow-hidden whitespace-nowrap text-[13px] font-semibold text-black tracking-tight leading-none transition-all duration-300 ease-out ${
                  active
                    ? "max-w-28 opacity-100 ml-1.5"
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
