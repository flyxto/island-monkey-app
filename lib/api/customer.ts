'use server';

import { fetchApi } from './client';

export async function getMyProfile() {
  return fetchApi<any>('/customers/me');
}

export async function getMyBalance() {
  return fetchApi<{ pointsBalance: number; formattedBalance: string }>('/customers/me/balance');
}

export async function getMyQRCode() {
  return fetchApi<{ qrCodeValue: string }>('/customers/me/qr');
}

export async function getMyBookings() {
  return fetchApi<any[]>('/bookings/mine');
}

export async function getPackages() {
  return fetchApi<any[]>('/packages');
}

export async function createBooking(dto: {
  packageId: string;
  date: string;
  time: string;
  studioRoom: string;
  notes?: string;
}) {
  return fetchApi<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function getConversionRate() {
  return fetchApi<{ pointsPerUnit: number; lkr: number; displayText: string }>(
    '/points/conversion-rate'
  );
}

export async function getAvailableSlots(date: string, studioRoom?: string) {
  const params = new URLSearchParams({ date });
  if (studioRoom) params.append('studioRoom', studioRoom);
  return fetchApi<{ time: string; available: boolean }[]>(`/bookings/slots?${params}`);
}
