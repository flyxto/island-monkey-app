'use server';

import { fetchApi } from './client';

export async function getMyModelProfile() {
  return fetchApi<any>('/models/me');
}

export async function getMyModelBookings() {
  return fetchApi<any[]>('/model-bookings');
}

export async function getGigs() {
  return fetchApi<any[]>('/gigs');
}

export async function acceptModelBooking(id: string) {
  return fetchApi<any>(`/model-bookings/${id}/accept`, { method: 'PATCH' });
}

export async function rejectModelBooking(id: string) {
  return fetchApi<any>(`/model-bookings/${id}/reject`, { method: 'PATCH' });
}

export async function getConversionRate() {
  return fetchApi<{ pointsPerUnit: number; lkr: number; displayText: string }>(
    '/points/conversion-rate'
  );
}
