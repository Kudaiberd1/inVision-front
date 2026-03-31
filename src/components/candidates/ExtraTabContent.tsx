import { useEffect, useState } from 'react';
import type { ExtraActivity } from '../../types';
import { USE_MOCK_DATA } from '../../constants';
import { MOCK_CANDIDATES } from '../../data/mockData';
import { fetchDashboardExtra, type DashboardExtraResponse } from '../../api/services/dashboard';
import { ExtraActivityList } from './ExtraActivityList';
import { ExtraActivityDetail } from './ExtraActivityDetail';

const VISUAL_BASE = 'http://localhost:3000/visual';

function normaliseProfile(platform: 'codeforces' | 'leetcode' | 'github' | 'linkedin', raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { handle: '', url: '', chartUrl: undefined as string | undefined };
  }

  let url = trimmed;
  let handle = trimmed;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const u = new URL(trimmed);
      const parts = u.pathname.split('/').filter(Boolean);
      handle = parts[parts.length - 1] || trimmed;
      url = trimmed;
    } catch {
      url = trimmed;
      handle = trimmed;
    }
  } else {
    if (platform === 'codeforces') url = `https://codeforces.com/profile/${trimmed}`;
    if (platform === 'leetcode') url = `https://leetcode.com/${trimmed}`;
    if (platform === 'github') url = `https://github.com/${trimmed}`;
    if (platform === 'linkedin') url = `https://www.linkedin.com/in/${trimmed}`;
  }

  let chartUrl: string | undefined;
  if (platform === 'codeforces') {
    chartUrl = `${VISUAL_BASE}/codeforces/${handle}`;
  } else if (platform === 'leetcode') {
    chartUrl = `${VISUAL_BASE}/leetcode/${handle}`;
  }

  return { handle, url, chartUrl };
}

function buildActivitiesFromDashboard(
  candidateId: string,
  data: DashboardExtraResponse,
): ExtraActivity[] {
  const platforms: { key: keyof DashboardExtraResponse; platform: ExtraActivity['platform'] }[] = [
    { key: 'codeforces', platform: 'codeforces' },
    { key: 'leetcode', platform: 'leetcode' },
    { key: 'github', platform: 'github' },
    { key: 'linkedin', platform: 'linkedin' },
  ];

  return platforms.map(({ key, platform }) => {
    const raw = data[key];
    if (!raw) {
      if (platform === 'codeforces') {
        return {
          id: `${platform}-${candidateId}`,
          platform,
          handle: '',
          profileUrl: '',
          available: false,
          aiScore: 0,
          aiExplanation: 'No profile submitted.',
          stats: {
            platform: 'codeforces',
            rating: 0,
            maxRating: 0,
            rank: '',
            problemsSolved: 0,
            contests: 0,
            activedays: 0,
            chartImageUrl: undefined,
          },
        };
      }
      if (platform === 'leetcode') {
        return {
          id: `${platform}-${candidateId}`,
          platform,
          handle: '',
          profileUrl: '',
          available: false,
          aiScore: 0,
          aiExplanation: 'No profile submitted.',
          stats: {
            platform: 'leetcode',
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            acceptanceRate: 0,
            ranking: 0,
            chartImageUrl: undefined,
          },
        };
      }
      if (platform === 'linkedin') {
        return {
          id: `${platform}-${candidateId}`,
          platform,
          handle: '',
          profileUrl: '',
          available: false,
          aiScore: 0,
          aiExplanation: 'No profile submitted.',
          stats: {
            platform: 'linkedin',
            headline: '',
            connections: 0,
            skills: [],
            certifications: [],
            summary: '',
            chartImageUrl: undefined,
          },
        };
      }
      return {
        id: `${platform}-${candidateId}`,
        platform,
        handle: '',
        profileUrl: '',
        available: false,
        aiScore: 0,
        aiExplanation: 'No profile submitted.',
        stats: {
          platform: 'github',
          publicRepos: 0,
          followers: 0,
          totalStars: 0,
          totalCommits: 0,
          topLanguages: [],
          chartImageUrl: undefined,
        },
      };
    }

    const { handle, url, chartUrl } = normaliseProfile(platform, raw);

    if (platform === 'codeforces') {
      return {
        id: `${platform}-${candidateId}`,
        platform,
        handle,
        profileUrl: url,
        available: true,
        aiScore: 0,
        aiExplanation: 'External Codeforces profile submitted. AI scoring not available yet.',
        stats: {
          platform: 'codeforces',
          rating: 0,
          maxRating: 0,
          rank: '',
          problemsSolved: 0,
          contests: 0,
          activedays: 0,
          chartImageUrl: chartUrl,
        },
      };
    }
    if (platform === 'leetcode') {
      return {
        id: `${platform}-${candidateId}`,
        platform,
        handle,
        profileUrl: url,
        available: true,
        aiScore: 0,
        aiExplanation: 'External LeetCode profile submitted. AI scoring not available yet.',
        stats: {
          platform: 'leetcode',
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          acceptanceRate: 0,
          ranking: 0,
          chartImageUrl: chartUrl,
        },
      };
    }
    if (platform === 'linkedin') {
      return {
        id: `${platform}-${candidateId}`,
        platform,
        handle,
        profileUrl: url,
        available: true,
        aiScore: 0,
        aiExplanation: 'External LinkedIn profile submitted. AI scoring not available yet.',
        stats: {
          platform: 'linkedin',
          headline: '',
          connections: 0,
          skills: [],
          certifications: [],
          summary: '',
          chartImageUrl: undefined,
        },
      };
    }
    return {
      id: `${platform}-${candidateId}`,
      platform,
      handle,
      profileUrl: url,
      available: true,
      aiScore: 0,
      aiExplanation: 'External GitHub profile submitted. AI scoring not available yet.',
      stats: {
        platform: 'github',
        publicRepos: 0,
        followers: 0,
        totalStars: 0,
        totalCommits: 0,
        topLanguages: [],
        chartImageUrl: undefined,
      },
    };
  });
}

interface ExtraTabContentProps {
  candidateId: string;
}

export default function ExtraTabContent({ candidateId }: ExtraTabContentProps) {
  const [activities, setActivities] = useState<ExtraActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ExtraActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          const candidate = MOCK_CANDIDATES.find((c) => c.id === candidateId);
          if (!candidate?.extraActivities) {
            if (!cancelled) {
              setActivities([]);
              setLoading(false);
            }
            return;
          }
          if (!cancelled) {
            setActivities(candidate.extraActivities);
            setLoading(false);
          }
          return;
        }

        const data = await fetchDashboardExtra(candidateId);
        if (cancelled) return;
        const built = buildActivitiesFromDashboard(candidateId, data);
        setActivities(built);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError('Could not load external activity. Please try again.');
          setActivities([]);
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
        <p className="text-sm text-neutral-600">Loading external activity…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-white px-4">
        <p className="text-sm text-[#B91C1C]">{error}</p>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            External activity
          </p>
          <p className="mt-2 text-sm text-neutral-700">
            This candidate has not submitted any external platforms yet.
          </p>
        </div>
      </div>
    );
  }

  if (selectedActivity) {
    return (
      <ExtraActivityDetail activity={selectedActivity} onBack={() => setSelectedActivity(null)} />
    );
  }

  return (
    <ExtraActivityList activities={activities} onView={(activity) => setSelectedActivity(activity)} />
  );
}

