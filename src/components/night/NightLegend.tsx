import { Match } from '@/types';
import { DisplayVerdict, Locale, matchVerdict, verdictColor, verdictLabelForCount } from '@/lib/verdict';

const ORDER: DisplayVerdict[] = ['epic', 'must_watch', 'worth_it', 'skip'];

/** « 1 Épique · 2 Immanquables · 3 À voir · 2 À zapper » : la couleur n'est jamais seule */
export function NightLegend({ matches, locale }: { matches: Match[]; locale: Locale }) {
  const counts = new Map<DisplayVerdict, number>();
  for (const match of matches) {
    const verdict = matchVerdict(match);
    if (verdict) counts.set(verdict, (counts.get(verdict) || 0) + 1);
  }

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-foreground-secondary">
      {ORDER.filter((v) => counts.get(v)).map((verdict) => (
        <li key={verdict} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: verdictColor(verdict) }} />
          {counts.get(verdict)} {verdictLabelForCount(verdict, counts.get(verdict) || 0, locale)}
        </li>
      ))}
    </ul>
  );
}
