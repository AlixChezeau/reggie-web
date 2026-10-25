import { Team } from '@/types';

interface TeamLogoProps {
  team: Pick<Team, 'primaryColor' | 'secondaryColor'>;
  size?: number;
  className?: string;
}

/**
 * Pastille aux couleurs de l'équipe (principale en haut à gauche, secondaire en bas à droite), comme dans l'app.
 * Pas de logo officiel : les logos des équipes sont des marques de la NBA (refus App Store d'octobre 2026).
 * Le nom ou l'abréviation est toujours écrit à côté : la pastille est décorative.
 */
export function TeamLogo({ team, size = 48, className = '' }: TeamLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${team.primaryColor} 50%, ${team.secondaryColor} 50%)`,
        boxShadow: 'inset 0 0 0 1px rgba(128, 128, 128, 0.45)',
      }}
    />
  );
}
