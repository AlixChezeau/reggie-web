/**
 * Données de démonstration de la tier list.
 *
 * TODO (après validation d'Alix) : brancher les vrais votes.
 *   - une table Supabase de votes (joueur, sens, jour, empreinte anonyme du visiteur),
 *     écrite par une fonction serveur qui applique « un vote par joueur et par jour » ;
 *   - une vue qui calcule le score de chaque joueur sur la semaine ;
 *   - le dimanche, le classement est figé et l'image Instagram est générée.
 * Rien de tout cela n'existe encore : cette page n'écrit nulle part.
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
export const TIERS = [
  { name: 'S', size: 2, background: '#FFB400', color: '#0A0F1C' },
  { name: 'A', size: 3, background: '#E5E7EB', color: '#0A0F1C' },
  { name: 'B', size: 3, background: '#9CA3AF', color: '#0A0F1C' },
  { name: 'C', size: 2, background: '#4B5563', color: '#F2F2F2' },
  { name: 'D', size: 2, background: '#1F2937', color: '#F2F2F2' },
];
