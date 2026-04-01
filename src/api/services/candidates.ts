import type { Candidate } from '../../types';
import { USE_MOCK_DATA } from '../../constants';
import { MOCK_CANDIDATES } from '../../data/mockData';
import { useCandidateStore } from '../../store/useCandidateStore';
import {
  dashboardListItemToCandidate,
  mergeCandidateDetail,
} from '../../utils/dashboardCandidate';
import {
  fetchDashboardCandidates,
  fetchDashboardCandidateDetail,
  fetchDashboardChatbotAnalysis,
  fetchDashboardCvReview,
  fetchDashboardEssayReview,
} from './dashboard';

const USE_MOCK = USE_MOCK_DATA;

export const fetchCandidates = async (): Promise<Candidate[]> => {
  if (USE_MOCK) {
    return structuredClone(MOCK_CANDIDATES);
  }
  const rows = await fetchDashboardCandidates();
  return rows.map(dashboardListItemToCandidate);
};

export const fetchCandidateById = async (id: string): Promise<Candidate> => {
  if (USE_MOCK) {
    const live = useCandidateStore.getState().candidates.find((x) => x.id === id);
    if (live) return structuredClone(live);
    const c = MOCK_CANDIDATES.find((x) => x.id === id);
    if (!c) throw new Error('Candidate not found');
    return structuredClone(c);
  }

  let base = useCandidateStore.getState().candidates.find((c) => c.id === id);
  if (!base) {
    const rows = await fetchDashboardCandidates();
    const row = rows.find((r) => String(r.id) === id);
    if (!row) throw new Error('Candidate not found');
    base = dashboardListItemToCandidate(row);
  }

  const [detail, cv, essay, chat] = await Promise.all([
    fetchDashboardCandidateDetail(id),
    fetchDashboardCvReview(id),
    fetchDashboardEssayReview(id),
    fetchDashboardChatbotAnalysis(id),
  ]);

  const merged = mergeCandidateDetail(base, cv, essay, chat);

  return {
    ...merged,
    phone: detail.phone,
    dateOfBirth: detail.dateOfBirth,
    city: detail.city,
    school: detail.schoolUniversity,
    untScore: detail.untScore,
    ielts: detail.ielts,
    toefl: detail.toefl,
    codeforces: detail.codeforces,
    leetcode: detail.leetcode,
    github: detail.github,
    linkedin: detail.linkedin,
    cvPdfUrl: detail.cvUrl ?? merged.cvPdfUrl,
    essayPdfUrl: detail.motivationEssayUrl ?? merged.essayPdfUrl,
    videoUrl: detail.videoUrl ?? merged.videoUrl,
    status: detail.status as Candidate['status'],
  };
};
