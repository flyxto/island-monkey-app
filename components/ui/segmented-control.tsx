"use client";

import React from "react";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  value,
  onChange,
  options,
  className = "",
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  return (
    <div
      role="tablist"
      className={`relative p-1 bg-slate-100/90 rounded-full border border-slate-200/70 h-10 w-full select-none ${className}`}
    >
      {/* Smooth Sliding Pill Indicator */}
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
        style={{
          left: "4px",
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {/* Option Buttons */}
      <div
        className="relative z-10 grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onChange(opt.value)}
              className={`flex items-center justify-center text-[13px] rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6433]/40 ${
                isSelected
                  ? "text-slate-900 font-semibold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
