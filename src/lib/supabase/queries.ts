import { createClient } from './server';
import { Match, TeamStanding, Team } from '@/types';
import { getTeamByAbbreviation } from '@/constants/teams';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { generateMatchSlug } from '@/lib/utils/slugify';

const ET_TIMEZONE = 'America/New_York';

function getETDate(): Date {
  return toZonedTime(new Date(), ET_TIMEZONE);
}

function enrichTeam(dbTeam: { abbreviation: string; name?: string; city?: string }): Team {
  const staticTeam = getTeamByAbbreviation(dbTeam.abbreviation);
  if (staticTeam) {
    return staticTeam;
  }
  // Fallback for unknown teams
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

function transformMatch(dbMatch: any): Match {
  const match: Match = {
    id: dbMatch.id,
    nba_game_id: dbMatch.nba_game_id,
    home_team: enrichTeam(dbMatch.home_team),
    away_team: enrichTeam(dbMatch.away_team),
    scheduled_at: dbMatch.scheduled_at,
    status: dbMatch.status,
    home_score: dbMatch.home_score,
    away_score: dbMatch.away_score,
    analysis: dbMatch.game_analyses?.[0] || undefined,
  };
  match.slug = generateMatchSlug(match);
  return match;
}

export async function getYesterdayMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const etNow = getETDate();
  const yesterday = subDays(etNow, 1);

  const { data, error } = await supabase
    .from('games')
    .select(`
      id,
      nba_game_id,
      scheduled_at,
      status,
      home_score,
      away_score,
      home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
      away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
      game_analyses(*)
    `)
    .gte('scheduled_at', startOfDay(yesterday).toISOString())
    .lte('scheduled_at', endOfDay(yesterday).toISOString())
    .not('game_analyses', 'is', null)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching yesterday matches:', error);
    return [];
  }

  const matches = (data || []).map(transformMatch);

  // Sort by rating (highest first)
  return matches.sort((a, b) => {
    const ratingA = a.analysis?.match_interest_score || a.analysis?.rating || 0;
    const ratingB = b.analysis?.match_interest_score || b.analysis?.rating || 0;
    return (ratingB / 10) - (ratingA / 10);
  });
}

export async function getTodayMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const etNow = getETDate();

  const { data, error } = await supabase
    .from('games')
    .select(`
      id,
      nba_game_id,
      scheduled_at,
      status,
      home_score,
      away_score,
      home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
      away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
      game_analyses(*)
    `)
    .gte('scheduled_at', startOfDay(etNow).toISOString())
    .lte('scheduled_at', endOfDay(etNow).toISOString())
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching today matches:', error);
    return [];
  }

  const matches = (data || []).map(transformMatch);

  // Sort by rating (highest first), then by time
  return matches.sort((a, b) => {
    const ratingA = a.analysis?.match_interest_score || a.analysis?.rating || 0;
    const ratingB = b.analysis?.match_interest_score || b.analysis?.rating || 0;
    const ratingDiff = (ratingB / 10) - (ratingA / 10);
    if (ratingDiff !== 0) return ratingDiff;
    return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
  });
}

export async function getMatchBySlug(slug: string): Promise<Match | null> {
  const supabase = await createClient();

  // Parse the slug to extract date and team info
  const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})$/);
  if (!dateMatch) return null;

  const date = dateMatch[1];
  const teamsSlug = slug.slice(0, -(date.length + 1));
  const teamParts = teamsSlug.split('-vs-');
  if (teamParts.length !== 2) return null;

  const startDate = new Date(`${date}T00:00:00Z`);
  const endDate = new Date(`${date}T23:59:59Z`);

  const { data, error } = await supabase
    .from('games')
    .select(`
      id,
      nba_game_id,
      scheduled_at,
      status,
      home_score,
      away_score,
      home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
      away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
      game_analyses(*)
    `)
    .gte('scheduled_at', startDate.toISOString())
    .lte('scheduled_at', endDate.toISOString())
    .order('scheduled_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching match by slug:', error);
    return null;
  }

  // Find the matching game by comparing generated slugs
  for (const game of data) {
    const match = transformMatch(game);
    if (match.slug === slug) {
      return match;
    }
  }

  return null;
}

