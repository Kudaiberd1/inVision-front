import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { COPY, DEMO_EMAIL, DEMO_PASSWORD } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    void (async () => {
      try {
        await login(email, password);
      } catch {
        /* error set in hook */
      }
    })();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#C8E63C] to-[#F7F7F5] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E5E4] bg-white p-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-neutral-900">{COPY.brand.name}</p>
          <p className="mt-1 text-sm text-neutral-500">by inDrive</p>
          <p className="mt-3 text-sm text-neutral-600">{COPY.admin.portalSubtitle}</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Email
            </label>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E5E4] bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#C8E63C]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#E5E5E4] bg-white py-2.5 pl-4 pr-10 text-sm text-neutral-900 outline-none transition-colors focus:border-[#C8E63C]"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-[#F87171]">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {COPY.admin.signIn}
          </Button>
        </form>
        <div className="mt-6 rounded-lg border border-[#E5E5E4] bg-neutral-50 px-4 py-3 text-center text-xs text-neutral-600">
          <p className="font-medium text-neutral-700">{COPY.admin.demoHint}</p>
          <p className="score-number mt-1 text-neutral-800">
            {DEMO_EMAIL} / {DEMO_PASSWORD}
          </p>
        </div>
      </div>
    </div>
  );
}
