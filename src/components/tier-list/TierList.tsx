'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DEMO_PLAYERS } from './demoPlayers';
import { TIERS } from './tiers';
import { getBrowserClient } from '@/lib/supabase/browser';
import type { TierPlayer } from '@/lib/tierList';

/** Poids d'un vote dans l'aperçu : assez pour voir un joueur changer de place */
const VOTE_WEIGHT = 45;

const VOTER_KEY = 'reggie-voter-id';
const VOTES_KEY = 'reggie-tier-votes';

type Vote = 1 | -1 | 0;

/** Jour de Paris (AAAA-MM-JJ) : les votes repartent à zéro à minuit, comme dans la base */
function parisDay(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
}

/** Identifiant au hasard du visiteur, gardé dans le navigateur ; rien d'autre ne l'identifie */
function voterId(): string | null {
  try {
    let id = localStorage.getItem(VOTER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VOTER_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function readTodayVotes(): Record<string, Vote> {
  try {
    const saved = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
    return saved.day === parisDay() ? saved.votes || {} : {};
  } catch {
    return {};
  }
}

function saveTodayVotes(votes: Record<string, Vote>) {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify({ day: parisDay(), votes }));
  } catch {
    // Stockage bloqué (navigation privée) : les votes restent valables dans la base
  }
}

/** Les joueurs de l'aperçu, rangés dans les paliers selon leur score et les votes de la page */
function demoRanking(votes: Record<string, Vote>): TierPlayer[] {
  const ranked = DEMO_PLAYERS.map((p, index) => ({ ...p, index, live: p.score + (votes[String(index)] || 0) * VOTE_WEIGHT })).sort(
    (a, b) => b.live - a.live
  );
  let start = 0;
  return TIERS.flatMap((tier) => {
    const slice = ranked.slice(start, start + tier.size);
    const first = start;
    start += tier.size;
    return slice.map((p, i) => ({
      star_id: p.index,
      name: p.name,
      team: p.team,
      rank: first + i + 1,
      tier: tier.name as TierPlayer['tier'],
      trend: p.trend,
      votes_up_7d: 0,
      votes_down_7d: 0,
    }));
  });
}

/**
 * Tier list « il monte / il descend ».
 * Avec players : vrais votes, enregistrés par tier_list_vote (un par joueur et par jour).
 * Sans players : aperçu, les votes ne vivent que dans la page.
 */
export function TierList({ players }: { players: TierPlayer[] | null }) {
  const t = useTranslations('tierList');
  const live = players !== null;
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [ranking, setRanking] = useState<TierPlayer[] | null>(players);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lecture après l'affichage : le stockage du navigateur n'existe pas côté serveur,
    // le lire plus tôt ferait différer la page du rendu serveur
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (live) setVotes(readTodayVotes());
  }, [live]);

  const shown = useMemo(() => (live ? ranking || [] : demoRanking(votes)), [live, ranking, votes]);
  const tiers = TIERS.map((tier) => ({ ...tier, players: shown.filter((p) => p.tier === tier.name) }));

  const vote = async (player: TierPlayer, direction: 1 | -1) => {
    const key = String(player.star_id);
    const next: Vote = votes[key] === direction ? 0 : direction;
    const previous = votes;
    const updated = { ...votes, [key]: next };
    setVotes(updated);
    if (!live) return;

    setError(null);
    const supabase = getBrowserClient();
    const id = voterId();
    if (!supabase || !id) {
      setVotes(previous);
      setError(t('errorGeneric'));
      return;
    }
    const { error: voteError } = await supabase.rpc('tier_list_vote', {
      p_star_id: player.star_id,
      p_voter_id: id,
      p_direction: next === 0 ? null : next === 1 ? 'up' : 'down',
    });
    if (voteError) {
      setVotes(previous);
      setError(voteError.message.includes('too many') ? t('errorTooMany') : t('errorGeneric'));
      return;
    }
    saveTodayVotes(updated);
    const { data } = await supabase.rpc('tier_list_ranking');
    if (data?.length) setRanking(data as TierPlayer[]);
  };

  const myVotes = Object.values(votes).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-secondary" aria-live="polite">
        {t('yourVotes', { count: myVotes })}
      </p>
      {error && (
        <p role="alert" className="rounded-xl border border-card-border bg-card px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {tiers.map((tier) => (
        <section
          key={tier.name}
          aria-label={`Tier ${tier.name}`}
          className="grid grid-cols-[52px_minmax(0,1fr)] rounded-2xl overflow-hidden border border-card-border bg-card"
        >
          <span
            className="font-title text-4xl flex items-center justify-center"
            style={{ backgroundColor: tier.background, color: tier.color }}
          >
            {tier.name}
          </span>
          <ol className="flex flex-col">
            {tier.players.map((player) => {
              const current = votes[String(player.star_id)] || 0;
              const trend =
                player.trend > 0
                  ? { text: `▲ ${player.trend}`, label: t('trendUp', { count: player.trend }) }
                  : player.trend < 0
                    ? { text: `▼ ${-player.trend}`, label: t('trendDown', { count: -player.trend }) }
                    : { text: '=', label: t('trendSame') };
              return (
                <li key={player.star_id} className="flex items-center gap-2.5 px-3 py-2 border-t border-card-border first:border-t-0">
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-[15px] truncate">{player.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                      {player.team && (
                        <>
                          <Image src={`/teams/${player.team.toLowerCase()}.png`} alt="" width={16} height={16} className="w-4 h-4 object-contain" />
                          {player.team}
                        </>
                      )}
                      <span className="ml-1 font-semibold" aria-label={trend.label} title={trend.label}>
                        {trend.text}
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => vote(player, 1)}
                    aria-pressed={current === 1}
                    aria-label={t('up', { name: player.name })}
                    className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center transition-colors ${
                      current === 1 ? 'border-primary text-primary bg-primary/10' : 'border-card-border text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M6 15l6-6 6 6" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => vote(player, -1)}
                    aria-pressed={current === -1}
                    aria-label={t('down', { name: player.name })}
                    className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center transition-colors ${
                      current === -1 ? 'border-primary text-primary bg-primary/10' : 'border-card-border text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
