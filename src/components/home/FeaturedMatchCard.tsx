import Link from 'next/link';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { RatingBadge } from '@/components/ui/RatingBadge';

interface FeaturedMatchCardProps {
  match: Match;
  locale: 'fr' | 'en';
}

export function FeaturedMatchCard({ match, locale }: FeaturedMatchCardProps) {
  const rating = match.analysis?.match_interest_score
    ? match.analysis.match_interest_score / 10
    : match.analysis?.rating || 0;

  const headline = locale === 'fr'
    ? (match.analysis?.headline_fr || match.analysis?.headline)
    : (match.analysis?.headline_en || match.analysis?.headline);

  const summary = locale === 'fr'
    ? (match.analysis?.summary_fr || match.analysis?.summary || match.analysis?.comment_fr)
    : (match.analysis?.summary_en || match.analysis?.summary || match.analysis?.comment_en);

  return (
    <Link
      href={`/${locale}/match/${match.slug}`}
      className="block group relative overflow-hidden rounded-xl bg-card border border-card-border hover:border-primary/30 transition-all duration-300"
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${match.away_team.primaryColor}, ${match.home_team.primaryColor})`,
        }}
      />

      <div className="relative p-6">
        {/* Teams and logos */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TeamLogo team={match.away_team} size={56} />
            <span className="text-xl font-bold text-foreground-secondary">@</span>
            <TeamLogo team={match.home_team} size={56} />
          </div>
          {rating > 0 && (
            <RatingBadge rating={rating} locale={locale} size="lg" />
          )}
        </div>

        {/* Team names */}
        <div className="flex items-center gap-2 mb-4 text-sm text-foreground-secondary">
          <span>{match.away_team.city} {match.away_team.name}</span>
          <span>vs</span>
          <span>{match.home_team.city} {match.home_team.name}</span>
        </div>

        {/* Headline */}
        {headline && (
          <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2 group-hover:text-primary/80 transition-colors">
            {headline}
          </h3>
        )}

        {/* Summary */}
        {summary && (
          <p className="text-foreground-secondary text-sm line-clamp-3">
            {summary}
          </p>
        )}

      </div>
    </Link>
  );
}
