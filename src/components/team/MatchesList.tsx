import Link from 'next/link';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { formatMatchDateShort } from '@/lib/utils/dates';

interface MatchesListProps {
  matches: Match[];
  locale: 'fr' | 'en';
  emptyMessage: string;
}

export function MatchesList({ matches, locale, emptyMessage }: MatchesListProps) {
  if (matches.length === 0) {
    return (
      <p className="text-foreground-secondary py-8 text-center">{emptyMessage}</p>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => {
        const rating = match.analysis?.match_interest_score
          ? match.analysis.match_interest_score / 10
          : match.analysis?.rating || 0;

        const headline = locale === 'fr'
          ? (match.analysis?.headline_fr || match.analysis?.headline)
          : (match.analysis?.headline_en || match.analysis?.headline);

        return (
          <Link
            key={match.id}
            href={`/${locale}/match/${match.slug}`}
            className="block p-4 rounded-xl bg-card border border-card-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* Teams */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <TeamLogo team={match.away_team} size={36} />
                  <span className="text-foreground-muted text-xs">@</span>
                  <TeamLogo team={match.home_team} size={36} />
                </div>

                {/* Match info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {match.away_team.abbreviation} vs {match.home_team.abbreviation}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-secondary">
                    {formatMatchDateShort(match.scheduled_at, locale)}
                  </p>
                  {headline && (
                    <p className="text-sm text-foreground mt-1 truncate">
                      {headline}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              {rating > 0 && (
                <RatingBadge rating={rating} locale={locale} size="sm" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
