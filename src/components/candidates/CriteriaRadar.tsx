import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { CriteriaScore } from '../../types';
import { CRITERIA, CRITERIA_LABELS } from '../../constants';

interface CriteriaRadarProps {
  scores: CriteriaScore;
}

export function CriteriaRadar({ scores }: CriteriaRadarProps) {
  const data = CRITERIA.map((c) => ({
    subject: CRITERIA_LABELS[c] ?? c,
    score: scores[c],
    fullMark: 100,
  }));

  return (
    <div className="h-48 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#E5E5E4" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 10 }} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#C8E63C"
            fill="#C8E63C"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
