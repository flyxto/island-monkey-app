export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function refreshTokens(): Promise<string | null> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error('Refresh failed');

    const data = await response.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data.accessToken;
  } catch (error) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Ideally redirect to login, but we rely on CustomerContext to handle that
      window.location.href = '/login';
    }
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const newToken = await refreshTokens();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(url, { ...options, headers });
    }
  }

  return response;
}
export async function loginApi(data: any) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  
  return response.json();
}

export async function registerApi(data: any) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  
  return response.json();
}

export async function getPackages() {
  const response = await fetchWithAuth(`${API_URL}/packages`, { method: 'GET' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch packages');
  }
  
  return response.json();
}

export async function getAvailableSlots(date: string, studioRoom?: string) {
  const url = new URL(`${API_URL}/bookings/slots`);
  url.searchParams.append('date', date);
  if (studioRoom) url.searchParams.append('studioRoom', studioRoom);
  
  const response = await fetchWithAuth(url.toString(), { method: 'GET' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch slots');
  }
  
  return response.json();
}

export async function createBooking(data: any) {
  const response = await fetchWithAuth(`${API_URL}/bookings`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Booking failed');
  }
  
  return response.json();
}

export async function getCustomerProfile() {
  const response = await fetchWithAuth(`${API_URL}/customers/me`, { method: 'GET' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch customer profile');
  }
  
  return response.json();
}

export async function getModelProfile() {
  const response = await fetchWithAuth(`${API_URL}/models/me`, { method: 'GET' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch model profile');
  }
  
  return response.json();
}


export async function getModelBookings() {
  const response = await fetchWithAuth(`${API_URL}/models/me/bookings`, { method: 'GET' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch model bookings');
  }
  return response.json();
}

export async function getGigs(status?: string) {
  const url = new URL(`${API_URL}/gigs`);
  if (status) url.searchParams.append('status', status);
  const response = await fetchWithAuth(url.toString(), { method: 'GET' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch gigs');
  }
  return response.json();
}
