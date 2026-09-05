'use server';

import { fetchApi } from './client';

export async function getMyPartnerProfile() {
  return fetchApi<any>('/partners/me');
}

export async function getMyTransactions() {
  return fetchApi<any[]>('/partners/me/transactions');
}

export async function getOffers() {
  return fetchApi<any[]>('/offers');
}

export async function lookupCustomerByQR(qrValue: string) {
  return fetchApi<any>(`/customers/lookup/qr/${encodeURIComponent(qrValue)}`);
}

export async function deductPoints(dto: {
  userId: string;
  amount: number;
  description?: string;
  referenceId?: string;
}) {
  return fetchApi<any>('/points/deduct', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
