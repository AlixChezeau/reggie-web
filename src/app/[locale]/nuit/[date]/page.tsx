import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { addDays, format } from 'date-fns';
import { getNight } from '@/lib/supabase/queries';
import { NightTiles } from '@/components/night/NightTiles';
import { NightLegend } from '@/components/night/NightLegend';
import { MatchRow } from '@/components/night/MatchRow';
import { AppStoreButton } from '@/components/ui/AppStoreButton';
import { nightTitle } from '@/lib/utils/dates';
import { routes } from '@/lib/routes';

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; date: string }> };

function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(`${date}T12:00:00Z`).getTime());
}

function shift(date: string, days: number): string {
  return format(addDays(new Date(`${date}T12:00:00Z`), days), 'yyyy-MM-dd');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, date } = await params;
  if (!isValidDate(date)) return {};
  const l = locale as 'fr' | 'en';
  const t = await getTranslations({ locale, namespace: 'night' });
  const title = nightTitle(date, l);
  return {
    title,
    description: t('metaDescription', { title }),
    alternates: {
      canonical: routes.night(l, date),
      languages: { fr: routes.night('fr', date), en: routes.night('en', date) },
    },
  };
}

/** Une nuit : la grille en couleurs puis toutes les affiches, par heure de début. Jamais de score. */
export default async function NightPage({ params }: Props) {
  const { locale: rawLocale, date } = await params;
  if (!isValidDate(date)) notFound();
  const locale = rawLocale as 'fr' | 'en';
  setRequestLocale(locale);

  const t = await getTranslations('night');
  const tStore = await getTranslations('home');
  const matches = await getNight(date);
  const rated = matches.filter((m) => m.status === 'finished' && m.analysis);
  const upcoming = matches.length > 0 && rated.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{t('kicker')}</p>
        <h1 className="font-title text-5xl md:text-6xl leading-[0.95]">{nightTitle(date, locale)}</h1>
        {matches.length > 0 && (
          <p className="text-lg text-foreground-secondary">
            {upcoming ? t('upcoming', { count: matches.length }) : t('question', { count: rated.length })}
          </p>
        )}
      </header>

      {rated.length > 0 && (
        <div className="flex flex-col gap-3">
          <NightTiles matches={rated} locale={locale} gridClassName="grid grid-cols-4 sm:grid-cols-6 gap-2" tileClassName="h-20 text-base" />
          <NightLegend matches={rated} locale={locale} />
        </div>
      )}

      {matches.length === 0 ? (
        <p className="text-foreground-secondary">{t('empty')}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {matches.map((match) => (
            <MatchRow key={match.id} match={match} locale={locale} withText />
          ))}
        </div>
      )}

      <nav aria-label={t('kicker')} className="flex justify-between gap-4 text-sm font-semibold">
        <Link href={routes.night(locale, shift(date, -1))} className="text-primary">← {t('previous')}</Link>
        <Link href={routes.night(locale, shift(date, 1))} className="text-primary">{t('next')} →</Link>
      </nav>

      <section className="rounded-3xl bg-surface border border-card-border p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-lg font-bold flex-1">{tStore('ctaTitle')}</p>
        <AppStoreButton campaign="page-nuit" />
      </section>
    </div>
  );
}
