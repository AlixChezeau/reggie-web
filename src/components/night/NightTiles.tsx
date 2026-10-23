import Link from 'next/link';
import { Match } from '@/types';
import { Locale, matchVerdict, verdictColor, verdictLabel } from '@/lib/verdict';
import { routes } from '@/lib/routes';

interface NightTilesProps {
  matches: Match[];
  locale: Locale;
  /** Classes de la grille (nombre de colonnes selon la place) */
  gridClassName?: string;
  tileClassName?: string;
}

/** « La nuit en couleurs » : un carré par match, à la couleur de son verdict. Jamais de score. */
export function NightTiles({
  matches,
  locale,
  gridClassName = 'grid grid-cols-4 gap-2',
  tileClassName = 'h-20 text-base',
}: NightTilesProps) {
  return (
    <ul className={gridClassName}>
      {matches.map((match) => {
        const verdict = matchVerdict(match);
        if (!verdict || !match.slug) return null;
        const label = `${match.away_team.abbreviation} – ${match.home_team.abbreviation} : ${verdictLabel(verdict, locale)}`;
        return (
          <li key={match.id}>
            <Link
              href={routes.match(locale, match.slug)}
              aria-label={label}
              title={label}
              className={`font-title flex items-end rounded-xl p-2.5 leading-none text-[#0A0F1C] hover:opacity-85 transition-opacity ${tileClassName}`}
              style={{ backgroundColor: verdictColor(verdict) }}
            >
              <span aria-hidden="true">
                {match.away_team.abbreviation}
                <br />
                {match.home_team.abbreviation}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
