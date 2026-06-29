import { createApiClient } from '@zemen/scheduler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('zemen_access_token');
}

export const api = createApiClient({
  baseUrl: API_URL,
  getToken,
});

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('zemen_access_token', accessToken);
  localStorage.setItem('zemen_refresh_token', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('zemen_access_token');
  localStorage.removeItem('zemen_refresh_token');
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('zemen_access_token');
}
