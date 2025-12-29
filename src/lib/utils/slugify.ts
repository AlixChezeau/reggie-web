import { format } from 'date-fns';
import { Match, Team } from '@/types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateMatchSlug(match: Match): string {
  const away = slugify(`${match.away_team.city}-${match.away_team.name}`);
  const home = slugify(`${match.home_team.city}-${match.home_team.name}`);
  const date = format(new Date(match.scheduled_at), 'yyyy-MM-dd');
  return `${away}-vs-${home}-${date}`;
}

export function generateTeamSlug(team: Team): string {
  return slugify(`${team.city}-${team.name}`);
}

export function parseMatchSlug(slug: string): { awayTeam: string; homeTeam: string; date: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;

  const awayTeam = parts[0];
  const homeAndDate = parts[1];

  // Extract date (last 10 characters: YYYY-MM-DD)
  const dateMatch = homeAndDate.match(/(\d{4}-\d{2}-\d{2})$/);
  if (!dateMatch) return null;

  const date = dateMatch[1];
  const homeTeam = homeAndDate.slice(0, -(date.length + 1)); // -1 for the dash before date

  return { awayTeam, homeTeam, date };
}
