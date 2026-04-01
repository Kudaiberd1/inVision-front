import type { Candidate } from '../../types';
import { Badge } from '../ui/Badge';

interface CandidateDetailsPanelProps {
  candidate: Candidate;
}

function ensureProfileUrl(platform: 'codeforces' | 'leetcode' | 'github' | 'linkedin', value: string) {
  const v = value.trim();
  if (!v) return '';
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  if (platform === 'codeforces') return `https://codeforces.com/profile/${v}`;
  if (platform === 'leetcode') return `https://leetcode.com/${v}`;
  if (platform === 'github') return `https://github.com/${v}`;
  if (platform === 'linkedin') return `https://www.linkedin.com/in/${v}`;
  return v;
}

export function CandidateDetailsPanel({ candidate }: CandidateDetailsPanelProps) {
  const createdDate = candidate.submissionDate
    ? new Date(candidate.submissionDate).toLocaleString()
    : '';
  const hasUnt = candidate.untScore != null;
  const hasIelts = candidate.ielts != null;
  const hasToefl = candidate.toefl != null;
  const hasAnyTestScore = hasUnt || hasIelts || hasToefl;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
        <section className="space-y-4 rounded-2xl border border-[#E5E5E4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-neutral-900">Applicant details</h2>
            <Badge className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
              {candidate.status.toUpperCase()}
            </Badge>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Full name</dt>
              <dd className="mt-1 text-sm text-neutral-900">{candidate.fullName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Email</dt>
              <dd className="mt-1 text-sm text-neutral-900">{candidate.email}</dd>
            </div>
            {candidate.phone && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Phone</dt>
                <dd className="mt-1 text-sm text-neutral-900">{candidate.phone}</dd>
              </div>
            )}
            {candidate.dateOfBirth && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Date of birth
                </dt>
                <dd className="mt-1 text-sm text-neutral-900">{candidate.dateOfBirth}</dd>
              </div>
            )}
            {candidate.city && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">City</dt>
                <dd className="mt-1 text-sm text-neutral-900">{candidate.city}</dd>
              </div>
            )}
            {candidate.school && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  School / University
                </dt>
                <dd className="mt-1 text-sm text-neutral-900">{candidate.school}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Field of study
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">{candidate.fieldOfStudy}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Submitted at
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">{createdDate}</dd>
            </div>
          </dl>
        </section>

        <section className="space-y-4 rounded-2xl border border-[#E5E5E4] bg-white p-5 shadow-sm">
          {hasAnyTestScore && (
            <>
              <h2 className="text-sm font-semibold text-neutral-900">Test scores</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {hasUnt && (
                  <div className="rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] p-3">
                    <p className="text-xs font-medium text-neutral-600">UNT</p>
                    <p
                      className={`score-number mt-1 text-xl font-semibold ${
                        (candidate.untScore ?? 0) < 80 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      }`}
                    >
                      {candidate.untScore}
                    </p>
                  </div>
                )}
                {hasIelts && (
                  <div className="rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] p-3">
                    <p className="text-xs font-medium text-neutral-600">IELTS</p>
                    <p
                      className={`score-number mt-1 text-xl font-semibold ${
                        (candidate.ielts ?? 0) < 6 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      }`}
                    >
                      {candidate.ielts}
                    </p>
                  </div>
                )}
                {hasToefl && (
                  <div className="rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] p-3">
                    <p className="text-xs font-medium text-neutral-600">TOEFL</p>
                    <p
                      className={`score-number mt-1 text-xl font-semibold ${
                        (candidate.toefl ?? 0) < 60 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      }`}
                    >
                      {candidate.toefl}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="pt-2">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              External profiles
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.codeforces && (
                <a
                  href={ensureProfileUrl('codeforces', candidate.codeforces)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#E5E5E4] bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800 hover:border-[#C8E63C] hover:bg-white"
                >
                  Codeforces
                </a>
              )}
              {candidate.leetcode && (
                <a
                  href={ensureProfileUrl('leetcode', candidate.leetcode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#E5E5E4] bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800 hover:border-[#C8E63C] hover:bg-white"
                >
                  LeetCode
                </a>
              )}
              {candidate.github && (
                <a
                  href={ensureProfileUrl('github', candidate.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#E5E5E4] bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800 hover:border-[#C8E63C] hover:bg-white"
                >
                  GitHub
                </a>
              )}
              {candidate.linkedin && (
                <a
                  href={ensureProfileUrl('linkedin', candidate.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#E5E5E4] bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800 hover:border-[#C8E63C] hover:bg-white"
                >
                  LinkedIn
                </a>
              )}
              {!candidate.codeforces &&
                !candidate.leetcode &&
                !candidate.github &&
                !candidate.linkedin && (
                  <p className="text-xs text-neutral-500">No external profiles submitted.</p>
                )}
            </div>
          </div>

          <div className="pt-2">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Original uploads
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.cvPdfUrl && (
                <a
                  href={candidate.cvPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#E5E5E4] bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800 hover:bg-white"
                >
                  CV
                </a>
              )}
              {candidate.essayPdfUrl && (
                <a
                  href={candidate.essayPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#E5E5E4] bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800 hover:bg-white"
                >
                  Motivation essay
                </a>
              )}
              {candidate.videoUrl && (
                <a
                  href={candidate.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#E5E5E4] bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800 hover:bg-white"
                >
                  Intro video
                </a>
              )}
              {!candidate.cvPdfUrl && !candidate.essayPdfUrl && !candidate.videoUrl && (
                <p className="text-xs text-neutral-500">No document URLs available.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

