import { DisplayVerdict, Locale, verdictLabel } from '@/lib/verdict';

interface VerdictPillProps {
  verdict: DisplayVerdict;
  locale: Locale;
  size?: 'sm' | 'md' | 'lg';
  /** Toujours sur fond nuit (maquette de téléphone), quel que soit le thème du site */
  onDark?: boolean;
  className?: string;
}

const SIZES = {
  sm: 'text-[17px]',
  md: 'text-[22px]',
  lg: 'text-[34px]',
};

const VAR: Record<DisplayVerdict, string> = {
  epic: 'epic',
  must_watch: 'must-watch',
  worth_it: 'worth-it',
  skip: 'skip',
};

// Teintes du thème nuit, pour la maquette de téléphone qui reste sombre en thème clair
const ON_DARK: Record<DisplayVerdict, string> = {
  epic: '#A78BFA',
  must_watch: '#4ADE80',
  worth_it: '#FACC15',
  skip: '#F87171',
};

/**
 * Le verdict comme dans l'app depuis la 1.3.1 : le mot seul, en Bebas et en couleur, sans pastille derrière.
 * Teinte un peu plus claire sur fond nuit, un peu plus foncée sur fond parquet (variables --verdict-*).
 */
export function VerdictPill({ verdict, locale, size = 'md', onDark = false, className = '' }: VerdictPillProps) {
  return (
    <span
      className={`font-title inline-block whitespace-nowrap leading-none tracking-[0.02em] pt-[0.08em] ${SIZES[size]} ${className}`}
      style={{ color: onDark ? ON_DARK[verdict] : `var(--verdict-${VAR[verdict]})` }}
    >
      {verdictLabel(verdict, locale)}
    </span>
  );
}
