import Link from 'next/link';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { formatTime } from '@/lib/utils/dates';

interface TodayMatchesGridProps {
  matches: Match[];
  locale: 'fr' | 'en';
  title: string;
  emptyMessage: string;
}

function MatchCard({ match, locale }: { match: Match; locale: 'fr' | 'en' }) {
  const rating = match.analysis?.match_interest_score
    ? match.analysis.match_interest_score / 10
    : match.analysis?.rating || 0;

  const headline = locale === 'fr'
    ? (match.analysis?.headline_fr || match.analysis?.headline)
    : (match.analysis?.headline_en || match.analysis?.headline);

  const isScheduled = match.status === 'scheduled';
  const time = formatTime(match.scheduled_at);

  return (
    <Link
      href={`/${locale}/match/${match.slug}`}
      className="block p-4 rounded-xl bg-card border border-card-border hover:border-primary/30 transition-all duration-300"
    >
      {/* Teams row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TeamLogo team={match.away_team} size={40} />
          <span className="text-foreground-muted text-xs">@</span>
          <TeamLogo team={match.home_team} size={40} />
        </div>

        {rating > 0 ? (
          <RatingBadge rating={rating} locale={locale} size="sm" showLabel={false} />
        ) : isScheduled ? (
          <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-title)' }}>
            {time}
          </span>
        ) : null}
      </div>

      {/* Team names */}
      <p className="text-sm text-foreground-secondary mb-2">
        {match.away_team.abbreviation} vs {match.home_team.abbreviation}
      </p>

      {/* Headline or status */}
      {headline ? (
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {headline}
        </p>
      ) : isScheduled ? (
        <p className="text-sm text-foreground-muted italic">
          {locale === 'fr' ? 'Analyse à venir' : 'Analysis coming'}
        </p>
      ) : null}

    </Link>
  );
}

export function TodayMatchesGrid({ matches, locale, title, emptyMessage }: TodayMatchesGridProps) {
  return (
    <section id="today-matches" className="py-8 bg-background-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl font-bold text-primary mb-6"
          style={{ fontFamily: 'var(--font-title)' }}
        >
          {title}
        </h2>

        {matches.length === 0 ? (
          <p className="text-foreground-secondary">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.slice(0, 9).map((match) => (
              <MatchCard key={match.id} match={match} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
