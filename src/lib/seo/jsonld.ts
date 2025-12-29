import { Match } from '@/types';

export function generateMatchJsonLd(match: Match, locale: 'fr' | 'en') {
  const headline = locale === 'fr'
    ? (match.analysis?.headline_fr || match.analysis?.headline)
    : (match.analysis?.headline_en || match.analysis?.headline);

  const summary = locale === 'fr'
    ? (match.analysis?.summary_fr || match.analysis?.summary)
    : (match.analysis?.summary_en || match.analysis?.summary);

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.away_team.city} ${match.away_team.name} vs ${match.home_team.city} ${match.home_team.name}`,
    startDate: match.scheduled_at,
    description: summary || headline || `NBA game analysis`,
    homeTeam: {
      '@type': 'SportsTeam',
      name: `${match.home_team.city} ${match.home_team.name}`,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: `${match.away_team.city} ${match.away_team.name}`,
    },
    sport: 'Basketball',
    ...(match.status === 'finished' && match.home_score !== undefined && match.away_score !== undefined && {
      eventStatus: 'https://schema.org/EventCompleted',
    }),
  };
}

export function generateTeamJsonLd(teamName: string, teamCity: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: `${teamCity} ${teamName}`,
    sport: 'Basketball',
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'NBA',
    },
  };
}

export function generateWebsiteJsonLd(locale: 'fr' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Reggie',
    description: locale === 'fr'
      ? 'Guide NBA sans spoilers - Découvrez quels matchs valent le coup'
      : 'Spoiler-free NBA Guide - Find out which games are worth watching',
    url: locale === 'fr' ? 'https://reggie.app/fr' : 'https://reggie.app/en',
  };
}
