import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import type { Candidate } from '../../types';
import { ROUTES, COPY } from '../../constants';
import { scorePillClass } from '../../utils/scoring';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CandidateRowProps {
  candidate: Candidate;
  rank: number;
}

function statusBadge(status: Candidate['status']) {
  if (status === 'accepted') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  }
  if (status === 'rejected') {
    return 'border-red-200 bg-red-50 text-red-700';
  }
  return 'border-amber-200 bg-amber-50 text-amber-900';
}

export function CandidateRow({ candidate, rank }: CandidateRowProps) {
  return (
    <tr className="group cursor-pointer border-b border-[#E5E5E4] transition-colors duration-150 hover:bg-neutral-50">
      <td className="relative px-4 py-4 pl-5">
        <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-[#C8E63C] opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="score-number text-sm text-neutral-500">{rank}</span>
      </td>
      <td className="px-4 py-4 font-medium text-neutral-900">{candidate.fullName}</td>
      <td className="px-4 py-4 text-sm text-neutral-600">{candidate.program.category}</td>
      <td className="px-4 py-4 text-sm text-neutral-500">
        {format(new Date(candidate.submissionDate), 'MMM d, yyyy')}
      </td>
      <td className="px-4 py-4">
        <Badge className={`score-number rounded-full text-sm font-medium ${scorePillClass(candidate.aiScore)}`}>
          {candidate.aiScore}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <Badge className={`rounded-full text-xs font-medium ${statusBadge(candidate.status)}`}>
          {candidate.status === 'pending'
            ? COPY.admin.statusPending
            : candidate.status === 'accepted'
              ? COPY.admin.decisionAccepted
              : COPY.admin.decisionRejected}
        </Badge>
      </td>
      <td className="px-4 py-4 text-right">
        <Link to={ROUTES.ADMIN_CANDIDATE(candidate.id)}>
          <Button variant="secondary" className="text-xs">
            {COPY.admin.review} →
          </Button>
        </Link>
      </td>
    </tr>
  );
}
