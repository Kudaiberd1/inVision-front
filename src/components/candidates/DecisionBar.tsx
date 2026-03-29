import { useState } from 'react';
import type { Candidate, DecisionStatus } from '../../types';
import { COPY } from '../../constants';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDecision } from '../../hooks/useDecision';

interface DecisionBarProps {
  candidate: Candidate;
  onStatusChange: (status: DecisionStatus) => void;
  onToast: (msg: string) => void;
}

export function DecisionBar({ candidate, onStatusChange, onToast }: DecisionBarProps) {
  const { accept, reject, loading } = useDecision();
  const [editing, setEditing] = useState(false);
  const status = candidate.status;

  const pill =
    status === 'accepted'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : status === 'rejected'
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-amber-200 bg-amber-50 text-amber-900';

  const locked = (status === 'accepted' || status === 'rejected') && !editing;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E5E4] bg-white/95 px-4 py-4 backdrop-blur md:left-56 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-neutral-900">{candidate.fullName}</span>
          <Badge className={`rounded-full text-xs font-medium ${pill}`}>
            {status === 'accepted'
              ? COPY.admin.decisionAccepted
              : status === 'rejected'
                ? COPY.admin.decisionRejected
                : COPY.admin.statusPending}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {locked ? (
            <>
              <span className="text-sm text-neutral-600">
                {status === 'accepted' ? COPY.admin.decisionAccepted : COPY.admin.decisionRejected}
              </span>
              <button
                type="button"
                className="text-xs font-medium text-[#6B7A12] underline decoration-[#C8E63C] underline-offset-2"
                onClick={() => setEditing(true)}
              >
                {COPY.admin.changeDecision}
              </button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                disabled={loading}
                onClick={async () => {
                  await reject(candidate.id);
                  onStatusChange('rejected');
                  onToast(COPY.admin.toastRejected);
                  setEditing(false);
                }}
              >
                ✗ {COPY.admin.reject}
              </Button>
              <Button
                variant="success"
                disabled={loading}
                onClick={async () => {
                  await accept(candidate.id);
                  onStatusChange('accepted');
                  onToast(COPY.admin.toastAccepted);
                  setEditing(false);
                }}
              >
                ✓ {COPY.admin.accept}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
