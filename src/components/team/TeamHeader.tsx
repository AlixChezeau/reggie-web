import { getTranslations } from 'next-intl/server';
import { Team } from '@/types';
import { TeamLogo } from '@/components/ui/TeamLogo';

export async function TeamHeader({ team }: { team: Team }) {
  const t = await getTranslations('teams');
  return (
    <div className="flex items-center gap-5 py-8">
      <TeamLogo team={team} size={88} />
      <div>
        <h1 className="font-title text-4xl md:text-5xl leading-none">
          {team.city} {team.name}
        </h1>
        <p className="text-foreground-secondary mt-1">{team.conference === 'East' ? t('eastern') : t('western')}</p>
      </div>
    </div>
  );
}
