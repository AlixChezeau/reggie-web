import Link from 'next/link';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { RatingBadge } from '@/components/ui/RatingBadge';

interface SmallMatchCardProps {
  match: Match;
  locale: 'fr' | 'en';
}

export function SmallMatchCard({ match, locale }: SmallMatchCardProps) {
  const rating = match.analysis?.match_interest_score
    ? match.analysis.match_interest_score / 10
    : match.analysis?.rating || 0;

  const headline = locale === 'fr'
    ? (match.analysis?.headline_fr || match.analysis?.headline)
    : (match.analysis?.headline_en || match.analysis?.headline);

  return (
    <Link
      href={`/${locale}/match/${match.slug}`}
      className="flex items-center gap-4 p-3 rounded-lg bg-card border border-card-border hover:border-primary/30 transition-all duration-300"
    >
      {/* Teams */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <TeamLogo team={match.away_team} size={32} />
        <span className="text-xs text-foreground-muted">@</span>
        <TeamLogo team={match.home_team} size={32} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground-secondary truncate">
          {match.away_team.abbreviation} vs {match.home_team.abbreviation}
        </p>
        {headline && (
          <p className="text-sm font-medium text-foreground truncate">
            {headline}
          </p>
        )}
      </div>

      {/* Rating */}
      {rating > 0 && (
        <RatingBadge rating={rating} locale={locale} size="sm" showLabel={false} />
      )}
    </Link>
  );
}
