"use client";

import Link from "next/link";
import { NavItemConfig } from "@/lib/portal/nav-config";

export interface BottomNavBarProps {
  navItems: NavItemConfig[];
  currentPath: string;
  activeBadgeBg?: string; // e.g. #e1e0ff
  activeBadgeText?: string; // e.g. #4648d4
}

/**
 * Shared BottomNavBar - 100% config driven.
 * Height: 80px, fixed bottom, white bg, top border #c6c6cd.
 * Active item gets pill background (#e1e0ff), rounded-xl, indigo text/icon.
 */
export function BottomNavBar({
  navItems,
  currentPath,
  activeBadgeBg = "#e1e0ff",
  activeBadgeText = "#4648d4",
}: BottomNavBarProps) {
  const isItemActive = (item: NavItemConfig) => {
    if (item.matchPrefix) {
      return currentPath.startsWith(item.href);
    }
    return currentPath === item.href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-white border-t border-im-border flex items-center px-2 max-w-107.5 mx-auto">
      {navItems.map((item) => {
        const active = isItemActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center h-full py-1"
          >
            <div
              className="flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-colors duration-200"
              style={{
                backgroundColor: active ? activeBadgeBg : "transparent",
                color: active ? activeBadgeText : "#45464D",
              }}
            >
              <Icon className="w-6 h-6 mb-1 shrink-0" />
              <span
                className={`text-[12px] leading-tight select-none whitespace-nowrap ${
                  active ? "font-semibold text-slate-900" : "font-normal text-im-body"
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
