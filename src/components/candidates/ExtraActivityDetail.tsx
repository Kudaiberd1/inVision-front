import { useState } from 'react';
import type { ExtraActivity, ExtraPlatform } from '../../types';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../constants';
import { ScoreRing } from '../ui/ScoreRing';
import { ScoreBar } from '../ui/ScoreBar';
import { Button } from '../ui/Button';

interface ExtraActivityDetailProps {
  activity: ExtraActivity;
  onBack: () => void;
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

function scoreColor(platform: ExtraPlatform, score: number) {
  if (score >= 70) return '#16A34A';
  if (score >= 50) return '#F59E0B';
  return '#DC2626';
}

export function ExtraActivityDetail({ activity, onBack }: ExtraActivityDetailProps) {
  const [showAiModal, setShowAiModal] = useState(false);
  const platformLabel = PLATFORM_LABELS[activity.platform];
  const platformColor = PLATFORM_COLORS[activity.platform];
  const score = activity.aiScore;

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
                AI score
              </p>
              <p className="score-number text-xl font-semibold text-neutral-900">{score}</p>
            </div>
          </div>
          <Button
            type="button"
            className="rounded-full bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-[#A8C420]"
            onClick={() => setShowAiModal(true)}
          >
            See AI score
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
          <div className="absolute inset-0 z-10 flex items-start justify-center rounded-2xl bg-black/30 p-4 pt-10">
            <div className="w-full max-w-lg rounded-xl border border-[#E5E5E4] bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-neutral-900">
                  AI analysis — {platformLabel}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="text-lg text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-4">
                <ScoreRing
                  score={score}
                  size={72}
                  color={scoreColor(activity.platform, score)}
                  label="AI score"
                />
                <p className="text-sm text-neutral-700">{activity.aiExplanation}</p>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Signals found
                </p>
                <ScoreBar label="Leadership" score={score} />
                <ScoreBar label="Proactiveness" score={score} />
                <ScoreBar label="Energy" score={score} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

