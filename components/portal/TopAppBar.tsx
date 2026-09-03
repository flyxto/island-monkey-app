"use client";

import React from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

export interface TopAppBarAction {
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  badgeDot?: boolean;
}

export interface TopAppBarProps {
  wordmark: string;
  onNotificationClick?: () => void;
  actions?: TopAppBarAction[];
}

/**
 * Shared TopAppBar - 100% config & prop driven.
 * Height: 64px, fixed top, white bg, border-b #c6c6cd.
 * Logo/wordmark left (bold, 24px).
 * Right action: Per-page custom action slot (e.g. Scan icon, settings icon) or default notification bell.
 */
export function TopAppBar({
  wordmark,
  onNotificationClick,
  actions,
}: TopAppBarProps) {
  const renderActionItem = (action: TopAppBarAction, idx: number) => {
    const Icon = action?.icon;

    const content = (
      <span className="relative p-2 rounded-full text-im-body hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
        <Icon className="w-6 h-6" />
          {action.badgeDot && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-im-accent rounded-full ring-2 ring-white" />
        )}
      </span>
    );

    if (action.href) {
      return (
        <Link key={idx} href={action.href} aria-label={action.ariaLabel || "Action"}>
          {content}
        </Link>
      );
    }

    return (
      <button
        key={idx}
        onClick={action.onClick}
        type="button"
        aria-label={action.ariaLabel || "Action"}
        className="focus:outline-none"
      >
        {content}
      </button>
    );
  };

  // Default: Customer Portal Bell Notification
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-im-border flex items-center justify-between px-4 max-w-107.5 mx-auto">
      <div className="flex items-center">
        <span className="text-[24px] font-bold text-black tracking-tight">
          {wordmark}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {actions && actions.length > 0 ? (
          actions.map((act, idx) => renderActionItem(act, idx))
        ) : (
          /* Fallback Notification Bell */
          <button
            onClick={onNotificationClick}
            type="button"
            className="relative p-2 rounded-full text-im-body hover:bg-im-accent-light transition-colors focus:outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-im-accent rounded-full ring-2 ring-white" />
          </button>
        )}
      </div>
    </header>
  );
}