'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DEMO_PLAYERS, TIERS } from './demoPlayers';

/** Poids d'un vote dans l'aperçu : assez pour voir un joueur changer de place */
const VOTE_WEIGHT = 45;

/**
 * Tier list « il monte / il descend ». Aperçu sans enregistrement : les votes ne vivent
 * que dans la page (voir le TODO de demoPlayers.ts).
 */
export function TierList() {
  const t = useTranslations('tierList');
  const [votes, setVotes] = useState<Record<string, 1 | -1 | 0>>({});

  const tiers = useMemo(() => {
    const ranked = DEMO_PLAYERS.map((p) => ({ ...p, live: p.score + (votes[p.id] || 0) * VOTE_WEIGHT })).sort(
      (a, b) => b.live - a.live
    );
    return TIERS.map((tier, index) => {
      const start = TIERS.slice(0, index).reduce((sum, previous) => sum + previous.size, 0);
      return { ...tier, players: ranked.slice(start, start + tier.size) };
    });
  }, [votes]);

  const vote = (id: string, direction: 1 | -1) =>
    setVotes((current) => ({ ...current, [id]: current[id] === direction ? 0 : direction }));

  const myVotes = Object.values(votes).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-secondary" aria-live="polite">
        {t('yourVotes', { count: myVotes })}
      </p>
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
              const current = votes[player.id] || 0;
              const trend =
                player.trend > 0
                  ? { text: `▲ ${player.trend}`, label: t('trendUp', { count: player.trend }) }
                  : player.trend < 0
                    ? { text: `▼ ${-player.trend}`, label: t('trendDown', { count: -player.trend }) }
                    : { text: '=', label: t('trendSame') };
              return (
                <li key={player.id} className="flex items-center gap-2.5 px-3 py-2 border-t border-card-border first:border-t-0">
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-[15px] truncate">{player.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                      <Image src={`/teams/${player.team.toLowerCase()}.png`} alt="" width={16} height={16} className="w-4 h-4 object-contain" />
                      {player.team}
                      <span className="ml-1 font-semibold" aria-label={trend.label} title={trend.label}>
                        {trend.text}
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => vote(player.id, 1)}
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
                    onClick={() => vote(player.id, -1)}
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
