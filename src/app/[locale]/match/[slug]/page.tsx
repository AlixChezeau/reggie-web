import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { MatchHero } from '@/components/match/MatchHero';
import { AnalysisBreakdown } from '@/components/match/AnalysisBreakdown';
import { RelatedMatches } from '@/components/match/RelatedMatches';
import { UpcomingMatches } from '@/components/match/UpcomingMatches';
import { getMatchBySlug, getRelatedMatches, getUpcomingMatches } from '@/lib/supabase/queries';
import { generateMatchJsonLd } from '@/lib/seo/jsonld';
import { formatMatchDateShort } from '@/lib/utils/dates';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const match = await getMatchBySlug(slug);

  if (!match) {
    return {
      title: 'Match not found',
    };
  }

  const headline = locale === 'fr'
    ? (match.analysis?.headline_fr || match.analysis?.headline)
    : (match.analysis?.headline_en || match.analysis?.headline);

  const summary = locale === 'fr'
    ? (match.analysis?.summary_fr || match.analysis?.summary)
    : (match.analysis?.summary_en || match.analysis?.summary);

  const title = `${match.away_team.abbreviation} vs ${match.home_team.abbreviation} - ${formatMatchDateShort(match.scheduled_at, locale as 'fr' | 'en')} | Reggie`;
  const description = summary || headline || `${locale === 'fr' ? 'Analyse du match' : 'Match analysis'} ${match.away_team.name} vs ${match.home_team.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/match/${slug}`,
      languages: {
        fr: `/fr/match/${slug}`,
        en: `/en/match/${slug}`,
      },
    },
  };
}

export default async function MatchPage({ params }: Props) {
  const { locale, slug } = await params;
  const match = await getMatchBySlug(slug);

  if (!match || !match.analysis) {
    notFound();
  }

  const t = await getTranslations('match');
  const tAnalysis = await getTranslations('analysis');
  const tDynamics = await getTranslations('dynamics');

  const isPostMatch = match.status === 'finished';

  // Fetch related content
  const [awayRelated, homeRelated, awayUpcoming, homeUpcoming] = await Promise.all([
    getRelatedMatches(match.away_team.abbreviation, match.id, 2),
    getRelatedMatches(match.home_team.abbreviation, match.id, 2),
    getUpcomingMatches(match.away_team.abbreviation, 2),
    getUpcomingMatches(match.home_team.abbreviation, 2),
  ]);

  // Combine and dedupe related matches
  const relatedMatches = [...awayRelated, ...homeRelated]
    .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
    .slice(0, 4);

  const upcomingMatches = [...awayUpcoming, ...homeUpcoming]
    .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
    .slice(0, 4);

  const jsonLd = generateMatchJsonLd(match, locale as 'fr' | 'en');

  const headline = locale === 'fr'
    ? (match.analysis.headline_fr || match.analysis.headline)
    : (match.analysis.headline_en || match.analysis.headline);

  const summary = locale === 'fr'
    ? (match.analysis.summary_fr || match.analysis.summary || match.analysis.comment_fr)
    : (match.analysis.summary_en || match.analysis.summary || match.analysis.comment_en);

  const bestFor = match.analysis.verdict
    ? (locale === 'fr'
        ? (match.analysis.verdict.best_for_fr || match.analysis.verdict.best_for)
        : (match.analysis.verdict.best_for_en || match.analysis.verdict.best_for))
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Hero Section */}
        <MatchHero match={match} locale={locale as 'fr' | 'en'} />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Headline & Summary */}
          <div className="mb-8">
            {headline && (
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                {headline}
              </h1>
            )}
            {summary && (
              <p className="text-lg text-foreground leading-relaxed">
                {summary}
              </p>
            )}
            {bestFor && (
              <p className="mt-4 text-foreground-secondary italic">
                {t('bestFor')}: {bestFor}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - Analysis */}
            <div className="lg:col-span-2">
              <AnalysisBreakdown
                analysis={match.analysis}
                isPostMatch={isPostMatch}
                locale={locale as 'fr' | 'en'}
                labels={{
                  breakdown: tAnalysis('breakdown'),
                  stakes: tAnalysis('stakes'),
                  starPower: tAnalysis('starPower'),
                  recentForm: tAnalysis('recentForm'),
                  performances: tAnalysis('performances'),
                  clutch: tAnalysis('clutch'),
                  gameDynamics: tAnalysis('gameDynamics'),
                  pace: tAnalysis('pace'),
                  physicality: tAnalysis('physicality'),
                  shooting: tAnalysis('shooting'),
                  standoutPlayers: tAnalysis('standoutPlayers'),
                  keyFactors: tAnalysis('keyFactors'),
                }}
                dynamicsLabels={{
                  slow: tDynamics('slow'),
                  medium: tDynamics('medium'),
                  fast: tDynamics('fast'),
                  soft: tDynamics('soft'),
                  moderate: tDynamics('moderate'),
                  intense: tDynamics('intense'),
                  cold: tDynamics('cold'),
                  average: tDynamics('average'),
                  hot: tDynamics('hot'),
                }}
              />
            </div>

            {/* Sidebar - Related content */}
            <div className="space-y-6">
              <RelatedMatches
                matches={relatedMatches}
                title={t('relatedMatches')}
                locale={locale as 'fr' | 'en'}
              />
              <UpcomingMatches
                matches={upcomingMatches}
                title={t('upcomingMatches')}
                locale={locale as 'fr' | 'en'}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
