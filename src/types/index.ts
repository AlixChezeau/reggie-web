export type Conference = 'East' | 'West';
export type MatchStatus = 'scheduled' | 'in_progress' | 'finished';
export type AnalysisType = 'pre' | 'post';
export type Language = 'fr' | 'en';

export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  city: string;
  conference: Conference;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  slug?: string;
}

export interface Match {
  id: string;
  nba_game_id: string;
  home_team: Team;
  away_team: Team;
  scheduled_at: string;
  status: MatchStatus;
  home_score?: number;
  away_score?: number;
  analysis?: MatchAnalysis;
  slug?: string;
}

export interface AnalysisBreakdown {
  suspense: number;
  intensity: number;
  star_power: number;
  wow_moments: number;
  context: number;
  key_factors: string[];
  key_factors_fr?: string[];
  narrative?: string;
  narrative_fr?: string;
}

export interface InterestScoreBreakdown {
  stakes: number;
  star_power: number;
  performances: number;
  clutch_factor: number;
}

export interface PrematchBreakdown {
  stakes: number;
  star_power: number;
  recent_form: number;
  rivalry?: number;
  schedule_context?: number;
}

export interface StandoutPlayer {
  name: string;
  team: string;
  contribution: string;
  contribution_fr?: string;
  contribution_en?: string;
}

export interface GameDynamics {
  pace: 'slow' | 'medium' | 'fast';
  physicality: 'soft' | 'moderate' | 'intense';
  shooting_quality: 'cold' | 'average' | 'hot';
}

export interface Verdict {
  recommendation: 'must_watch' | 'worth_it' | 'skip';
  best_for: string;
  watch_if: string;
  best_for_fr?: string;
  best_for_en?: string;
  watch_if_fr?: string;
  watch_if_en?: string;
}

export interface MatchAnalysis {
  id: string;
  match_id: string;
  type: AnalysisType;
  rating: number;
  comment_fr: string;
  comment_en: string;
  breakdown: AnalysisBreakdown;
  created_at: string;
  headline?: string;
  headline_fr?: string;
  headline_en?: string;
  summary?: string;
  summary_fr?: string;
  summary_en?: string;
  match_interest_score?: number;
  interest_breakdown?: InterestScoreBreakdown;
  prematch_breakdown?: PrematchBreakdown;
  scoring_details?: {
    stakes_calculation?: { home_rank: number; away_rank: number; home_points: number; away_points: number; rivalry_bonus: number; total: number };
    star_power_calculation?: { home_points: number; away_points: number; tier1_matchup_bonus: number; total: number };
    recent_form_calculation?: { home_points: number; away_points: number; contrast_bonus: number; total: number };
  };
  key_takeaways?: string[];
  key_takeaways_fr?: string[];
  key_takeaways_en?: string[];
  standout_players?: StandoutPlayer[];
  game_dynamics?: GameDynamics;
  verdict?: Verdict;
}

export interface TeamStanding {
  team: Team;
  conference: Conference;
  conference_rank: number;
  wins: number;
  losses: number;
  win_pct: number;
  last_10: string;
  streak: string;
  games_behind?: number;
  home_record?: string;
  away_record?: string;
}
