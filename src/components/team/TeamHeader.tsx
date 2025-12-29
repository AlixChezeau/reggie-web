import { Team } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';

interface TeamHeaderProps {
  team: Team;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="flex items-center gap-6 py-8">
      <TeamLogo team={team} size={96} />
      <div>
        <h1
          className="text-4xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-title)' }}
        >
          {team.city} {team.name}
        </h1>
        <p className="text-lg text-foreground-secondary">
          {team.conference === 'East' ? 'Eastern Conference' : 'Western Conference'}
        </p>
      </div>
    </div>
  );
}
