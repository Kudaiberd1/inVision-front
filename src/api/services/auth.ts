import type { AdminUser } from '../../types';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../../constants';
import axios from 'axios';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_ADMIN === 'true';

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const part = token.split('.')[1];
    if (!part) return {};
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function axiosMessage(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const d = e.response?.data as Record<string, unknown> | undefined;
    const m = d?.message ?? d?.error;
    if (typeof m === 'string' && m.trim()) return m;
    if (e.response?.status === 401) return 'Invalid email or password.';
  }
  return e instanceof Error ? e.message : fallback;
}

export const adminLogin = async (email: string, password: string): Promise<AdminUser> => {
  if (USE_MOCK) {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return { id: '1', name: 'Aizat Bekova', email, token: 'mock-token-xyz' };
    }
    throw new Error('Invalid credentials');
  }

  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');

  try {
    const { data } = await apiClient.post<{ token: string }>(ENDPOINTS.AUTH_LOGIN, {
      username: email,
      password,
    });
    const token = data?.token;
    if (!token) throw new Error('Login response missing token.');

    const payload = decodeJwtPayload(token);
    const sub = typeof payload.sub === 'string' ? payload.sub : email;
    const name =
      (typeof payload.name === 'string' && payload.name) ||
      (typeof payload.preferred_username === 'string' && payload.preferred_username) ||
      sub;

    return {
      id: sub,
      name,
      email: sub.includes('@') ? sub : email,
      token,
    };
  } catch (e) {
    throw new Error(axiosMessage(e, 'Sign in failed'));
  }
};

export const adminLogout = async (): Promise<void> => {
  /* Stateless JWT — no server logout endpoint required */
};
