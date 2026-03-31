import type { ExtraActivity } from '../../types';
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../../constants';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ExtraActivityListProps {
  activities: ExtraActivity[];
  onView: (activity: ExtraActivity) => void;
}

export function ExtraActivityList({ activities, onView }: ExtraActivityListProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          External activity
        </p>
        <h2 className="text-lg font-semibold text-neutral-900">
          Verified external platforms submitted by the candidate
        </h2>
        <p className="text-sm text-neutral-600">
          Use this view to quickly scan Codeforces, LeetCode, LinkedIn, and GitHub signals. Only
          platforms submitted by the candidate will have a detailed view.
        </p>
      </div>

      <div className="divide-y divide-[#E5E5E4] rounded-2xl border border-[#E5E5E4] bg-white">
        {activities.map((activity) => {
          const label = PLATFORM_LABELS[activity.platform];
          const color = PLATFORM_COLORS[activity.platform];
          const isAvailable = activity.available;

          return (
            <div
              key={activity.id}
              className={`flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:px-6 ${
                isAvailable ? 'bg-white' : 'bg-neutral-50'
              }`}
            >
              <div className="flex flex-1 items-start gap-3">
                <div
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: color }}
                >
                  {label[0]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">{label}</span>
                    <span className="text-xs text-neutral-500">@{activity.handle}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                          : 'bg-neutral-100 text-neutral-600 ring-neutral-200'
                      }
                    >
                      {isAvailable ? 'Available' : 'Not submitted'}
                    </Badge>
                    {isAvailable && (
                      <Badge
                        className={`score-number ${
                          activity.aiScore >= 70
                            ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                            : activity.aiScore >= 50
                              ? 'bg-amber-50 text-amber-800 ring-amber-100'
                              : 'bg-rose-50 text-rose-800 ring-rose-100'
                        }`}
                      >
                        AI score: {activity.aiScore}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-start gap-3 md:justify-end">
                {isAvailable ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#E5E5E4] px-3 py-1 text-xs font-medium text-neutral-800 hover:border-[#C8E63C] hover:text-[#4B5A00]"
                    onClick={() => onView(activity)}
                  >
                    View
                    <span aria-hidden>→</span>
                  </Button>
                ) : (
                  <span className="mt-1 text-xs text-neutral-400">No details available</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

