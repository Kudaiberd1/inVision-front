import { create } from 'zustand';
import type { AdminUser } from '../types';

const STORAGE_USER = 'admin_user';

function readStoredUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (!raw) return null;
    const u = JSON.parse(raw) as AdminUser;
    if (u?.token && u?.email) return u;
  } catch {
    /* ignore */
  }
  return null;
}

const initialToken =
  typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
const initialUser = typeof window !== 'undefined' ? readStoredUser() : null;

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  login: (user: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: initialUser?.token === initialToken ? initialUser : null,
  login: (user) => {
    localStorage.setItem('admin_token', user.token);
    localStorage.setItem(
      STORAGE_USER,
      JSON.stringify({ id: user.id, name: user.name, email: user.email, token: user.token }),
    );
    set({ token: user.token, user });
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem(STORAGE_USER);
    set({ token: null, user: null });
  },
}));
