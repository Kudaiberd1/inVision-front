import { useCallback, useEffect, useState } from 'react';
import type { Candidate } from '../types';
import { fetchCandidateById } from '../api/services/candidates';

export function useCandidateDetail(id: string | undefined) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setCandidate(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const c = await fetchCandidateById(id);
      setCandidate(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Not found');
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { candidate, loading, error, reload: load, setCandidate };
}
