import { useCallback, useState } from 'react';
import type { DecisionStatus } from '../types';
import { acceptCandidate, rejectCandidate } from '../api/services/decisions';
import { useCandidateStore } from '../store/useCandidateStore';

export function useDecision() {
  const updateCandidateStatus = useCandidateStore((s) => s.updateCandidateStatus);
  const [loading, setLoading] = useState(false);

  const accept = useCallback(
    async (id: string): Promise<DecisionStatus> => {
      setLoading(true);
      try {
        const { status } = await acceptCandidate(id);
        updateCandidateStatus(id, status);
        return status;
      } finally {
        setLoading(false);
      }
    },
    [updateCandidateStatus],
  );

  const reject = useCallback(
    async (id: string): Promise<DecisionStatus> => {
      setLoading(true);
      try {
        const { status } = await rejectCandidate(id);
        updateCandidateStatus(id, status);
        return status;
      } finally {
        setLoading(false);
      }
    },
    [updateCandidateStatus],
  );

  return { accept, reject, loading };
}
