import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../store/useAuthStore';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const loc = useLocation();
  if (!token) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace state={{ from: loc.pathname }} />;
  }
  return <>{children}</>;
}
