'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TeamStanding } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';

interface StandingsSectionProps {
  east: TeamStanding[];
  west: TeamStanding[];
  locale: 'fr' | 'en';
  title: string;
  labels: {
    east: string;
    west: string;
    rank: string;
    team: string;
    wins: string;
    losses: string;
    pct: string;
    last10: string;
    streak: string;
  };
}

function StandingsTable({
  standings,
  locale,
  labels,
}: {
  standings: TeamStanding[];
  locale: 'fr' | 'en';
  labels: StandingsSectionProps['labels'];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left py-3 px-2 text-xs font-semibold text-foreground-secondary">
              {labels.rank}
            </th>
            <th className="text-left py-3 px-2 text-xs font-semibold text-foreground-secondary">
              {labels.team}
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-foreground-secondary">
              {labels.wins}
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-foreground-secondary">
              {labels.losses}
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-foreground-secondary hidden sm:table-cell">
              {labels.pct}
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-foreground-secondary hidden md:table-cell">
              {labels.last10}
            </th>
            <th className="text-center py-3 px-2 text-xs font-semibold text-foreground-secondary hidden md:table-cell">
              {labels.streak}
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr
              key={standing.team.id}
              className="border-b border-card-border/50 hover:bg-card-hover transition-colors"
            >
              <td className="py-3 px-2 text-sm font-medium text-foreground">
                {standing.conference_rank}
              </td>
              <td className="py-3 px-2">
                <Link
                  href={`/${locale}/${locale === 'fr' ? 'equipe' : 'team'}/${standing.team.slug}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <TeamLogo team={standing.team} size={24} />
                  <span className="text-sm font-medium text-foreground">
                    {standing.team.abbreviation}
                  </span>
                </Link>
              </td>
              <td className="py-3 px-2 text-center text-sm text-foreground">
                {standing.wins}
              </td>
              <td className="py-3 px-2 text-center text-sm text-foreground">
                {standing.losses}
              </td>
              <td className="py-3 px-2 text-center text-sm text-foreground-secondary hidden sm:table-cell">
                {(standing.win_pct * 100).toFixed(1)}%
              </td>
              <td className="py-3 px-2 text-center text-sm text-foreground-secondary hidden md:table-cell">
                {standing.last_10}
              </td>
              <td className="py-3 px-2 text-center text-sm text-foreground-secondary hidden md:table-cell">
                <span
                  className={
                    standing.streak.startsWith('W')
                      ? 'text-success'
                      : standing.streak.startsWith('L')
                      ? 'text-error'
                      : ''
                  }
                >
                  {standing.streak}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StandingsSection({
  east,
  west,
  locale,
  title,
  labels,
}: StandingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'east' | 'west'>('east');

  return (
    <section id="standings" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl font-bold text-primary mb-6"
          style={{ fontFamily: 'var(--font-title)' }}
        >
          {title}
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('east')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'east'
                ? 'bg-primary text-background'
                : 'bg-card border border-card-border text-foreground-secondary hover:text-foreground'
            }`}
          >
            {labels.east}
          </button>
          <button
            onClick={() => setActiveTab('west')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'west'
                ? 'bg-primary text-background'
                : 'bg-card border border-card-border text-foreground-secondary hover:text-foreground'
            }`}
          >
            {labels.west}
          </button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-card-border p-4">
          <StandingsTable
            standings={activeTab === 'east' ? east : west}
            locale={locale}
            labels={labels}
          />
        </div>
      </div>
    </section>
  );
}
