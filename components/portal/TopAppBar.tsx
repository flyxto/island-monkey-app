"use client";

import React from "react";
import { Bell } from "lucide-react";

import Link from "next/link";

export interface TopAppBarRightAction {
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  badgeDot?: boolean;
}

export interface TopAppBarProps {
  wordmark: string;
  onNotificationClick?: () => void;
  rightAction?: TopAppBarRightAction;
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
  rightAction,
}: TopAppBarProps) {
  const renderRightAction = () => {
    if (rightAction) {
      const Icon = rightAction.icon;
      const content = (
        <span className="relative p-2 rounded-full text-im-body hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
          <Icon className="w-6 h-6" />
          {rightAction.badgeDot && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-im-accent rounded-full ring-2 ring-white" />
          )}
        </span>
      );

      if (rightAction.href) {
        return (
          <Link href={rightAction.href} aria-label={rightAction.ariaLabel || "Action"}>
            {content}
          </Link>
        );
      }

      return (
        <button
          onClick={rightAction.onClick}
          type="button"
          aria-label={rightAction.ariaLabel || "Action"}
          className="focus:outline-none"
        >
          {content}
        </button>
      );
    }

    // Default: Customer Portal Bell Notification
    return (
      <button
        onClick={onNotificationClick}
        type="button"
        className="relative p-2 rounded-full text-im-body hover:bg-gray-100 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-im-accent rounded-full ring-2 ring-white" />
      </button>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-im-border flex items-center justify-between px-4 max-w-107.5 mx-auto">
      <div className="flex items-center">
        <span className="text-[24px] font-bold text-black tracking-tight">
          {wordmark}
        </span>
      </div>
      {renderRightAction()}
    </header>
  );
}
