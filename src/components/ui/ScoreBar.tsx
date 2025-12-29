import { getRatingColor } from '@/constants/theme';

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue: number;
}

export function ScoreBar({ label, value, maxValue }: ScoreBarProps) {
  const percentage = (value / maxValue) * 100;
  const normalizedValue = (value / maxValue) * 10;
  const barColor = getRatingColor(normalizedValue);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-foreground-secondary">{label}</span>
        <span className="text-sm font-semibold" style={{ color: barColor }}>
          {value}/{maxValue}
        </span>
      </div>
      <div className="h-1.5 bg-card-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
