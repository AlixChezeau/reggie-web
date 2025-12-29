import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { NBA_TEAMS } from '@/constants/teams';
import { TeamLogo } from '@/components/ui/TeamLogo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'teams' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function TeamsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'teams' });

  const eastTeams = NBA_TEAMS.filter((team) => team.conference === 'East').sort((a, b) =>
    a.city.localeCompare(b.city)
  );
  const westTeams = NBA_TEAMS.filter((team) => team.conference === 'West').sort((a, b) =>
    a.city.localeCompare(b.city)
  );

  const teamPath = locale === 'fr' ? 'equipe' : 'team';

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className="text-4xl font-bold text-primary mb-8"
          style={{ fontFamily: 'var(--font-title)' }}
        >
          {t('title')}
        </h1>

        {/* Eastern Conference */}
        <section className="mb-12">
          <h2
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            {t('eastern')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {eastTeams.map((team) => (
              <Link
                key={team.abbreviation}
                href={`/${locale}/${teamPath}/${team.slug}`}
                className="flex flex-col items-center p-4 rounded-xl bg-card border border-card-border hover:border-primary/30 hover:bg-card-hover transition-all"
              >
                <TeamLogo team={team} size={64} />
                <p className="mt-3 text-sm font-medium text-foreground text-center">
                  {team.city}
                </p>
                <p className="text-xs text-foreground-secondary text-center">
                  {team.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Western Conference */}
        <section>
          <h2
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            {t('western')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {westTeams.map((team) => (
              <Link
                key={team.abbreviation}
                href={`/${locale}/${teamPath}/${team.slug}`}
                className="flex flex-col items-center p-4 rounded-xl bg-card border border-card-border hover:border-primary/30 hover:bg-card-hover transition-all"
              >
                <TeamLogo team={team} size={64} />
                <p className="mt-3 text-sm font-medium text-foreground text-center">
                  {team.city}
                </p>
                <p className="text-xs text-foreground-secondary text-center">
                  {team.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
