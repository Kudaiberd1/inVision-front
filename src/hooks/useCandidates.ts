import { useCallback, useEffect, useState } from 'react';
import { fetchCandidates } from '../api/services/candidates';
import { useCandidateStore } from '../store/useCandidateStore';

export function useCandidates() {
  const setCandidates = useCandidateStore((s) => s.setCandidates);
  const candidates = useCandidateStore((s) => s.candidates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchCandidates();
      setCandidates(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [setCandidates]);

  useEffect(() => {
    void load();
  }, [load]);

  return { candidates, loading, error, reload: load };
}
