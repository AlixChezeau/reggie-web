import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Match } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Locale, matchVerdict, watchFormatFor, zeroSpoilText } from '@/lib/verdict';
import { formatDay, formatTime } from '@/lib/utils/dates';
import { routes } from '@/lib/routes';

interface MatchRowProps {
  match: Match;
  locale: Locale;
  /** Afficher la phrase Zéro spoil sous l'affiche */
  withText?: boolean;
  /** Afficher la date (listes qui mélangent plusieurs nuits) */
  showDate?: boolean;
}

/**
 * Une affiche de la nuit, comme dans l'app : heure, équipes, verdict et format conseillé.
 * Match terminé : verdict d'après-match et phrase Zéro spoil. À venir : verdict d'avant-match.
 */
export async function MatchRow({ match, locale, withText = false, showDate = false }: MatchRowProps) {
  const t = await getTranslations('verdict');
  const verdict = matchVerdict(match);
  const finished = match.status === 'finished';
  const detail = finished
    ? verdict
      ? t(`tip.${watchFormatFor(verdict)}`)
      : t('pending')
    : t('preMatch');

  const body = (
    <>
      <span className="flex flex-col text-sm text-foreground-secondary tabular-nums w-[4.75rem] shrink-0">
        {showDate && <span className="font-semibold text-foreground">{formatDay(match.scheduled_at, locale)}</span>}
        <span>{formatTime(match.scheduled_at, locale)}</span>
      </span>
      <span className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Le sigle est dans les volets : à côté, le surnom (Knicks, Lakers), comme dans l'app.
            Sur mobile, une équipe par ligne pour que les volets tiennent dans la carte. */}
        <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1.5 font-semibold text-foreground">
          <span className="flex items-center gap-1.5 min-w-0">
            <TeamLogo team={match.away_team} size={26} />
            <span className="truncate">{match.away_team.name}</span>
          </span>
          <span className="hidden sm:inline text-foreground-muted" aria-hidden="true">–</span>
          <span className="sr-only">{locale === 'fr' ? 'contre' : 'vs'}</span>
          <span className="flex items-center gap-1.5 min-w-0">
            <TeamLogo team={match.home_team} size={26} />
            <span className="truncate">{match.home_team.name}</span>
          </span>
        </span>
        <span className="text-xs text-foreground-secondary">{detail}</span>
        {withText && finished && match.analysis && (
          <span className="text-sm text-foreground/90 leading-relaxed mt-1">{zeroSpoilText(match.analysis, locale)}</span>
        )}
      </span>
      {verdict && <VerdictPill verdict={verdict} locale={locale} size="sm" className="shrink-0 self-center" />}
    </>
  );

  const className = 'flex items-start gap-3 rounded-2xl bg-card border border-card-border px-4 py-3.5';
  return match.slug ? (
    <Link href={routes.match(locale, match.slug)} className={`${className} hover:border-primary/40 transition-colors`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
