'use client';

interface FilterBarProps {
  activeFilter: 'recent' | 'best';
  onFilterChange: (filter: 'recent' | 'best') => void;
  labels: {
    recent: string;
    best: string;
  };
}

export function FilterBar({ activeFilter, onFilterChange, labels }: FilterBarProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onFilterChange('recent')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeFilter === 'recent'
            ? 'bg-primary text-background'
            : 'bg-card border border-card-border text-foreground-secondary hover:text-foreground'
        }`}
      >
        {labels.recent}
      </button>
      <button
        onClick={() => onFilterChange('best')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeFilter === 'best'
            ? 'bg-primary text-background'
            : 'bg-card border border-card-border text-foreground-secondary hover:text-foreground'
        }`}
      >
        {labels.best}
      </button>
    </div>
  );
}
