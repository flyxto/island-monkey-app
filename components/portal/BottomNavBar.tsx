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
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center items-center pointer-events-none px-4 max-w-107.5 mx-auto">
      <nav className="pointer-events-auto inline-flex items-center gap-1.5 p-1.5 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] rounded-full ring-1 ring-black/5">
        {navItems.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-center transition-all duration-300 ease-out select-none ${
                active
                  ? "bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-5 py-2.5 rounded-full gap-2 font-semibold"
                  : "text-neutral-500 hover:text-black hover:bg-white/40 px-3.5 py-2.5 rounded-full"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? "text-black stroke-[2.2]" : "stroke-[1.8]"}`} />
              {active && (
                <span className="text-[13px] font-semibold text-black tracking-tight leading-none whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
