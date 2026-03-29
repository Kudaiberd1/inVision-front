import { Outlet, Link } from 'react-router-dom';
import { COPY, ROUTES } from '../../constants';

export function PublicShell() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-neutral-900">
      <header className="border-b border-[#E5E5E4] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to={ROUTES.HOME}
            className="text-lg font-bold tracking-tight text-neutral-900"
          >
            {COPY.brand.name}
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-neutral-600">
            <Link to={ROUTES.SELECT_PROGRAM} className="transition-colors hover:text-[#A8C420]">
              {COPY.nav.apply}
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
