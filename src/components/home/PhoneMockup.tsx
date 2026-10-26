import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Match } from '@/types';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { DisplayVerdict, Locale, matchVerdict, verdictColor } from '@/lib/verdict';

interface PhoneMockupProps {
  matches: Match[];
  locale: Locale;
}

type Row = { label: string; verdict: DisplayVerdict };

/** Exemple affiché s'il n'y a pas encore de nuit terminée (début de saison, panne de données) */
const EXAMPLE: Row[] = [
  { label: 'PHI – BOS', verdict: 'epic' },
  { label: 'CLE – DET', verdict: 'must_watch' },
  { label: 'ATL – ORL', verdict: 'worth_it' },
  { label: 'MIN – MIA', verdict: 'skip' },
];

/** Aperçu de l'app : l'écran du matin avec la vraie dernière nuit. Décoratif pour les lecteurs d'écran. */
export async function PhoneMockup({ matches, locale }: PhoneMockupProps) {
  const t = await getTranslations('home');
  const rows: Row[] = matches.length
    ? matches.flatMap((m) => {
        const verdict = matchVerdict(m);
        return verdict ? [{ label: `${m.away_team.abbreviation} – ${m.home_team.abbreviation}`, verdict }] : [];
      })
    : EXAMPLE;

  return (
    <div aria-hidden="true" className="w-[260px] sm:w-[300px] h-[500px] sm:h-[560px] rounded-[44px] border-[9px] border-[#1C2436] bg-[#0A0F1C] p-4 flex flex-col gap-3 overflow-hidden shadow-2xl shadow-black/40 text-[#F2F2F2]">
      <div className="mx-auto mt-1 mb-1 h-5 w-24 rounded-full bg-[#1C2436]" />
      <Image src="/brand/reggie-logo.svg" alt="" width={90} height={48} className="h-8 w-auto self-center" />
      <p className="text-center text-[11px] text-[#9CA3AF] -mt-1">Watch smart. No spoilers.</p>
      <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col gap-2">
        <span className="text-[12px] font-semibold">{t('phoneTitle', { count: rows.length })}</span>
        <div className="flex flex-wrap gap-1">
          {rows.slice(0, 12).map((row, i) => (
            <span key={i} className="w-5 h-5 rounded-[5px]" style={{ backgroundColor: verdictColor(row.verdict) }} />
          ))}
        </div>
      </div>
      {rows.slice(0, 5).map((row, i) => (
        <div key={i} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5 text-[13px] font-semibold">
          <span>{row.label}</span>
          <VerdictPill verdict={row.verdict} locale={locale} size="sm" onDark />
        </div>
      ))}
    </div>
  );
}