async function getTeamIdByAbbr(supabase: any, teamAbbr: string): Promise<string | null> {
  const { data } = await supabase
    .from('teams')
    .select('id')
    .eq('abbreviation', teamAbbr)
    .single();
  return data?.id || null;
}

export async function getTeamMatches(teamAbbr: string, limit = 20): Promise<Match[]> {
  const supabase = await createClient();

  const teamId = await getTeamIdByAbbr(supabase, teamAbbr);
  if (!teamId) {
    console.error('Team not found:', teamAbbr);
    return [];
  }

  const { data, error } = await supabase
    .from('games')
    .select(`
      id,
      nba_game_id,
      scheduled_at,
      status,
      home_score,
      away_score,
      home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
      away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
      game_analyses(*)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .not('game_analyses', 'is', null)
    .order('scheduled_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching team matches:', error);
    return [];
  }

  return (data || []).map(transformMatch);
}

export async function getStandings(): Promise<{ east: TeamStanding[]; west: TeamStanding[] }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('standings')
    .select(`
      conference_rank,
      wins,
      losses,
      win_pct,
      last_10,
      streak,
      games_behind,
      home_record,
      away_record,
      teams(abbreviation, name, city)
    `)
    .eq('season', 2025)
    .order('conference_rank', { ascending: true });

  if (error) {
    console.error('Error fetching standings:', error);
    return { east: [], west: [] };
  }

  const standings: TeamStanding[] = (data || []).map((row: any) => {
    const team = enrichTeam(row.teams);
    return {
      team,
      conference: team.conference,
      conference_rank: row.conference_rank,
      wins: row.wins,
      losses: row.losses,
      win_pct: row.win_pct,
      last_10: row.last_10 || '',
      streak: row.streak || '',
      games_behind: row.games_behind,
      home_record: row.home_record,
      away_record: row.away_record,
    };
  });

  return {
    east: standings.filter(s => s.conference === 'East'),
    west: standings.filter(s => s.conference === 'West'),
  };
}

export async function getRelatedMatches(teamAbbr: string, currentMatchId: string, limit = 2): Promise<Match[]> {
  const supabase = await createClient();

  const teamId = await getTeamIdByAbbr(supabase, teamAbbr);
  if (!teamId) {
    return [];
  }

  const { data, error } = await supabase
    .from('games')
    .select(`
      id,
      nba_game_id,
      scheduled_at,
      status,
      home_score,
      away_score,
      home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
      away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
      game_analyses(*)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .neq('id', currentMatchId)
    .not('game_analyses', 'is', null)
    .eq('status', 'finished')
    .order('scheduled_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related matches:', error);
    return [];
  }

  return (data || []).map(transformMatch);
}

export async function getUpcomingMatches(teamAbbr: string, limit = 2): Promise<Match[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const teamId = await getTeamIdByAbbr(supabase, teamAbbr);
  if (!teamId) {
    return [];
  }

  const { data, error } = await supabase
    .from('games')
    .select(`
      id,
      nba_game_id,
      scheduled_at,
      status,
      home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
      away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
      game_analyses(*)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .eq('status', 'scheduled')
    .gte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }

  return (data || []).map(transformMatch);
}

export async function getAllAnalyzedMatches(): Promise<Match[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('games')
    .select(`
      id,
      nba_game_id,
      scheduled_at,
      status,
      home_score,
      away_score,
      home_team:teams!games_home_team_id_fkey(abbreviation, name, city),
      away_team:teams!games_away_team_id_fkey(abbreviation, name, city),
      game_analyses(*)
    `)
    .not('game_analyses', 'is', null)
    .order('scheduled_at', { ascending: false });

  if (error) {
    console.error('Error fetching all matches:', error);
    return [];
  }

  return (data || []).map(transformMatch);
}
