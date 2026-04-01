import { useEffect, useState } from 'react';
import type { Candidate } from '../../types';
import { USE_MOCK_DATA } from '../../constants';
import { fetchScoreOverview, type ScoreOverviewResponse } from '../../api/services/dashboard';
import { ScoreRing } from '../ui/ScoreRing';
import { ScoreBar } from '../ui/ScoreBar';

interface OverallTabContentProps {
  candidateId: string;
  candidate: Candidate;
}

export function OverallTabContent({ candidateId }: OverallTabContentProps) {
  const [overview, setOverview] = useState<ScoreOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          const mock: ScoreOverviewResponse = {
            overall: 23,
            cvPoints: 7,
            essayPoints: 3,
            chatPoints: 1,
            cvLeadershipPoints: 2,
            cvProactivenessPoints: 2,
            cvEnergyPoints: 3,
            essayLeadershipPoints: 1,
            essayProactivenessPoints: 1,
            essayEnergyPoints: 1,
            chatLeadershipPoints: 1,
            chatProactivenessPoints: 0,
            chatEnergyPoints: 0,
            codeforcesScore: 3,
            leetcodeScore: 2,
            untScore: 120,
            ieltsScore: 7.5,
            toeflScore: 90,
            untPoints: 4,
            ieltsPoints: 3,
            toeflPoints: 4,
          };
          if (!cancelled) {
            setOverview(mock);
            setLoading(false);
          }
          return;
        }

        const data = await fetchScoreOverview(candidateId);
        if (!cancelled) {
          setOverview(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Could not load overall scores. Please try again.');
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-white">
        <p className="text-sm text-neutral-600">Loading overview…</p>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-white px-4">
        <p className="text-sm text-[#B91C1C]">{error ?? 'Overview not available.'}</p>
      </div>
    );
  }

  const cvTotal = Math.round(overview.cvPoints ?? 0);
  const essayTotal = Math.round(overview.essayPoints ?? 0);
  const chatTotal = Math.round(overview.chatPoints ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8">
      {/* Overall */}
      <section className="flex flex-wrap items-center gap-6 rounded-2xl border border-[#E5E5E4] bg-white p-5 shadow-sm">
        <ScoreRing score={0} hideProgress displayScore={overview.overall} label="Overall score" />
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Overall score
          </p>
        </div>
      </section>

      {/* Application scores */}
      <section className="space-y-4 rounded-2xl border border-[#E5E5E4] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-neutral-900">Application scores</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'CV',
              total: cvTotal,
              breakdown: [
                { label: 'Leadership', value: overview.cvLeadershipPoints },
                { label: 'Proactiveness', value: overview.cvProactivenessPoints },
                { label: 'Energy', value: overview.cvEnergyPoints },
              ],
            },
            {
              title: 'Essay',
              total: essayTotal,
              breakdown: [
                { label: 'Leadership', value: overview.essayLeadershipPoints },
                { label: 'Proactiveness', value: overview.essayProactivenessPoints },
                { label: 'Energy', value: overview.essayEnergyPoints },
              ],
            },
            {
              title: 'Chatbot',
              total: chatTotal,
              breakdown: [
                { label: 'Leadership', value: overview.chatLeadershipPoints },
                { label: 'Proactiveness', value: overview.chatProactivenessPoints },
                { label: 'Energy', value: overview.chatEnergyPoints },
              ],
            },
          ].map((section) => (
            <div
              key={section.title}
              className="flex h-full flex-col rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] p-4"
            >
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {section.title}
                </p>
                <p className="score-number text-lg font-semibold text-neutral-900">
                  {section.total} 
                </p>
              </div>
              <div className="space-y-2">
                {section.breakdown.map((b) => {
                  const grade = Math.max(0, Math.min(5, b.value ?? 0));
                  let color = '#DC2626'; // low 0–1 -> red
                  if (grade >= 4) {
                    color = '#4B5A00'; // high 4–5 -> inVision lime
                  } else if (grade >= 2) {
                    color = '#F97316'; // mid 2–3 -> orange
                  }
                  return (
                    <ScoreBar
                      key={b.label}
                      label={b.label}
                      score={(grade / 5) * 100}
                      displayScore={Math.round(grade)}
                      color={color}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic scores */}
      <section className="space-y-4 rounded-2xl border border-[#E5E5E4] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900">Academic scores</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">UNT</p>
            <p className="mt-2 text-xs text-neutral-500">Score</p>
            <p className="score-number text-lg font-semibold text-neutral-900">
              {overview.untScore}
            </p>
            <p className="mt-2 text-xs text-neutral-500">Points</p>
            <p className="score-number text-lg font-semibold text-neutral-900">
              {overview.untPoints}
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">IELTS</p>
            <p className="mt-2 text-xs text-neutral-500"> Score</p>
            <p className="score-number text-lg font-semibold text-neutral-900">
              {overview.ieltsScore}
            </p>
            <p className="mt-2 text-xs text-neutral-500">Points</p>
            <p className="score-number text-lg font-semibold text-neutral-900">
              {overview.ieltsPoints}
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">TOEFL</p>
            <p className="mt-2 text-xs text-neutral-500">Score</p>
            <p className="score-number text-lg font-semibold text-neutral-900">
              {overview.toeflScore}
            </p>
            <p className="mt-2 text-xs text-neutral-500">Points</p>
            <p className="score-number text-lg font-semibold text-neutral-900">
              {overview.toeflPoints}
            </p>
          </div>
        </div>
      </section>

      {/* External activity (from overview) */}
      <section className="space-y-4 rounded-2xl border border-[#E5E5E4] bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900">External activity</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] px-4 py-3">
            <span className="text-sm text-neutral-800">Codeforces</span>
            <span className="score-number text-sm font-semibold text-neutral-900">
              {overview.codeforcesScore ?? '-'}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#E5E5E4] bg-[#F7F7F5] px-4 py-3">
            <span className="text-sm text-neutral-800">LeetCode</span>
            <span className="score-number text-sm font-semibold text-neutral-900">
              {overview.leetcodeScore ?? '-'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

