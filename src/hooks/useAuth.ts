import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, adminLogout } from '../api/services/auth';
import { ROUTES } from '../constants';
import { useAuthStore } from '../store/useAuthStore';

export function useAuth() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const logoutStore = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const u = await adminLogin(email, password);
        loginStore(u);
        navigate(ROUTES.ADMIN, { replace: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Sign in failed');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [loginStore, navigate],
  );

  const logout = useCallback(async () => {
    await adminLogout();
    logoutStore();
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  }, [logoutStore, navigate]);

  return { user, token, login, logout, loading, error, setError };
}
