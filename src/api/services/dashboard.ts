import axios from 'axios';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  DashboardCandidateListItem,
  DashboardChatbotResponse,
  DashboardCvReviewResponse,
  DashboardEssayReviewResponse,
} from '../../utils/dashboardCandidate';

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
