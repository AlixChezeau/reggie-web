import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getTeamBySlug, NBA_TEAMS } from '@/constants/teams';
import { TeamHeader } from '@/components/team/TeamHeader';
import { MatchesList } from '@/components/team/MatchesList';
import { TeamPageClient } from './TeamPageClient';
import { getTeamMatches } from '@/lib/supabase/queries';
import { generateTeamJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 3600; // Revalidate every hour

type Props = {
  params: Promise<{ locale: string; teamSlug: string }>;
};

export async function generateStaticParams() {
  return NBA_TEAMS.flatMap((team) => [
    { locale: 'fr', teamSlug: team.slug },
    { locale: 'en', teamSlug: team.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    return { title: 'Team not found' };
  }

  const title = locale === 'fr'
    ? `${team.city} ${team.name} - Toutes les analyses | Reggie`
    : `${team.city} ${team.name} - All Analysis | Reggie`;

  const description = locale === 'fr'
    ? `Découvrez toutes les analyses de matchs des ${team.city} ${team.name}. Notes, résumés et recommandations sans spoilers.`
    : `Discover all game analysis for the ${team.city} ${team.name}. Ratings, summaries and spoiler-free recommendations.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${locale === 'fr' ? 'equipe' : 'team'}/${teamSlug}`,
      languages: {
        fr: `/fr/equipe/${teamSlug}`,
        en: `/en/team/${teamSlug}`,
      },
    },
  };
}

export default async function TeamPage({ params }: Props) {
  const { locale, teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    notFound();
  }

  const t = await getTranslations('team');
  const matches = await getTeamMatches(team.abbreviation, 50);
  const jsonLd = generateTeamJsonLd(team.name, team.city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4">
        <TeamHeader team={team} />

        <TeamPageClient
          matches={matches}
          locale={locale as 'fr' | 'en'}
          labels={{
            allMatches: t('allMatches'),
            filterRecent: t('filterRecent'),
            filterBest: t('filterBest'),
            noMatches: t('noMatches'),
          }}
        />
      </div>
    </>
  );
}
