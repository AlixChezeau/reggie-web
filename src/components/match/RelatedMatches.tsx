import Link from 'next/link';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { formatMatchDateShort } from '@/lib/utils/dates';

interface RelatedMatchesProps {
  matches: Match[];
  title: string;
  locale: 'fr' | 'en';
}

export function RelatedMatches({ matches, title, locale }: RelatedMatchesProps) {
  if (matches.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-card-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {matches.map((match) => {
          const rating = match.analysis?.match_interest_score
            ? match.analysis.match_interest_score / 10
            : match.analysis?.rating || 0;

          return (
            <Link
              key={match.id}
              href={`/${locale}/match/${match.slug}`}
              className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <TeamLogo team={match.away_team} size={24} />
                  <span className="text-xs text-foreground-muted">@</span>
                  <TeamLogo team={match.home_team} size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {match.away_team.abbreviation} vs {match.home_team.abbreviation}
                  </p>
                  <p className="text-xs text-foreground-secondary">
                    {formatMatchDateShort(match.scheduled_at, locale)}
                  </p>
                </div>
              </div>
              {rating > 0 && (
                <RatingBadge rating={rating} locale={locale} size="sm" showLabel={false} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
