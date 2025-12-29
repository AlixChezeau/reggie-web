import { getRatingColor, getRatingLabel } from '@/constants/theme';

interface RatingBadgeProps {
  rating: number;
  locale: 'fr' | 'en';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RatingBadge({ rating, locale, size = 'md', showLabel = true }: RatingBadgeProps) {
  const color = getRatingColor(rating);
  const label = getRatingLabel(rating, locale);

  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-lg px-3 py-1',
    lg: 'text-2xl px-4 py-2',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`font-bold rounded-lg ${sizeClasses[size]}`}
        style={{
          backgroundColor: color,
          color: '#0A0F1C',
          fontFamily: 'var(--font-title)',
        }}
      >
        {rating.toFixed(1)}
      </span>
      {showLabel && (
        <span
          className={`font-semibold ${labelSizeClasses[size]}`}
          style={{ color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
