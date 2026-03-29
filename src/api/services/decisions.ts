import type { DecisionStatus } from '../../types';
import { USE_MOCK_DATA } from '../../constants';
import { patchDashboardCandidateStatus } from './dashboard';

const USE_MOCK = USE_MOCK_DATA;

export const acceptCandidate = async (id: string): Promise<{ status: DecisionStatus }> => {
  if (USE_MOCK) return { status: 'accepted' };
  await patchDashboardCandidateStatus(id, 'accepted');
  return { status: 'accepted' };
};

export const rejectCandidate = async (id: string): Promise<{ status: DecisionStatus }> => {
  if (USE_MOCK) return { status: 'rejected' };
  await patchDashboardCandidateStatus(id, 'rejected');
  return { status: 'rejected' };
};
