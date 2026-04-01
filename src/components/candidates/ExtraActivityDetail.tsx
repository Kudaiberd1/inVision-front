import { useEffect, useState } from 'react';
import type { ExtraActivity, ExtraPlatform } from '../../types';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../constants';
import { ScoreRing } from '../ui/ScoreRing';
import { Button } from '../ui/Button';
import { fetchCodingReview } from '../../api/services/dashboard';

interface ExtraActivityDetailProps {
  candidateId: string;
  activity: ExtraActivity;
  onBack: () => void;
}

interface CodeforcesReview {
  platform: 'codeforces';
  submissionsLastYear?: number;
  proactiveness?: { score: number; reason?: string };
  skill?: {
    score?: number;
    breakdown?: {
      rating?: { value?: number; score?: number; reason?: string };
      solved_problems?: { value?: number; score?: number; reason?: string };
    };
  };
  finalScore: number;
}

interface LeetcodeReview {
  platform: 'leetcode';
  submissionsLastYear?: number;
  proactiveness?: { score: number; reason?: string };
  skill?: {
    score?: number;
    breakdown?: {
      difficulty?: {
        value?: {
          easy?: number;
          medium?: number;
          hard?: number;
        };
        score?: number;
        reason?: string;
      };
      solved_problems?: { value?: number; score?: number; reason?: string };
    };
  };
  finalScore: number;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-[140px] rounded-lg border border-[#E5E5E4] bg-neutral-50 px-4 py-3">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="score-number mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function renderPlatformStats(activity: ExtraActivity) {
  const stats = activity.stats;

  if (stats.platform === 'linkedin') {
    return (
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Headline</p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{stats.headline}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Summary</p>
          <p className="mt-1 text-sm text-neutral-700">{stats.summary}</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <StatCard label="Connections" value={stats.connections} />
          <div className="min-w-[220px] space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Skills</p>
            <div className="flex flex-wrap gap-2">
              {stats.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#C8E63C]/40 bg-[#C8E63C]/10 px-2 py-0.5 text-xs font-medium text-[#4B5A00]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-[220px] space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Certifications
            </p>
            <ul className="space-y-1 text-sm text-neutral-700">
              {stats.certifications.map((c) => (
                <li key={c} className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C8E63C]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (stats.platform === 'github') {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <StatCard label="Repos" value={stats.publicRepos} />
          <StatCard label="Followers" value={stats.followers} />
          <StatCard label="Stars" value={stats.totalStars} />
          <StatCard label="Commits (12m)" value={stats.totalCommits} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Top languages
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {stats.topLanguages.map((lang) => (
              <span
                key={lang}
                className="rounded-full border border-[#C8E63C]/40 bg-[#C8E63C]/10 px-2 py-0.5 text-xs font-medium text-[#4B5A00]"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function scoreColor(_platform: ExtraPlatform, score: number) {
  if (score >= 70) return '#16A34A';
  if (score >= 50) return '#F59E0B';
  return '#DC2626';
}

const DIMENSION_COLORS = {
  skill: '#4B5A00', // lime-ish accent from inVision U palette
  proactiveness: '#4338CA', // indigo
} as const;

function badgeColor(points: number) {
  if (points >= 4) return '#16A34A'; // high
  if (points >= 2) return '#4B5563'; // mid (gray)
  return '#DC2626'; // low
}

export function ExtraActivityDetail({ candidateId, activity, onBack }: ExtraActivityDetailProps) {
  const [showAiModal, setShowAiModal] = useState(false);
  const [codeforcesReview, setCodeforcesReview] = useState<CodeforcesReview | null>(null);
  const [leetcodeReview, setLeetcodeReview] = useState<LeetcodeReview | null>(null);
  const platformLabel = PLATFORM_LABELS[activity.platform];
  const platformColor = PLATFORM_COLORS[activity.platform];
  const score =
    activity.platform === 'codeforces' && codeforcesReview
      ? codeforcesReview.finalScore
      : activity.platform === 'leetcode' && leetcodeReview
        ? leetcodeReview.finalScore
        : activity.aiScore;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (activity.platform !== 'codeforces' && activity.platform !== 'leetcode') return;

      try {
        const data = await fetchCodingReview(candidateId);
        if (cancelled) return;
        if (data.codeforces && data.codeforces.platform === 'codeforces') {
          setCodeforcesReview(data.codeforces as CodeforcesReview);
        }
        if (data.leetcode && data.leetcode.platform === 'leetcode') {
          setLeetcodeReview(data.leetcode as LeetcodeReview);
        }
      } catch {
        // ignore; keep fallback scores
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [activity.platform, candidateId]);

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-4 flex items-center gap-1 text-sm text-neutral-500">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium uppercase tracking-widest text-neutral-500 hover:text-neutral-800"
        >
          External activity
        </button>
        <span className="text-neutral-400">{'>'}</span>
        <span className="text-sm font-medium text-neutral-900">{platformLabel}</span>
      </div>

      <div className="mb-6 flex flex-wrap items-start gap-6 rounded-2xl border border-[#E5E5E4] bg-white px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-1 items-start gap-3">
          <div
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: platformColor }}
          >
            {platformLabel[0]}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-neutral-900">{platformLabel}</h2>
            <p className="text-sm text-neutral-600">@{activity.handle}</p>
            <a
              href={activity.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#4B5A00] underline-offset-2 hover:underline"
            >
              Open profile ↗
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Score
              </p>
              <p className="score-number text-xl font-semibold text-neutral-900">{score}</p>
            </div>
          </div>
          <Button
            type="button"
            className="rounded-full bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-[#A8C420]"
            onClick={() => setShowAiModal(true)}
          >
            See details
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E5E4] bg-white px-4 py-5 md:px-6 md:py-6">
        {renderPlatformStats(activity)}

        {activity.stats.chartImageUrl && (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Activity chart
            </p>
            <img
              src={activity.stats.chartImageUrl}
              alt={`${platformLabel} activity chart`}
              className="mt-3 w-full rounded-xl border border-[#E5E5E4]"
            />
          </div>
        )}

        {showAiModal && (
          <div className="absolute inset-0 z-10 flex items-start justify-center rounded-2xl bg-black/30 p-4 pt-8">
            <div className="w-full max-w-2xl rounded-2xl border border-[#E5E5E4] bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Score details — {platformLabel}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="text-lg text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6 text-neutral-900">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <div className="flex justify-center md:justify-start">
                    <div className="flex items-center justify-center rounded-full bg-neutral-50 p-4 border border-[#E5E5E4]">
                      <ScoreRing
                        score={score}
                        size={120}
                        color={scoreColor(activity.platform, score)}
                        label=""
                        hideProgress
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      {[
                        {
                          key: 'skill' as const,
                          label: 'Skill',
                          description: 'Rating and solved problems combined into a single signal.',
                          value:
                            activity.platform === 'codeforces'
                              ? codeforcesReview?.skill?.score ?? null
                              : activity.platform === 'leetcode'
                                ? leetcodeReview?.skill?.score ?? null
                                : null,
                        },
                        {
                          key: 'proactiveness' as const,
                          label: 'Proactiveness',
                          description: 'How consistently the candidate submits solutions over the last year.',
                          value:
                            activity.platform === 'codeforces'
                              ? codeforcesReview?.proactiveness?.score ?? null
                              : activity.platform === 'leetcode'
                                ? leetcodeReview?.proactiveness?.score ?? null
                                : null,
                        },
                      ].map((dim) => (
                        <div
                          key={dim.key}
                          className="flex items-center justify-between rounded-xl px-3 py-2"
                          style={{ backgroundColor: `${DIMENSION_COLORS[dim.key]}14` }}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: DIMENSION_COLORS[dim.key] }}
                              />
                              <span
                                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                                style={{ color: DIMENSION_COLORS[dim.key] }}
                              >
                                {dim.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400">{dim.description}</p>
                          </div>
                          <div
                            className="font-mono text-xl font-semibold"
                            style={{ color: DIMENSION_COLORS[dim.key] }}
                          >
                            {dim.value !== null ? Math.round(dim.value) : '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Final score =
                      <span style={{ color: DIMENSION_COLORS.skill }}> Skill</span> +
                      <span style={{ color: DIMENSION_COLORS.proactiveness }}> Proactiveness</span>{' '}/2
                    </p>
                  </div>
                </div>

                {activity.platform === 'codeforces' && codeforcesReview && (
                  <div className="space-y-4">
                    {[
                      {
                        key: 'skill' as const,
                        label: 'Skill',
                        value: codeforcesReview.skill?.score ?? null,
                        rows: [
                          codeforcesReview.skill?.breakdown?.rating && {
                            label: `Rating: ${codeforcesReview.skill.breakdown.rating.value ?? ''}`,
                            score: codeforcesReview.skill.breakdown.rating.score ?? 0,
                            note: codeforcesReview.skill.breakdown.rating.reason ?? '',
                          },
                          codeforcesReview.skill?.breakdown?.solved_problems && {
                            label: `Solved: ${
                              codeforcesReview.skill.breakdown.solved_problems.value ?? ''
                            }`,
                            score: codeforcesReview.skill.breakdown.solved_problems.score ?? 0,
                            note: codeforcesReview.skill.breakdown.solved_problems.reason ?? '',
                          },
                        ].filter(Boolean) as { label: string; score: number; note: string }[],
                      },
                      {
                        key: 'proactiveness' as const,
                        label: 'Proactiveness',
                        value: codeforcesReview.proactiveness?.score ?? null,
                        rows: codeforcesReview.proactiveness
                          ? [
                              {
                                label: `Submissions last year: ${codeforcesReview.submissionsLastYear ?? 0}`,
                                score: codeforcesReview.proactiveness.score,
                                note: codeforcesReview.proactiveness.reason ?? '',
                              },
                            ]
                          : [],
                      },
                    ].map((dim) => (
                      <div
                        key={dim.key}
                        className="rounded-xl border border-[#E5E5E4] bg-neutral-50"
                      >
                        <div
                          className="flex items-center justify-between border-l-[3px] px-4 py-3"
                          style={{ borderLeftColor: DIMENSION_COLORS[dim.key] }}
                        >
                          <span
                            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                            style={{ color: DIMENSION_COLORS[dim.key] }}
                          >
                            {dim.label}
                          </span>
                          <span
                            className="font-mono text-lg font-semibold"
                            style={{ color: DIMENSION_COLORS[dim.key] }}
                          >
                            {dim.value !== null ? Math.round(dim.value) : '—'}
                          </span>
                        </div>
                        {dim.rows.length > 0 ? (
                          <div className="divide-y divide-neutral-200">
                            {dim.rows.map((row) => (
                              <div key={row.label} className="flex gap-3 px-4 py-3 text-sm">
                                <div
                                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E5E4] bg-white font-mono text-sm font-semibold"
                                >
                                  <span
                                    style={{
                                      color: badgeColor(row.score),
                                    }}
                                  >
                                    {Math.round(row.score)}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="font-mono text-[12px] text-neutral-900">
                                    {row.label}
                                  </p>
                                  {row.note && (
                                    <p className="text-[11px] text-neutral-500">{row.note}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-[11px] text-neutral-500">
                            Not evaluated for this platform.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activity.platform === 'leetcode' && leetcodeReview && (
                  <div className="space-y-4">
                    {[
                      {
                        key: 'skill' as const,
                        label: 'Skill',
                        value: leetcodeReview.skill?.score ?? null,
                        rows: [
                          leetcodeReview.skill?.breakdown?.difficulty && {
                            label: `Solved (E/M/H): ${
                              leetcodeReview.skill.breakdown.difficulty.value?.easy ?? 0
                            }/${leetcodeReview.skill.breakdown.difficulty.value?.medium ?? 0}/${
                              leetcodeReview.skill.breakdown.difficulty.value?.hard ?? 0
                            }`,
                            score: leetcodeReview.skill.breakdown.difficulty.score ?? 0,
                            note: leetcodeReview.skill.breakdown.difficulty.reason ?? '',
                          },
                          leetcodeReview.skill?.breakdown?.solved_problems && {
                            label: `Solved: ${
                              leetcodeReview.skill.breakdown.solved_problems.value ?? ''
                            }`,
                            score: leetcodeReview.skill.breakdown.solved_problems.score ?? 0,
                            note: leetcodeReview.skill.breakdown.solved_problems.reason ?? '',
                          },
                        ].filter(Boolean) as { label: string; score: number; note: string }[],
                      },
                      {
                        key: 'proactiveness' as const,
                        label: 'Proactiveness',
                        value: leetcodeReview.proactiveness?.score ?? null,
                        rows: leetcodeReview.proactiveness
                          ? [
                              {
                                label: `Submissions last year: ${leetcodeReview.submissionsLastYear ?? 0}`,
                                score: leetcodeReview.proactiveness.score,
                                note: leetcodeReview.proactiveness.reason ?? '',
                              },
                            ]
                          : [],
                      },
                    ].map((dim) => (
                      <div
                        key={dim.key}
                        className="rounded-xl border border-[#E5E5E4] bg-neutral-50"
                      >
                        <div
                          className="flex items-center justify-between border-l-[3px] px-4 py-3"
                          style={{ borderLeftColor: DIMENSION_COLORS[dim.key] }}
                        >
                          <span
                            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                            style={{ color: DIMENSION_COLORS[dim.key] }}
                          >
                            {dim.label}
                          </span>
                          <span
                            className="font-mono text-lg font-semibold"
                            style={{ color: DIMENSION_COLORS[dim.key] }}
                          >
                            {dim.value !== null ? Math.round(dim.value) : '—'}
                          </span>
                        </div>
                        {dim.rows.length > 0 ? (
                          <div className="divide-y divide-neutral-200">
                            {dim.rows.map((row) => (
                              <div key={row.label} className="flex gap-3 px-4 py-3 text-sm">
                                <div
                                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E5E4] bg-white font-mono text-sm font-semibold"
                                >
                                  <span
                                    style={{
                                      color: badgeColor(row.score),
                                    }}
                                  >
                                    {Math.round(row.score)}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="font-mono text-[12px] text-neutral-900">
                                    {row.label}
                                  </p>
                                  {row.note && (
                                    <p className="text-[11px] text-neutral-500">{row.note}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-[11px] text-neutral-500">
                            Not evaluated for this platform.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activity.platform !== 'codeforces' && activity.platform !== 'leetcode' && (
                  <p className="text-[11px] text-neutral-500">
                    Detailed dimension breakdown is not yet available for this platform. You can
                    still use the overall score as a quick signal.
                  </p>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

