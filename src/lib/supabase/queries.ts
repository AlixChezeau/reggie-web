import { createClient } from './server';
import { Match, MatchAnalysis, Team } from '@/types';
import { getTeamByAbbreviation } from '@/constants/teams';
import { addDays, format } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { generateMatchSlug } from '@/lib/utils/slugify';

/**
 * Lecture seule. Règle zéro spoil : aucune requête ne lit home_score ni away_score,
 * pour qu'aucun score ne puisse arriver dans une page, même par erreur.
 *
 * Une « nuit » est une journée NBA à l'heure de New York (comme dans l'app) :
 * la nuit du 21 au 22 octobre en France est la journée du 21 octobre aux États-Unis.
 */
const ET_TIMEZONE = 'America/New_York';

const GAME_SELECT = `
  id,
  nba_game_id,
  scheduled_at,
  status,
  home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
  away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
  game_analyses(*)
`;

type DbTeam = { abbreviation: string; name?: string; city?: string };
type DbGame = {
  id: string;
  nba_game_id: string;
  scheduled_at: string;
  status: Match['status'];
  home_team: DbTeam;
  away_team: DbTeam;
  game_analyses?: MatchAnalysis[] | null;
};

function enrichTeam(dbTeam: DbTeam): Team {
  const staticTeam = getTeamByAbbreviation(dbTeam.abbreviation);
  if (staticTeam) {
    return staticTeam;
  }
  return {
    id: 0,
    name: dbTeam.name || dbTeam.abbreviation,
    abbreviation: dbTeam.abbreviation,
    city: dbTeam.city || '',
    conference: 'East',
    logo: '',
    primaryColor: '#666666',
    secondaryColor: '#999999',
    slug: dbTeam.abbreviation.toLowerCase(),
  };
}

function latest(analyses: MatchAnalysis[], type: 'pre' | 'post'): MatchAnalysis | undefined {
  return analyses
    .filter((a) => a.type === type)
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))[0];
}

function transformMatch(dbMatch: DbGame): Match {
  const analyses = dbMatch.game_analyses || [];
  const pre = latest(analyses, 'pre');
  const post = dbMatch.status === 'finished' ? latest(analyses, 'post') : undefined;
  const match: Match = {
    id: dbMatch.id,
    nba_game_id: dbMatch.nba_game_id,
    home_team: enrichTeam(dbMatch.home_team),
    away_team: enrichTeam(dbMatch.away_team),
    scheduled_at: dbMatch.scheduled_at,
    status: dbMatch.status,
    pre_analysis: pre,
    post_analysis: post,
    // Un match terminé sans après-match n'a pas encore de verdict publiable
    analysis: dbMatch.status === 'finished' ? post : pre,
  };
  match.slug = generateMatchSlug(match);
  return match;
}

/** Date NBA (heure de New York) d'un instant, au format yyyy-MM-dd */
export function etDateOf(iso: string | Date): string {
  return formatInTimeZone(iso, ET_TIMEZONE, 'yyyy-MM-dd');
}

function etDayRange(etDate: string): { start: string; end: string } {
  const start = fromZonedTime(`${etDate}T00:00:00`, ET_TIMEZONE);
  const nextDay = format(addDays(new Date(`${etDate}T12:00:00Z`), 1), 'yyyy-MM-dd');
  const end = fromZonedTime(`${nextDay}T00:00:00`, ET_TIMEZONE);
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Tous les matchs d'une nuit, par heure de début */
export async function getNight(etDate: string): Promise<Match[]> {
  const supabase = createClient();
  if (!supabase || !/^\d{4}-\d{2}-\d{2}$/.test(etDate)) return [];
  const { start, end } = etDayRange(etDate);

  const { data, error } = await supabase
    .from('games')
    .select(GAME_SELECT)
    .gte('scheduled_at', start)
    .lt('scheduled_at', end)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching night:', error);
    return [];
  }
  return ((data || []) as unknown as DbGame[]).map(transformMatch);
}

