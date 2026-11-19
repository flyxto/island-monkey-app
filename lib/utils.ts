import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats an ISO date-time in studio time (Asia/Colombo), e.g. "Fri, Nov 20 · 10:00 AM". */
export function formatStudioDateTime(iso?: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const date = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Colombo", weekday: "short", month: "short", day: "numeric" }).format(d)
  const time = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Colombo", hour: "numeric", minute: "2-digit" }).format(d)
  return `${date} · ${time}`
}
