import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { formatMatchDate } from '@/lib/utils/dates';

interface MatchHeroProps {
  match: Match;
  locale: 'fr' | 'en';
}

export function MatchHero({ match, locale }: MatchHeroProps) {
  const rating = match.analysis?.match_interest_score
    ? match.analysis.match_interest_score / 10
    : match.analysis?.rating || 0;

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${match.away_team.primaryColor}, ${match.home_team.primaryColor})`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Date */}
        <p className="text-center text-foreground-secondary text-sm mb-6">
          {formatMatchDate(match.scheduled_at, locale)}
        </p>

        {/* Teams and Score */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Away Team */}
          <div className="flex flex-col items-center">
            <TeamLogo team={match.away_team} size={80} />
            <p className="mt-3 text-lg font-bold text-foreground">
              {match.away_team.abbreviation}
            </p>
            <p className="text-sm text-foreground-secondary">
              {match.away_team.city}
            </p>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <span
              className="text-4xl font-bold text-foreground-secondary"
              style={{ fontFamily: 'var(--font-title)' }}
            >
              VS
            </span>

            {/* Rating */}
            {rating > 0 && (
              <div className="mt-4">
                <RatingBadge rating={rating} locale={locale} size="lg" />
              </div>
            )}
          </div>

          {/* Home Team */}
          <div className="flex flex-col items-center">
            <TeamLogo team={match.home_team} size={80} />
            <p className="mt-3 text-lg font-bold text-foreground">
              {match.home_team.abbreviation}
            </p>
            <p className="text-sm text-foreground-secondary">
              {match.home_team.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
