import Link from 'next/link';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { formatMatchDateShort, formatTime } from '@/lib/utils/dates';

interface UpcomingMatchesProps {
  matches: Match[];
  title: string;
  locale: 'fr' | 'en';
}

export function UpcomingMatches({ matches, title, locale }: UpcomingMatchesProps) {
  if (matches.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-card-border p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {matches.map((match) => (
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
            <span className="text-sm font-medium text-primary">
              {formatTime(match.scheduled_at)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
