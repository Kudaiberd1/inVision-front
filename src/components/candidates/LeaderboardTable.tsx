import type { Candidate } from '../../types';
import { COPY } from '../../constants';
import { CandidateRow } from './CandidateRow';

interface LeaderboardTableProps {
  candidates: Candidate[];
}

export function LeaderboardTable({ candidates }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E5E5E4] bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#E5E5E4] bg-neutral-50/80">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Full Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              {COPY.admin.programColumn}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Submitted
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              AI Score
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => (
            <CandidateRow key={c.id} candidate={c} rank={i + 1} />
          ))}
        </tbody>
      </table>
      {candidates.length === 0 && (
        <p className="p-8 text-center text-neutral-500">No candidates match filters.</p>
      )}
    </div>
  );
}
