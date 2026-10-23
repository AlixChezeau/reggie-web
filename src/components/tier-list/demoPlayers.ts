/**
 * Données de démonstration de la tier list : affichées seulement si la base ne répond pas
 * (migration 034 pas encore appliquée, ou Supabase injoignable). Les vrais votes passent
 * par tier_list_vote et le classement par tier_list_ranking (Reggie, migration 034).
 */
export interface DemoPlayer {
  id: string;
  name: string;
  team: string;
  score: number;
  /** Places gagnées (+) ou perdues (−) depuis dimanche dernier */
  trend: number;
}

export const DEMO_PLAYERS: DemoPlayer[] = [
  { id: 'sga', name: 'Shai Gilgeous-Alexander', team: 'OKC', score: 980, trend: 1 },
  { id: 'jokic', name: 'Nikola Jokić', team: 'DEN', score: 965, trend: 0 },
  { id: 'wemby', name: 'Victor Wembanyama', team: 'SAS', score: 940, trend: 2 },
  { id: 'doncic', name: 'Luka Dončić', team: 'LAL', score: 900, trend: -1 },
  { id: 'edwards', name: 'Anthony Edwards', team: 'MIN', score: 860, trend: 1 },
  { id: 'cunningham', name: 'Cade Cunningham', team: 'DET', score: 820, trend: 3 },
  { id: 'brunson', name: 'Jalen Brunson', team: 'NYK', score: 800, trend: 0 },
  { id: 'mitchell', name: 'Donovan Mitchell', team: 'CLE', score: 760, trend: -2 },
  { id: 'curry', name: 'Stephen Curry', team: 'GSW', score: 740, trend: -1 },
  { id: 'banchero', name: 'Paolo Banchero', team: 'ORL', score: 700, trend: 2 },
  { id: 'tatum', name: 'Jayson Tatum', team: 'BOS', score: 660, trend: 0 },
  { id: 'ball', name: 'LaMelo Ball', team: 'CHA', score: 620, trend: -1 },
];

/** Paliers S à D et nombre de joueurs dans chacun (les couleurs ne sont jamais celles des verdicts) */
