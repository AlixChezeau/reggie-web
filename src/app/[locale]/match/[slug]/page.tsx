import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DreamReveal } from '@/components/match/DreamReveal';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { AppStoreButton } from '@/components/ui/AppStoreButton';
import { MatchRow } from '@/components/night/MatchRow';
import { etDateOf, getMatchBySlug, getRelatedMatches, getUpcomingMatches } from '@/lib/supabase/queries';
import { generateMatchJsonLd } from '@/lib/seo/jsonld';
import { formatMatchDate, nightTitle } from '@/lib/utils/dates';
import { localized, verdictFor, verdictLabel, watchFormatFor, zeroSpoilText } from '@/lib/verdict';
import { routes } from '@/lib/routes';
import { Match, Team } from '@/types';

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as 'fr' | 'en';
  const match = await getMatchBySlug(slug);
  if (!match) return {};

  const t = await getTranslations({ locale, namespace: 'match' });
  const teams = `${match.away_team.abbreviation} – ${match.home_team.abbreviation}`;
  const verdict = match.analysis ? verdictLabel(verdictFor(match.analysis), l) : '';
  // Jamais le résumé dans la description : Google l'afficherait dans ses résultats
  const description = t('metaDescription', { teams, verdict });

  return {
    title: `${teams} · ${nightTitle(etDateOf(match.scheduled_at), l)}`,
    description,
    openGraph: { title: teams, description, type: 'article' },
    alternates: {
      canonical: routes.match(l, slug),
      languages: { fr: routes.match('fr', slug), en: routes.match('en', slug) },
    },
  };
}

function TeamBlock({ team }: { team: Team }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <TeamLogo team={team} size={72} />
      <span className="font-title text-3xl leading-none">{team.abbreviation}</span>
      <span className="text-sm text-foreground-secondary text-center">{team.city}</span>
    </div>
  );
}

function dedupe(matches: Match[], limit: number): Match[] {
  return matches.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i).slice(0, limit);
}

/**
 * Page d'un match. Par défaut, mode Zéro spoil : le verdict, le format conseillé et une
 * phrase qui ne dit rien du résultat. La note et l'analyse n'apparaissent qu'à la demande.
 */
export default async function MatchPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as 'fr' | 'en';
  setRequestLocale(locale);
  const match = await getMatchBySlug(slug);
  if (!match) notFound();

  const t = await getTranslations('match');
  const tVerdict = await getTranslations('verdict');
  const analysis = match.analysis;
  const finished = match.status === 'finished';
  const verdict = analysis ? verdictFor(analysis) : null;
  const night = etDateOf(match.scheduled_at);

  const [awayRelated, homeRelated, awayUpcoming, homeUpcoming] = await Promise.all([
    getRelatedMatches(match.away_team.abbreviation, match.id, 2),
    getRelatedMatches(match.home_team.abbreviation, match.id, 2),
    getUpcomingMatches(match.away_team.abbreviation, 2),
    getUpcomingMatches(match.home_team.abbreviation, 2),
  ]);
  const related = dedupe([...awayRelated, ...homeRelated], 4);
  const upcoming = dedupe([...awayUpcoming, ...homeUpcoming], 4);

  // Avant le match, le titre et le résumé ne peuvent rien dévoiler : ils restent visibles
  const preHeadline = analysis && !finished ? localized(analysis, 'headline', locale) : undefined;
  const preSummary = analysis && !finished ? localized(analysis, 'summary', locale) : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateMatchJsonLd(match, locale)) }} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        <Link href={routes.night(locale, night)} className="text-sm font-semibold text-primary">
          ← {nightTitle(night, locale)}
        </Link>

        <section className="rounded-3xl bg-card border border-card-border px-4 py-7 sm:px-8 flex flex-col gap-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamBlock team={match.away_team} />
            <div className="flex flex-col items-center gap-2">
              {verdict ? (
                <VerdictPill verdict={verdict} locale={locale} size="lg" />
              ) : (
                <span className="font-title text-2xl text-foreground-secondary">{match.status === 'in_progress' ? t('inProgress') : 'VS'}</span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                {finished ? tVerdict('postMatch') : tVerdict('preMatch')}
              </span>
            </div>
            <TeamBlock team={match.home_team} />
          </div>
          <div className="flex flex-col items-center gap-1 text-sm text-center">
            <span className="text-foreground-secondary first-letter:uppercase">
              {t('kickoff')} : {formatMatchDate(match.scheduled_at, locale)}
            </span>
            {verdict && finished && <span className="font-semibold">{tVerdict(`tip.${watchFormatFor(verdict)}`)}</span>}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          {finished && analysis && <p className="text-lg leading-relaxed">{zeroSpoilText(analysis, locale)}</p>}
          {finished && !analysis && <p className="text-lg text-foreground-secondary">{t('pending')}</p>}
          {preHeadline && <h1 className="text-2xl font-bold text-primary leading-snug">{preHeadline}</h1>}
          {preSummary && <p className="text-lg leading-relaxed">{preSummary}</p>}
          {finished && <h1 className="sr-only">{`${match.away_team.city} ${match.away_team.name} – ${match.home_team.city} ${match.home_team.name}`}</h1>}

          {analysis && (
            <DreamReveal
              slug={slug}
              locale={locale}
              labels={{
                ctaTitle: t('dreamCtaTitle'),
                ctaText: t('dreamCtaText'),
                button: t('dreamButton'),
                back: t('zeroButton'),
                rating: t('rating'),
                bestFor: t('bestFor'),
                criteria: t('criteria'),
                error: t('dreamError'),
              }}
            />
          )}
        </section>

        {related.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground-secondary">{t('relatedMatches')}</h2>
            {related.map((m) => <MatchRow key={m.id} match={m} locale={locale} showDate />)}
          </section>
        )}

        {upcoming.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground-secondary">{t('upcomingMatches')}</h2>
            {upcoming.map((m) => <MatchRow key={m.id} match={m} locale={locale} showDate />)}
          </section>
        )}

        <section className="rounded-3xl bg-surface border border-card-border p-6 flex flex-col gap-3 items-start">
          <p className="text-lg font-bold">{t('appTitle')}</p>
          <p className="text-foreground-secondary">{t('appText')}</p>
          <AppStoreButton campaign="page-match" />
        </section>
      </article>
    </>
  );
}
