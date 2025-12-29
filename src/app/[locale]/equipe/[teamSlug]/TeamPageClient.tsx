'use client';

import { useState, useMemo } from 'react';
import { Match } from '@/types';
import { FilterBar } from '@/components/team/FilterBar';
import { MatchesList } from '@/components/team/MatchesList';

interface TeamPageClientProps {
  matches: Match[];
  locale: 'fr' | 'en';
  labels: {
    allMatches: string;
    filterRecent: string;
    filterBest: string;
    noMatches: string;
  };
}

export function TeamPageClient({ matches, locale, labels }: TeamPageClientProps) {
  const [filter, setFilter] = useState<'recent' | 'best'>('recent');

  const sortedMatches = useMemo(() => {
    if (filter === 'best') {
      return [...matches].sort((a, b) => {
        const ratingA = a.analysis?.match_interest_score
          ? a.analysis.match_interest_score / 10
          : a.analysis?.rating || 0;
        const ratingB = b.analysis?.match_interest_score
          ? b.analysis.match_interest_score / 10
          : b.analysis?.rating || 0;
        return ratingB - ratingA;
      });
    }
    // Default: recent (already sorted by date desc from query)
    return matches;
  }, [matches, filter]);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">{labels.allMatches}</h2>

      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        labels={{
          recent: labels.filterRecent,
          best: labels.filterBest,
        }}
      />

      <MatchesList
        matches={sortedMatches}
        locale={locale}
        emptyMessage={labels.noMatches}
      />
    </div>
  );
}
