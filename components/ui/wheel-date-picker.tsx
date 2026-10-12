"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { X } from "lucide-react";

export interface WheelDatePickerProps {
  /** Selected date in "YYYY-MM-DD" format, or empty string */
  value?: string;
  /** Callback returning the formatted "YYYY-MM-DD" string */
  onChange?: (date: string) => void;
  /** Earliest selectable year (default: 1950) */
  minYear?: number;
  /** Latest selectable year (default: currentYear - 14) */
  maxYear?: number;
  /** Additional styling class */
  className?: string;
}

export interface WheelDatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  value?: string;
  onConfirm: (date: string) => void;
  title?: string;
  minYear?: number;
  maxYear?: number;
}

const MONTHS = [
  { value: 1, name: "January", short: "Jan" },
  { value: 2, name: "February", short: "Feb" },
  { value: 3, name: "March", short: "Mar" },
  { value: 4, name: "April", short: "Apr" },
  { value: 5, name: "May", short: "May" },
  { value: 6, name: "June", short: "Jun" },
  { value: 7, name: "July", short: "Jul" },
  { value: 8, name: "August", short: "Aug" },
  { value: 9, name: "September", short: "Sep" },
  { value: 10, name: "October", short: "Oct" },
  { value: 11, name: "November", short: "Nov" },
  { value: 12, name: "December", short: "Dec" },
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Single Independent Cylindrical Spinning Wheel Column
 */
interface WheelColumnProps<T> {
  items: T[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  getLabel: (item: T) => string;
  getShortLabel?: (item: T) => string;
  itemHeight?: number;
  visibleRows?: number;
  ariaLabel: string;
}

function WheelColumn<T>({
  items,
  selectedIndex,
  onSelect,
  getLabel,
  getShortLabel,
  itemHeight = 44,
  visibleRows = 5,
  ariaLabel,
}: WheelColumnProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafId = useRef<number | null>(null);

  const [scrollOffset, setScrollOffset] = useState(selectedIndex * itemHeight);

  // Height padding so the first/last item can align to the center row
  const paddingHeight = ((visibleRows - 1) / 2) * itemHeight;

  // Initial scroll positioning
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = selectedIndex * itemHeight;
      setScrollOffset(selectedIndex * itemHeight);
    }
  }, []);

  // Sync scroll position when selectedIndex changes from outside (e.g. day clamped)
  useEffect(() => {
    if (!containerRef.current) return;
    const currentScrollIndex = Math.round(containerRef.current.scrollTop / itemHeight);
    if (currentScrollIndex !== selectedIndex) {
      isProgrammaticScrollRef.current = true;
      containerRef.current.scrollTo({
        top: selectedIndex * itemHeight,
        behavior: "smooth",
      });
      setScrollOffset(selectedIndex * itemHeight);
    }
  }, [selectedIndex, itemHeight]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const currentTop = containerRef.current.scrollTop;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setScrollOffset(currentTop);
    });

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (isProgrammaticScrollRef.current) {
        isProgrammaticScrollRef.current = false;
        return;
      }
      const targetIndex = Math.max(
        0,
        Math.min(items.length - 1, Math.round(currentTop / itemHeight))
      );
      if (targetIndex !== selectedIndex) {
        onSelect(targetIndex);
      }
    }, 90);
  }, [items.length, itemHeight, onSelect, selectedIndex]);

  const handleItemClick = (index: number) => {
    isProgrammaticScrollRef.current = true;
    containerRef.current?.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
    setScrollOffset(index * itemHeight);
    onSelect(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedIndex > 0) handleItemClick(selectedIndex - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (selectedIndex < items.length - 1) handleItemClick(selectedIndex + 1);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      handleItemClick(Math.max(0, selectedIndex - 5));
    } else if (e.key === "PageDown") {
      e.preventDefault();
      handleItemClick(Math.min(items.length - 1, selectedIndex + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      handleItemClick(0);
    } else if (e.key === "End") {
      e.preventDefault();
      handleItemClick(items.length - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="listbox"
      aria-label={ariaLabel}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      className="flex-1 h-[220px] overflow-y-scroll outline-none select-none relative focus-visible:ring-1 focus-visible:ring-[#FF6433]/30 rounded-xl cursor-grab active:cursor-grabbing"
      style={{
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Top spacer */}
      <div style={{ height: `${paddingHeight}px` }} aria-hidden="true" />

      {items.map((item, i) => {
        const dist = (i * itemHeight - scrollOffset) / itemHeight;
        const absDist = Math.abs(dist);
        const isCenter = absDist < 0.5;

        // 3D perspective rotation around horizontal cylinder axis
        const rotateX = Math.max(-48, Math.min(48, -dist * 22));

        // Continuous, smooth scale curve based on exact scroll distance
        const scale = Math.max(0.74, 1.05 - absDist * 0.15);
        const opacity = Math.max(0.2, 1 - absDist * 0.42);

        return (
          <div
            key={i}
            onClick={() => handleItemClick(i)}
            style={{
              height: `${itemHeight}px`,
              scrollSnapAlign: "center",
              scrollSnapStop: "normal",
              transform: `perspective(380px) rotateX(${rotateX}deg) scale(${scale})`,
              opacity,
              transformOrigin: "center center",
              transition: "transform 0.08s ease-out, opacity 0.08s ease-out, color 0.12s ease-out",
            }}
            className={`flex items-center justify-center px-1 text-center font-medium text-[19px] sm:text-[20px] tracking-tight ${
              isCenter ? "text-slate-950" : "text-slate-400"
            }`}
            role="option"
            aria-selected={isCenter}
          >
            {getShortLabel ? (
              <>
                <span className="hidden sm:inline truncate">{getLabel(item)}</span>
                <span className="sm:hidden">{getShortLabel(item)}</span>
              </>
            ) : (
              <span className="truncate">{getLabel(item)}</span>
            )}
          </div>
        );
      })}

      {/* Bottom spacer */}
      <div style={{ height: `${paddingHeight}px` }} aria-hidden="true" />
    </div>
  );
}

/**
 * Three-Column iOS Style Spinning Wheel Date Picker
 */
export function WheelDatePicker({
  value,
  onChange,
  minYear = 1950,
  maxYear,
  className = "",
}: WheelDatePickerProps) {
  const currentYear = new Date().getFullYear();
  const effectiveMaxYear = maxYear ?? currentYear - 14;

  // Build Year list ascending: e.g. 1950, 1951, ..., 2012
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = minYear; y <= effectiveMaxYear; y++) {
      list.push(y);
    }
    return list;
  }, [minYear, effectiveMaxYear]);

  // Parse incoming value or default to model-friendly birth year (~2002)
  const initialDate = useMemo(() => {
    if (value) {
      const parts = value.split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        return {
          year: parts[0],
          month: parts[1],
          day: parts[2],
        };
      }
    }
    const defaultYear = Math.min(2002, effectiveMaxYear);
    return {
      year: defaultYear,
      month: 1,
      day: 15,
    };
  }, [value, effectiveMaxYear]);

  const [selectedYear, setSelectedYear] = useState<number>(initialDate.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(initialDate.month);
  const [selectedDay, setSelectedDay] = useState<number>(initialDate.day);

  // Sync state if external value changes
  useEffect(() => {
    if (value) {
      const parts = value.split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        setSelectedYear(parts[0]);
        setSelectedMonth(parts[1]);
        setSelectedDay(parts[2]);
      }
    }
  }, [value]);

  // Compute valid days count for current year & month (accounting for leap years)
  const maxDays = useMemo(
    () => getDaysInMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const daysList = useMemo(() => {
    const list: number[] = [];
    for (let d = 1; d <= maxDays; d++) {
      list.push(d);
    }
    return list;
  }, [maxDays]);

  // If day exceeds max days of the new month/year, clamp it automatically
  useEffect(() => {
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  }, [selectedDay, maxDays]);

  // Emit updated date string in "YYYY-MM-DD" format
  const notifyChange = useCallback(
    (y: number, m: number, d: number) => {
      const clampedD = Math.min(d, getDaysInMonth(y, m));
      const yStr = String(y);
      const mStr = String(m).padStart(2, "0");
      const dStr = String(clampedD).padStart(2, "0");
      onChange?.(`${yStr}-${mStr}-${dStr}`);
    },
    [onChange]
  );

  const handleMonthSelect = (index: number) => {
    const newMonth = MONTHS[index].value;
    setSelectedMonth(newMonth);
    notifyChange(selectedYear, newMonth, selectedDay);
  };

  const handleDaySelect = (index: number) => {
    const newDay = daysList[index];
    setSelectedDay(newDay);
    notifyChange(selectedYear, selectedMonth, newDay);
  };

  const handleYearSelect = (index: number) => {
    const newYear = years[index];
    setSelectedYear(newYear);
    notifyChange(newYear, selectedMonth, selectedDay);
  };

  const selectedMonthIndex = Math.max(
    0,
    MONTHS.findIndex((m) => m.value === selectedMonth)
  );
  const selectedDayIndex = Math.max(
    0,
    daysList.findIndex((d) => d === selectedDay)
  );
  const selectedYearIndex = Math.max(
    0,
    years.findIndex((y) => y === selectedYear)
  );

  return (
    <div
      className={`relative w-full h-[220px] bg-slate-50/60 rounded-2xl overflow-hidden p-1 flex items-center justify-center select-none ${className}`}
    >
      {/* Cylindrical Gradient Fade Overlays (Top & Bottom) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[88px] bg-gradient-to-b from-white via-white/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[88px] bg-gradient-to-t from-white via-white/80 to-transparent z-20" />

      {/* 3 Independent Spinning Columns */}
      <div className="relative z-10 flex w-full h-full items-center">
        {/* Column 1: Month Wheel */}
        <WheelColumn
          items={MONTHS}
          selectedIndex={selectedMonthIndex}
          onSelect={handleMonthSelect}
          getLabel={(m) => m.name}
          getShortLabel={(m) => m.short}
          ariaLabel="Month"
        />

        {/* Column 2: Day Wheel */}
        <WheelColumn
          items={daysList}
          selectedIndex={selectedDayIndex}
          onSelect={handleDaySelect}
          getLabel={(d) => String(d)}
          ariaLabel="Day"
        />

        {/* Column 3: Year Wheel */}
        <WheelColumn
          items={years}
          selectedIndex={selectedYearIndex}
          onSelect={handleYearSelect}
          getLabel={(y) => String(y)}
          ariaLabel="Year"
        />
      </div>
    </div>
  );
}

/**
 * Native iOS Style Pop-up Modal containing the 3-Column Wheel Picker
 */
export function WheelDatePickerModal({
  isOpen,
  onClose,
  value,
  onConfirm,
  title = "Select Date of Birth",
  minYear = 1950,
  maxYear,
}: WheelDatePickerModalProps) {
  const currentYear = new Date().getFullYear();
  const effectiveMaxYear = maxYear ?? currentYear - 14;

  const defaultDraft = useMemo(() => {
    if (value) return value;
    const defaultY = Math.min(2002, effectiveMaxYear);
    return `${defaultY}-01-15`;
  }, [value, effectiveMaxYear]);

  const [draftDate, setDraftDate] = useState<string>(defaultDraft);

  useEffect(() => {
    if (isOpen) {
      setDraftDate(value || defaultDraft);
    }
  }, [isOpen, value, defaultDraft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-5 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150 border border-black/5">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Column Spinning Wheel Picker */}
        <WheelDatePicker
          value={draftDate}
          onChange={setDraftDate}
          minYear={minYear}
          maxYear={effectiveMaxYear}
        />

        {/* Action Buttons (App Signature Style) */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="relative overflow-hidden flex-1 h-11 bg-gradient-to-b from-white via-[#F6F8FA] to-[#E3E7EC] border border-white rounded-full font-medium text-[14px] text-slate-800 flex items-center justify-center shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
          >
            <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-full pointer-events-none" />
            <span className="relative z-10">Cancel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (draftDate) {
                onConfirm(draftDate);
              }
              onClose();
            }}
            className="relative overflow-hidden flex-1 h-11 bg-gradient-to-b from-[#FF7A45] via-[#FF6433] to-[#E84A23] border border-white/35 rounded-full font-medium text-[14px] text-white flex items-center justify-center shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.15),0_8px_20px_rgba(232,74,35,0.25)] hover:brightness-105 active:scale-[0.985] transition-all cursor-pointer"
          >
            <div className="absolute inset-x-2 top-0.5 h-[46%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full pointer-events-none" />
            <span className="relative z-10">Confirm Date</span>
          </button>
        </div>
      </div>
    </div>
  );
}
