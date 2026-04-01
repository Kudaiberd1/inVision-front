import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { DecisionStatus } from '../../types';
import { COPY, ROUTES } from '../../constants';
import { useCandidateDetail } from '../../hooks/useCandidateDetail';
import { CVReviewPanel } from '../../components/candidates/CVReviewPanel';
import { EssayReviewPanel } from '../../components/candidates/EssayReviewPanel';
import { ChatbotReviewPanel } from '../../components/candidates/ChatbotReviewPanel';
import { CandidateDetailsPanel } from '../../components/candidates/CandidateDetailsPanel';
import { OverallTabContent } from '../../components/candidates/OverallTabContent';
import ExtraTabContent from '../../components/candidates/ExtraTabContent';
import { DecisionBar } from '../../components/candidates/DecisionBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const SECTIONS = [
  { key: 'details', label: COPY.admin.sections.details },
  { key: 'cv', label: COPY.admin.sections.cv },
  { key: 'essay', label: COPY.admin.sections.essay },
  { key: 'chat', label: COPY.admin.sections.chatbot },
  { key: 'extra', label: COPY.admin.sections.extra },
  { key: 'overall', label: COPY.admin.sections.overall },
] as const;

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { candidate, loading, error, setCandidate } = useCandidateDetail(id);
  const [section, setSection] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-[#F7F7F5] p-8">
        <p className="text-neutral-600">Loading…</p>
      </div>
    );
  }
  if (error || !candidate) {
    return (
      <div className="bg-[#F7F7F5] p-8">
        <p className="text-[#F87171]">{error ?? 'Not found'}</p>
        <Link to={ROUTES.ADMIN} className="mt-4 inline-block font-medium text-[#6B7A12]">
          ← {COPY.admin.candidates}
        </Link>
      </div>
    );
  }


  return (
    <div className="bg-[#F7F7F5] pb-32">
      {toast && (
        <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-800 shadow-md">
          {toast}
        </div>
      )}

      <div className="border-b border-[#E5E5E4] bg-white px-4 py-4 md:px-8">
        <Link
          to={ROUTES.ADMIN}
          className="mb-4 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {COPY.admin.back}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
            {candidate.fullName}
          </h1>
          <span className="text-sm text-neutral-500">{candidate.fieldOfStudy}</span>
          <Badge className={`score-number rounded-full text-sm font-medium`}>
            {candidate.aiScore}
          </Badge>
        </div>
      </div>

      <div className="sticky top-0 z-10 border-b border-[#E5E5E4] bg-white/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="flex flex-wrap items-center gap-2 gap-y-2">
          {SECTIONS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${section === i
                  ? 'bg-[#C8E63C]/20 text-neutral-900 ring-1 ring-[#C8E63C]/40'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
            >
              {s.label}
            </button>
          ))}
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <span className="text-xs text-neutral-500">
              {section + 1} / {SECTIONS.length}
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-[50vh] border-b border-[#E5E5E4] bg-white">
        {section === 0 && <CandidateDetailsPanel candidate={candidate} />}
        {section === 1 && <CVReviewPanel candidate={candidate} />}
        {section === 2 && <EssayReviewPanel candidate={candidate} />}
        {section === 3 && <ChatbotReviewPanel candidate={candidate} />}
        {section === 4 && <ExtraTabContent candidateId={candidate.id} />}
        {section === 5 && <OverallTabContent candidateId={candidate.id} candidate={candidate} />}
      </div>

      <div className="mx-auto flex max-w-6xl justify-between gap-4 px-4 py-6 md:px-8">
        <Button
          variant="secondary"
          disabled={section === 0}
          onClick={() => setSection((s) => Math.max(0, s - 1))}
        >
          {COPY.admin.previous}
        </Button>
        <Button
          variant="secondary"
          disabled={section >= SECTIONS.length - 1}
          onClick={() => setSection((s) => Math.min(SECTIONS.length - 1, s + 1))}
        >
          {COPY.admin.next}
        </Button>
      </div>

      <DecisionBar
        candidate={candidate}
        onStatusChange={(status: DecisionStatus) => {
          setCandidate({ ...candidate, status });
        }}
        onToast={(msg) => {
          setToast(msg);
          window.setTimeout(() => setToast(null), 3200);
        }}
      />
    </div>
  );
}
