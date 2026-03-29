import { useEffect, useState } from 'react';
import { scoreRingColor } from '../../utils/scoring';

interface ScoreBarProps {
  label: string;
  score: number;
  color?: string;
}

export function ScoreBar({ label, score, color }: ScoreBarProps) {
  const [w, setW] = useState(0);
  const v = Math.max(0, Math.min(100, score));
  const fill = color ?? scoreRingColor(v);

  useEffect(() => {
    const t = requestAnimationFrame(() => setW(v));
    return () => cancelAnimationFrame(t);
  }, [v]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-neutral-600">
        <span>{label}</span>
        <span className="score-number text-sm text-neutral-900">{v}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#E5E5E4]">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{ width: `${w}%`, backgroundColor: fill }}
        />
      </div>
    </div>
  );
}
