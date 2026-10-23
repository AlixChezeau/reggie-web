import { Match } from '@/types';
import { verdictFor, verdictLabel, zeroSpoilText } from '@/lib/verdict';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reggie-web.vercel.app';

/** Données structurées d'un match : uniquement le verdict Zéro spoil, jamais de score ni de résumé. */
export function generateMatchJsonLd(match: Match, locale: 'fr' | 'en') {
  const description = match.analysis
    ? `${verdictLabel(verdictFor(match.analysis), locale)}. ${zeroSpoilText(match.analysis, locale)}`
    : 'NBA';

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.away_team.city} ${match.away_team.name} – ${match.home_team.city} ${match.home_team.name}`,
    startDate: match.scheduled_at,
    description,
    homeTeam: { '@type': 'SportsTeam', name: `${match.home_team.city} ${match.home_team.name}` },
    awayTeam: { '@type': 'SportsTeam', name: `${match.away_team.city} ${match.away_team.name}` },
    sport: 'Basketball',
  };
}

export function generateTeamJsonLd(teamName: string, teamCity: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: `${teamCity} ${teamName}`,
    sport: 'Basketball',
  };
}

export function generateWebsiteJsonLd(locale: 'fr' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Reggie',
    description: locale === 'fr' ? 'Les matchs NBA à revoir, sans spoil.' : 'NBA games worth rewatching. No spoilers.',
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
  };
}