/** La dernière nuit terminée qui a des verdicts : « la nuit en couleurs » du matin */
export async function getLastNight(): Promise<{ date: string; matches: Match[] } | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('games')
    .select('scheduled_at')
    .eq('status', 'finished')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: false })
    .limit(1);

  if (error || !data?.length) {
    if (error) console.error('Error fetching last night:', error);
    return null;
  }

  const date = etDateOf(data[0].scheduled_at);
  const matches = (await getNight(date)).filter((m) => m.post_analysis);
  return matches.length ? { date, matches } : null;
}

/** Les prochains matchs à jouer (« les matchs de cette nuit ») : jamais d'après-match */
export async function getNextNight(): Promise<{ date: string; matches: Match[] } | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('games')
    .select('scheduled_at')
    .eq('status', 'scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(1);

  if (error || !data?.length) {
    if (error) console.error('Error fetching next night:', error);
    return null;
  }

  const date = etDateOf(data[0].scheduled_at);
  const matches = (await getNight(date)).filter((m) => m.status !== 'finished');
  return matches.length ? { date, matches } : null;
}

export async function getMatchBySlug(slug: string): Promise<Match | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})$/);
  if (!dateMatch) return null;

  const date = dateMatch[1];
  const teamsSlug = slug.slice(0, -(date.length + 1));
  if (teamsSlug.split('-vs-').length !== 2) return null;

  const { data, error } = await supabase
    .from('games')
    .select(GAME_SELECT)
    .gte('scheduled_at', `${date}T00:00:00Z`)
    .lte('scheduled_at', `${date}T23:59:59Z`)
    .order('scheduled_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching match by slug:', error);
    return null;
  }

  for (const game of data as unknown as DbGame[]) {
    const match = transformMatch(game);
    if (match.slug === slug) {
      return match;
    }
  }

  return null;
}

async function getTeamIdByAbbr(teamAbbr: string): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from('teams')
    .select('id')
    .eq('abbreviation', teamAbbr)
    .single();
  return data?.id || null;
}

export async function getTeamMatches(teamAbbr: string, limit = 20): Promise<Match[]> {
  const supabase = createClient();
  const teamId = await getTeamIdByAbbr(teamAbbr);
  if (!supabase || !teamId) return [];

  const { data, error } = await supabase
    .from('games')
    .select(GAME_SELECT)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .not('game_analyses', 'is', null)
    .order('scheduled_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching team matches:', error);
    return [];
  }

  return ((data || []) as unknown as DbGame[]).map(transformMatch).filter((m) => m.analysis);
}

export async function getRelatedMatches(teamAbbr: string, currentMatchId: string, limit = 2): Promise<Match[]> {
  const supabase = createClient();
  const teamId = await getTeamIdByAbbr(teamAbbr);
  if (!supabase || !teamId) return [];

  const { data, error } = await supabase
    .from('games')
    .select(GAME_SELECT)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .neq('id', currentMatchId)
    .eq('status', 'finished')
    .order('scheduled_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related matches:', error);
    return [];
  }

  return ((data || []) as unknown as DbGame[]).map(transformMatch).filter((m) => m.analysis);
}

export async function getUpcomingMatches(teamAbbr: string, limit = 2): Promise<Match[]> {
  const supabase = createClient();
  const teamId = await getTeamIdByAbbr(teamAbbr);
  if (!supabase || !teamId) return [];

  const { data, error } = await supabase
    .from('games')
    .select(GAME_SELECT)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .eq('status', 'scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }

  return ((data || []) as unknown as DbGame[]).map(transformMatch);
}

export async function getAllAnalyzedMatches(): Promise<Match[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('games')
    .select(GAME_SELECT)
    .not('game_analyses', 'is', null)
    .order('scheduled_at', { ascending: false })
    .limit(2000);

  if (error) {
    console.error('Error fetching all matches:', error);
    return [];
  }

  return ((data || []) as unknown as DbGame[]).map(transformMatch).filter((m) => m.analysis);
}
