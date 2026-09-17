"use client";

import React from "react";

export interface ProgressiveBlurProps {
  className?: string;
  height?: string;
  showGradient?: boolean;
  gradientColor?: string;
}

const BLUR_LAYERS = [
  {
    blur: "1px",
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 40%)",
    zIndex: 1,
  },
  {
    blur: "2px",
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 50%)",
    zIndex: 2,
  },
  {
    blur: "4px",
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 60%)",
    zIndex: 3,
  },
  {
    blur: "8px",
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 70%)",
    zIndex: 4,
  },
  {
    blur: "16px",
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 90%)",
    zIndex: 5,
  },
  {
    blur: "32px",
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 1) 100%)",
    zIndex: 6,
  },
  {
    blur: "64px",
    mask: "linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%)",
    zIndex: 10,
  },
];

export function ProgressiveBlur({
  className = "",
  height = "h-28",
  showGradient = false,
  gradientColor = "from-transparent to-white/80",
}: ProgressiveBlurProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 left-0 right-0 w-full ${height} z-20 overflow-hidden ${className}`}
    >
      {BLUR_LAYERS.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            zIndex: layer.zIndex,
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
      {showGradient && (
        <div
          className={`absolute inset-0 z-11 bg-linear-to-b ${gradientColor}`}
        />
      )}
    </div>
  );
}
