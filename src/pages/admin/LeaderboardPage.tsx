import { useMemo, useState } from 'react';
import type { DecisionStatus, FieldOfStudy } from '../../types';
import { COPY, FIELDS_OF_STUDY } from '../../constants';
import { useCandidates } from '../../hooks/useCandidates';
import { LeaderboardTable } from '../../components/candidates/LeaderboardTable';
import { Badge } from '../../components/ui/Badge';

type SortKey = 'score' | 'date';

export function LeaderboardPage() {
  const { candidates, loading, error } = useCandidates();
  const [field, setField] = useState<FieldOfStudy | 'all'>('all');
  const [status, setStatus] = useState<DecisionStatus | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('score');

  const filtered = useMemo(() => {
    let list = [...candidates];
    if (field !== 'all') list = list.filter((c) => c.fieldOfStudy === field);
    if (status !== 'all') list = list.filter((c) => c.status === status);
    list.sort((a, b) => {
      if (sort === 'score') return b.aiScore - a.aiScore;
      return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
    });
    return list;
  }, [candidates, field, sort, status]);

  return (
    <div className="bg-[#F7F7F5] px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{COPY.admin.candidates}</h1>
          <Badge className="border-[#E5E5E4] bg-white text-sm text-neutral-700">
            {filtered.length}
          </Badge>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-xs text-neutral-600">
          <span>{COPY.admin.filterField}</span>
          <select
            value={field}
            onChange={(e) => setField(e.target.value as FieldOfStudy | 'all')}
            className="rounded-lg border border-[#E5E5E4] bg-white px-2 py-1.5 text-sm text-neutral-900"
          >
            <option value="all">{COPY.admin.all}</option>
            {FIELDS_OF_STUDY.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-neutral-600">
          <span>{COPY.admin.filterStatus}</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DecisionStatus | 'all')}
            className="rounded-lg border border-[#E5E5E4] bg-white px-2 py-1.5 text-sm text-neutral-900"
          >
            <option value="all">{COPY.admin.all}</option>
            <option value="pending">{COPY.admin.statusPending}</option>
            <option value="accepted">{COPY.admin.decisionAccepted}</option>
            <option value="rejected">{COPY.admin.decisionRejected}</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-neutral-600">
          <span>{COPY.admin.sortLabel}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-[#E5E5E4] bg-white px-2 py-1.5 text-sm text-neutral-900"
          >
            <option value="score">{COPY.admin.sortScore}</option>
            <option value="date">{COPY.admin.sortDate}</option>
          </select>
        </label>
      </div>

      {loading && <p className="text-neutral-600">Loading…</p>}
      {error && <p className="text-[#F87171]">{error}</p>}
      {!loading && !error && <LeaderboardTable candidates={filtered} />}
    </div>
  );
}
