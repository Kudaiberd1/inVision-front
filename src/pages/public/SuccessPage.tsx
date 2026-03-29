import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { COPY, ROUTES } from '../../constants';
import { useApplicationStore } from '../../store/useApplicationStore';
import { Button } from '../../components/ui/Button';

export function SuccessPage() {
  const referenceNumber = useApplicationStore((s) => s.referenceNumber);

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-[#F7F7F5] px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#C8E63C] bg-[#C8E63C]/15">
          <Check className="h-12 w-12 text-[#6B7A12]" strokeWidth={2.5} aria-hidden />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">{COPY.success.title}</h1>
        <p className="mt-4 text-neutral-600">{COPY.success.body}</p>
        <p className="mt-6 text-sm text-neutral-500">{COPY.success.refLabel}</p>
        <p className="score-number mt-2 inline-block rounded-lg bg-[#C8E63C]/20 px-4 py-2 text-lg font-medium text-[#5A6610]">
          {referenceNumber || 'INV-PENDING'}
        </p>
        <Link to={ROUTES.HOME} className="mt-10 inline-block">
          <Button variant="publicPrimary">{COPY.success.home}</Button>
        </Link>
      </div>
    </div>
  );
}
