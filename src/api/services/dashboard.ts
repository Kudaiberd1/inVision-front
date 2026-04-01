import axios from 'axios';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  DashboardCandidateListItem,
  DashboardChatbotResponse,
  DashboardCvReviewResponse,
  DashboardEssayReviewResponse,
} from '../../utils/dashboardCandidate';

export interface DashboardExtraResponse {
  codeforces?: string | null;
  leetcode?: string | null;
  github?: string | null;
  linkedin?: string | null;
}

export interface DashboardCandidateDetailResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  city: string | null;
  schoolUniversity: string | null;
  untScore: number | null;
  ielts: number | null;
  toefl: number | null;
  codeforces: string | null;
  leetcode: string | null;
  github: string | null;
  linkedin: string | null;
  fieldOfStudy: string;
  cvUrl: string | null;
  motivationEssayUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  status: string;
}

export interface ScoreOverviewResponse {
  overall: number;
  cvPoints: number;
  essayPoints: number;
  chatPoints: number;
  cvLeadershipPoints: number;
  cvProactivenessPoints: number;
  cvEnergyPoints: number;
  essayLeadershipPoints: number;
  essayProactivenessPoints: number;
  essayEnergyPoints: number;
  chatLeadershipPoints: number;
  chatProactivenessPoints: number;
  chatEnergyPoints: number;
  untScore: number;
  ieltsScore: number;
  toeflScore: number;
  untPoints: number;
  ieltsPoints: number;
  toeflPoints: number;
}

export async function fetchDashboardCandidates(): Promise<DashboardCandidateListItem[]> {
  const { data } = await apiClient.get<DashboardCandidateListItem[]>(ENDPOINTS.DASHBOARD_CANDIDATES);
  return data;
}

export async function fetchDashboardCvReview(id: string): Promise<DashboardCvReviewResponse> {
  const { data } = await apiClient.get<DashboardCvReviewResponse>(ENDPOINTS.DASHBOARD_CV_REVIEW(id));
  return data;
}

export async function fetchDashboardEssayReview(id: string): Promise<DashboardEssayReviewResponse> {
  const { data } = await apiClient.get<DashboardEssayReviewResponse>(
    ENDPOINTS.DASHBOARD_ESSAY_REVIEW(id),
  );
  return data;
}

/** Returns null when no interview is linked (404). */
export async function fetchDashboardChatbotAnalysis(
  id: string,
): Promise<DashboardChatbotResponse | null> {
  try {
    const { data } = await apiClient.get<DashboardChatbotResponse>(ENDPOINTS.DASHBOARD_CHATBOT(id));
    return data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) return null;
    throw e;
  }
}

export async function patchDashboardCandidateStatus(
  id: string,
  status: 'pending' | 'accepted' | 'rejected',
): Promise<void> {
  await apiClient.patch(ENDPOINTS.DASHBOARD_STATUS(id), { status });
}

export async function fetchDashboardExtra(id: string): Promise<DashboardExtraResponse> {
  const { data } = await apiClient.get<DashboardExtraResponse>(
    ENDPOINTS.DASHBOARD_EXTRA_ACTIVITIES(id),
  );
  return data;
}

export async function fetchDashboardCandidateDetail(
  id: string,
): Promise<DashboardCandidateDetailResponse> {
  const { data } = await apiClient.get<DashboardCandidateDetailResponse>(
    ENDPOINTS.DASHBOARD_CANDIDATE_DETAIL(id),
  );
  return data;
}

export async function fetchScoreOverview(id: string): Promise<ScoreOverviewResponse> {
  const { data } = await apiClient.get<ScoreOverviewResponse>(
    ENDPOINTS.DASHBOARD_SCORE_OVERVIEW(id),
  );
  return data;
}
