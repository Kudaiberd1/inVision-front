import { create } from 'zustand';
import type { Candidate, DecisionStatus } from '../types';

interface CandidateState {
  candidates: Candidate[];
  setCandidates: (list: Candidate[]) => void;
  updateCandidateStatus: (id: string, status: DecisionStatus) => void;
}

export const useCandidateStore = create<CandidateState>((set) => ({
  candidates: [],
  setCandidates: (candidates) => set({ candidates }),
  updateCandidateStatus: (id, status) =>
    set((s) => ({
      candidates: s.candidates.map((c) => (c.id === id ? { ...c, status } : c)),
    })),
}));
