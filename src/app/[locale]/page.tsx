import { getTranslations } from 'next-intl/server';
import { HeroSection } from '@/components/home/HeroSection';
import { TodayMatchesGrid } from '@/components/home/TodayMatchesGrid';
import { StandingsSection } from '@/components/home/StandingsSection';
import { getYesterdayMatches, getTodayMatches, getStandings } from '@/lib/supabase/queries';

export const revalidate = 300; // Revalidate every 5 minutes

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tStandings = await getTranslations('standings');

  // Fetch data in parallel
  const [yesterdayMatches, todayMatches, standings] = await Promise.all([
    getYesterdayMatches(),
    getTodayMatches(),
    getStandings(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Yesterday's matches in Washington Post layout */}
      <HeroSection
        matches={yesterdayMatches}
        locale={locale as 'fr' | 'en'}
        title={t('latestNews')}
        emptyMessage={t('noYesterdayMatches')}
      />

      {/* Today's Matches Grid */}
      <TodayMatchesGrid
        matches={todayMatches}
        locale={locale as 'fr' | 'en'}
        title={t('todayMatches')}
        emptyMessage={t('noMatchesToday')}
      />

      {/* Standings Section */}
      <StandingsSection
        east={standings.east}
        west={standings.west}
        locale={locale as 'fr' | 'en'}
        title={t('standings')}
        labels={{
          east: tStandings('east'),
          west: tStandings('west'),
          rank: tStandings('rank'),
          team: tStandings('team'),
          wins: tStandings('wins'),
          losses: tStandings('losses'),
          pct: tStandings('pct'),
          last10: tStandings('last10'),
          streak: tStandings('streak'),
        }}
      />
    </div>
  );
}
