import type { Candidate, Criteria } from '../../types';
import { CRITERIA, CRITERIA_LABELS } from '../../constants';
import { ScoreRing } from '../ui/ScoreRing';
import { ScoreBar } from '../ui/ScoreBar';
import { ReviewSplitPane } from './ReviewSplitPane';

interface ChatbotReviewPanelProps {
  candidate: Candidate;
}

export function ChatbotReviewPanel({ candidate }: ChatbotReviewPanelProps) {
  const { chatbotAnalysis } = candidate;

  const byCriteria = CRITERIA.map((c) => ({
    criteria: c,
    label: CRITERIA_LABELS[c] ?? c,
    items: chatbotAnalysis.conversations.filter((m) => m.criteria === c),
  }));

  const totalTurns = chatbotAnalysis.conversations.length;

  return (
    <ReviewSplitPane
      left={
        <div className="flex h-[min(560px,62vh)] min-h-[320px] max-h-[720px] flex-col overflow-hidden rounded-xl border border-[#E5E5E4] bg-[#F4F4F3] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <header className="shrink-0 border-b border-[#E5E5E4] bg-white px-4 py-3">
            <h3 className="text-sm font-semibold text-neutral-900">Interview chat</h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Grouped by question type — scroll to read all sections.
            </p>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            {totalTurns === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">No chat turns recorded.</p>
            ) : (
              <div className="space-y-10">
                {byCriteria.map((block) => (
                  <section key={block.criteria}>
                    <h4 className="mb-4 border-b border-[#E5E5E4] pb-2 text-xs font-bold uppercase tracking-widest text-[#6B7A12]">
                      {block.label}:
                    </h4>
                    <div className="space-y-4">
                      {block.items.length === 0 ? (
                        <p className="text-xs text-neutral-500">No turns in this section.</p>
                      ) : (
                        block.items.map((m, idx) => (
                          <div key={`${block.criteria}-${m.questionIndex}-${idx}`} className="space-y-2">
                            <div className="flex justify-start">
                              <div className="max-w-[min(100%,28rem)] rounded-2xl rounded-tl-md border border-[#E0E0DE] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-neutral-800 shadow-sm">
                                <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                                  Bot · Q{m.questionIndex}
                                </span>
                                <p className="whitespace-pre-wrap">{m.question}</p>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="max-w-[min(100%,28rem)] rounded-2xl rounded-tr-md border border-[#C8E63C]/40 bg-[#EEF6C8] px-3.5 py-2.5 text-sm leading-relaxed text-neutral-900 shadow-sm">
                                <span className="mb-1.5 block text-right text-[10px] font-medium uppercase tracking-wide text-[#5A6610]/80">
                                  Candidate
                                </span>
                                <p className="whitespace-pre-wrap text-right">{m.answer}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      right={
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-6">
            <ScoreRing score={chatbotAnalysis.overallScore} label="Chatbot" />
            <div className="min-w-[160px] flex-1 space-y-3">
              {CRITERIA.map((c) => (
                <ScoreBar
                  key={c}
                  label={CRITERIA_LABELS[c] ?? c}
                  score={chatbotAnalysis.criteriaScores[c]}
                />
              ))}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-neutral-700">{chatbotAnalysis.summary}</p>
          <div className="space-y-4">
            {CRITERIA.map((c) => (
              <CritPara key={c} c={c} text={chatbotAnalysis.criteriaSummaries[c]} />
            ))}
          </div>
        </div>
      }
    />
  );
}

function CritPara({ c, text }: { c: Criteria; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {CRITERIA_LABELS[c]}
      </p>
      <p className="mt-1 text-sm text-neutral-700">{text}</p>
    </div>
  );
}
