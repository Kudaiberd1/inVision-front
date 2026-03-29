import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { COPY, ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F7F7F5] text-neutral-900">
      <aside className="hidden h-screen w-56 shrink-0 flex-col border-r border-[#E5E5E4] bg-white md:flex">
        <div className="border-b border-[#E5E5E4] px-6 py-5">
          <span className="block text-lg font-bold tracking-tight text-neutral-900">{COPY.brand.name}</span>
          <span className="mt-0.5 block text-xs font-medium text-[#C8E63C]">
            {COPY.admin.portalSubtitle}
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <NavLink
            to={ROUTES.ADMIN}
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'border-l-2 border-[#C8E63C] bg-[#C8E63C]/15 text-neutral-900'
                  : 'border-l-2 border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            <span className="flex items-center gap-2 pl-1">
              <LayoutDashboard className="h-4 w-4" />
              {COPY.admin.candidates}
            </span>
          </NavLink>
        </nav>
        <div className="border-t border-[#E5E5E4] p-3">
          <p className="truncate px-2 text-xs text-neutral-500">{user?.name}</p>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-neutral-600"
            onClick={() => void logout()}
          >
            <LogOut className="h-4 w-4" />
            {COPY.admin.logout}
          </Button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#E5E5E4] bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            className="text-sm font-bold text-neutral-900"
            onClick={() => navigate(ROUTES.ADMIN)}
          >
            {COPY.brand.name}
          </button>
          <Button variant="ghost" className="px-2" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
