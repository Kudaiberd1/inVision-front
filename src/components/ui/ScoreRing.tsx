import { useEffect, useState } from 'react';
import { scoreRingColor } from '../../utils/scoring';

interface ScoreRingProps {
  score: number;
  size?: number;
  color?: string;
  label?: string;
  /** Optional value to display in the center instead of the 0–100 score. */
  displayScore?: number;
  /** When true, hides the colored progress arc and only shows the grey ring + number. */
  hideProgress?: boolean;
}

export function ScoreRing({
  score,
  size = 88,
  color,
  label = 'Score',
  displayScore,
  hideProgress = false,
}: ScoreRingProps) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c - (clamped / 100) * c;
  const strokeColor = color ?? scoreRingColor(clamped);
  const shown = displayScore ?? clamped;
  const [dash, setDash] = useState(c);

  useEffect(() => {
    const t = requestAnimationFrame(() => setDash(offset));
    return () => cancelAnimationFrame(t);
  }, [offset]);

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-label={`${label}: ${shown}`}>
        <title>{`${label}: ${shown}`}</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E5E5E4"
          strokeWidth={stroke}
        />
        {!hideProgress && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        )}
      </svg>
      <span className="score-number pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-bold text-neutral-900">
        {shown}
      </span>
    </div>
  );
}
