import { DisplayVerdict, Locale, verdictColor, verdictLabel } from '@/lib/verdict';

interface VerdictPillProps {
  verdict: DisplayVerdict;
  locale: Locale;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'text-[15px] px-2.5 py-1',
  md: 'text-lg px-3 py-1',
  lg: 'text-[22px] px-4 py-1.5',
};

/** La pastille de verdict de l'app : fond de couleur, libellé en Bebas couleur nuit. */
export function VerdictPill({ verdict, locale, size = 'md', className = '' }: VerdictPillProps) {
  return (
    <span
      className={`font-title inline-flex items-center justify-center whitespace-nowrap rounded-full leading-none ${SIZES[size]} ${className}`}
      style={{ backgroundColor: verdictColor(verdict), color: '#0A0F1C' }}
    >
      {verdictLabel(verdict, locale)}
    </span>
  );
}
