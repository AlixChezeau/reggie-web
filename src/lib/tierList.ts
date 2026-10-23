/** Un joueur de la tier list, tel que le renvoie tier_list_ranking (Reggie, migration 034) */
export interface TierPlayer {
  star_id: number;
  name: string;
  /** Sigle de l'équipe, absent pour un joueur sans club */
  team: string | null;
  rank: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  /** Places gagnées (+) ou perdues (−) depuis dimanche dernier */
  trend: number;
  votes_up_7d: number;
  votes_down_7d: number;
}
