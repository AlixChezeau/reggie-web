import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getTeamBySlug, NBA_TEAMS } from '@/constants/teams';
import { TeamHeader } from '@/components/team/TeamHeader';
import { MatchRow } from '@/components/night/MatchRow';
import { AppStoreButton } from '@/components/ui/AppStoreButton';
import { getTeamMatches } from '@/lib/supabase/queries';
import { generateTeamJsonLd } from '@/lib/seo/jsonld';
import { routes } from '@/lib/routes';

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
  if (!team) return {};

  const title = `${team.city} ${team.name}`;
  const description = locale === 'fr'
    ? `Les matchs des ${team.city} ${team.name} à revoir, sans spoil : le verdict de Reggie pour chacun.`
    : `${team.city} ${team.name} games worth rewatching, spoiler-free: Reggie's verdict on each one.`;

  return {
    title,
    description,
    alternates: {
      canonical: routes.team(locale as 'fr' | 'en', teamSlug),
      languages: { fr: routes.team('fr', teamSlug), en: routes.team('en', teamSlug) },
    },
  };
}

/** Les matchs d'une équipe, du plus récent au plus ancien : verdicts seulement, jamais de score. */
export default async function TeamPage({ params }: Props) {
  const { locale: rawLocale, teamSlug } = await params;
  const locale = rawLocale as 'fr' | 'en';
  setRequestLocale(locale);
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  const t = await getTranslations('team');
  const tHome = await getTranslations('home');
  const matches = await getTeamMatches(team.abbreviation, 30);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateTeamJsonLd(team.name, team.city)) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-4 flex flex-col gap-6">
        <TeamHeader team={team} />
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground-secondary">{t('allMatches')}</h2>
        {matches.length === 0 ? (
          <p className="text-foreground-secondary">{t('noMatches')}</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} locale={locale} withText showDate />
            ))}
          </div>
        )}
        <section className="rounded-3xl bg-surface border border-card-border p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-lg font-bold flex-1">{tHome('ctaTitle')}</p>
          <AppStoreButton campaign="page-equipe" />
        </section>
      </div>
    </>
  );
}
