import type { Candidate } from '../../types';
import { COPY, CRITERIA, CRITERIA_LABELS } from '../../constants';
import { isPositiveHighlightSentiment } from '../../utils/aiHighlight';
import { candidateCvPdfHref } from '../../utils/candidateDocuments';
import { hasMeaningfulDocumentText, unwrapVerbatimLatexFragment } from '../../utils/latexDocumentText';
import { HighlightSnippets } from '../ui/HighlightSnippets';
import { HighlightText } from '../ui/HighlightText';
import { ScoreRing } from '../ui/ScoreRing';
import { ScoreBar } from '../ui/ScoreBar';
import { ReviewSplitPane } from './ReviewSplitPane';
import { ThumbsUp, AlertTriangle } from 'lucide-react';

interface CVReviewPanelProps {
  candidate: Candidate;
}

export function CVReviewPanel({ candidate }: CVReviewPanelProps) {
  const { cvReview, cvFullText } = candidate;
  const cvPdfHref = candidateCvPdfHref(candidate);
  const cvPlain = unwrapVerbatimLatexFragment(cvFullText);
  const hasText = hasMeaningfulDocumentText(cvFullText);

  const hasHighlights = cvReview.highlights.length > 0;

  const gradeFor = (s: number): number => {
    if (s <= 0) return 0;
    const g = Math.ceil((s / 100) * 3);
    return Math.max(0, Math.min(3, g));
  };

  const grades = {
    leadership: gradeFor(cvReview.criteriaScores.leadership),
    proactiveness: gradeFor(cvReview.criteriaScores.proactiveness),
    energy: gradeFor(cvReview.criteriaScores.energy),
  };

  const totalGrade = grades.leadership + grades.proactiveness + grades.energy;

  const leftPane = hasText ? (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {cvPdfHref && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E5E5E4] bg-neutral-50/80 px-4 py-3">
          <p className="text-sm text-neutral-600">{COPY.admin.originalPdfLabel}</p>
          <a
            href={cvPdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-[#C8E63C] px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-[#A8C420]"
          >
            {COPY.admin.openCvPdf}
          </a>
        </div>
      )}
      <HighlightText fullText={cvPlain} highlights={cvReview.highlights} />
    </div>
  ) : hasHighlights ? (
    <div className="space-y-6">
      {cvPdfHref && (
        <div className="rounded-xl border border-[#E5E5E4] bg-white p-4">
          <p className="text-sm text-neutral-600">
            No extracted CV text (or only a PDF). Open the PDF for the full document; optional model
            excerpts are below.
          </p>
          <a
            href={cvPdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded-lg bg-[#C8E63C] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#A8C420]"
          >
            {COPY.admin.openCvPdf}
          </a>
        </div>
      )}
      <details className="group rounded-xl border border-[#E5E5E4] bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-neutral-800 marker:text-neutral-500">
          Quoted excerpts (PDF only)
        </summary>
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <HighlightSnippets highlights={cvReview.highlights} showHeading={false} />
        </div>
      </details>
    </div>
  ) : cvPdfHref ? (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#E5E5E4] bg-neutral-50/80 p-10 text-center">
      <p className="text-sm text-neutral-600">
        CV is stored as a PDF. Open it in a new tab to review alongside the AI summary.
      </p>
      <a
        href={cvPdfHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-lg bg-[#C8E63C] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#A8C420]"
      >
        {COPY.admin.openCvPdf}
      </a>
    </div>
  ) : (
    <p className="text-sm text-neutral-500">No CV text or PDF link available.</p>
  );

  return (
    <ReviewSplitPane
      left={leftPane}
      right={
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-6">
            <ScoreRing
              score={(totalGrade / 9) * 100}
              label="CV (0–9)"
              displayScore={totalGrade}
            />
            <div className="min-w-[160px] flex-1 space-y-3">
              {CRITERIA.map((c) => (
                <ScoreBar
                  key={c}
                  label={CRITERIA_LABELS[c] ?? c}
                  score={(grades[c] / 3) * 100}
                  displayScore={grades[c]}
                />
              ))}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-neutral-700">{cvReview.summary}</p>
          {hasText && cvReview.highlights.length > 0 && (
            <p className="text-xs leading-relaxed text-neutral-500">
              Lime highlights in the CV = strong evidence. Yellow = worth a closer look. Hover a highlight for
              the model&apos;s note.
            </p>
          )}
          <ul className="space-y-3">
            {cvReview.highlights.map((h, i) => {
              const positive = isPositiveHighlightSentiment(h.sentiment);
              return (
                <li
                  key={`${i}-${h.text.slice(0, 12)}`}
                  className={`flex gap-3 rounded-lg border p-3 text-sm ${
                    positive
                      ? 'border-lime-200/80 bg-lime-50/35'
                      : 'border-amber-200/80 bg-amber-50/35'
                  }`}
                >
                  {positive ? (
                    <ThumbsUp className="mt-1 h-4 w-4 shrink-0 text-lime-700" aria-hidden />
                  ) : (
                    <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                  )}
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="whitespace-pre-wrap font-medium leading-snug text-neutral-900">{h.text}</p>
                    <p className="text-xs leading-relaxed text-neutral-600">{h.reason}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      }
    />
  );
}
