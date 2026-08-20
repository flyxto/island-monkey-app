"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export interface QuickActionCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

/**
 * Quick Action Card component using shadcn Card:
 * White bg, bordered #c6c6cd, drop shadow-sm, rounded-lg, 16px padding.
 * Small icon on top.
 */
export function QuickActionCard({
  title,
  icon: Icon,
  href,
  onClick,
}: QuickActionCardProps) {
  const content = (
    <Card className="p-0 border border-[#c6c6cd] bg-white rounded-lg shadow-sm hover:shadow-md hover:border-[#4648d4] transition-all cursor-pointer group text-center">
      <CardContent className="flex flex-col items-center justify-center gap-3 p-4">
        <div className="p-3 bg-[#e1e0ff] rounded-full text-[#4648d4] group-hover:scale-105 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[14px] font-semibold text-im-heading">
          {title}
        </span>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href} className="flex-1">{content}</Link>;
  }

  return (
    <button onClick={onClick} type="button" className="flex-1 text-left">
      {content}
    </button>
  );
}
