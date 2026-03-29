import { SCORE_THRESHOLDS } from '../constants';

export function scorePillClass(score: number): string {
  if (score >= SCORE_THRESHOLDS.HIGH) {
    return 'bg-[#C8E63C]/15 text-[#C8E63C] border border-[#C8E63C]/30';
  }
  if (score >= SCORE_THRESHOLDS.MID) {
    return 'bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30';
  }
  return 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30';
}

export function scoreRingColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.HIGH) return '#C8E63C';
  if (score >= SCORE_THRESHOLDS.MID) return '#FACC15';
  return '#F87171';
}
