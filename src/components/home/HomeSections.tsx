import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Match } from '@/types';
import { AppStoreButton } from '@/components/ui/AppStoreButton';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { NightTiles } from '@/components/night/NightTiles';
import { NightLegend } from '@/components/night/NightLegend';
import { MatchRow } from '@/components/night/MatchRow';
import { PhoneMockup } from './PhoneMockup';
import { Locale } from '@/lib/verdict';
import { nightTitle } from '@/lib/utils/dates';
import { routes } from '@/lib/routes';

type Night = { date: string; matches: Match[] } | null;

const container = 'max-w-6xl mx-auto px-4 sm:px-6';
const kicker = 'text-xs font-bold uppercase tracking-[0.14em]';

export async function Hero({ lastNight, locale }: { lastNight: Night; locale: Locale }) {
  const t = await getTranslations('home');
  const tStore = await getTranslations('appStore');
  return (
    <section className={`${container} pt-10 pb-12 md:pt-16 md:pb-16 grid md:grid-cols-[minmax(0,1fr)_340px] gap-10 md:gap-14 items-center`}>
      <div className="flex flex-col gap-5">
        <p className={`${kicker} text-primary`}>{t('tagline')}</p>
        <h1 className="font-title text-[52px] leading-[0.95] sm:text-7xl md:text-[96px]">{t('title')}</h1>
        <p className="text-lg md:text-xl leading-relaxed text-foreground-secondary max-w-xl">{t('intro')}</p>
        <div className="flex flex-wrap items-center gap-4">
          <AppStoreButton campaign="accueil-haut" size="lg" />
          <span className="text-sm text-foreground-secondary">{tStore('free')}</span>
        </div>
      </div>
      <div className="flex justify-center">
        <PhoneMockup matches={lastNight?.matches || []} locale={locale} />
      </div>
    </section>
  );
}

export async function LastNightProof({ lastNight, locale }: { lastNight: Night; locale: Locale }) {
  const t = await getTranslations('home');
  return (
    <section aria-labelledby="la-nuit" className={container}>
      <div className="rounded-3xl bg-surface border border-card-border p-5 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6">
          <div className="flex flex-col gap-2">
            <p className={`${kicker} text-primary`}>{t('proofKicker')}</p>
            <h2 id="la-nuit" className="font-title text-4xl md:text-5xl leading-none">
              {lastNight ? nightTitle(lastNight.date, locale) : t('proofKicker')}
            </h2>
          </div>
          {lastNight && (
            <p className="text-foreground-secondary md:pb-1">{t('proofQuestion', { count: lastNight.matches.length })}</p>
          )}
          {lastNight && (
            <Link href={routes.night(locale, lastNight.date)} className="md:ml-auto md:pb-1 font-semibold text-primary">
              {t('seeNight')} →
            </Link>
          )}
        </div>
        {lastNight ? (
          <>
            <NightTiles
              matches={lastNight.matches}
              locale={locale}
              gridClassName="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-2.5"
              tileClassName="h-[68px] md:h-[110px] text-[15px] md:text-[22px]"
            />
            <NightLegend matches={lastNight.matches} locale={locale} />
          </>
        ) : (
          <p className="text-foreground-secondary">{t('noNight')}</p>
        )}
      </div>
    </section>
  );
}

export async function HowItWorks() {
  const t = await getTranslations('home');
  const steps = [1, 2, 3] as const;
  return (
    <section id="comment-ca-marche" aria-labelledby="comment-titre" className={`${container} pt-16 scroll-mt-20`}>
      <h2 id="comment-titre" className={`${kicker} text-foreground-secondary mb-5`}>{t('howTitle')}</h2>
      <ol className="grid md:grid-cols-3 gap-4">
        {steps.map((n) => (
          <li key={n} className="rounded-2xl bg-card border border-card-border p-6 flex flex-col gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center">{n}</span>
            <h3 className="text-lg font-bold">{t(`how${n}Title`)}</h3>
            <p className="text-foreground-secondary leading-relaxed">{t(`how${n}Text`)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export async function VerdictsAndComingUp({ nextNight, locale }: { nextNight: Night; locale: Locale }) {
  const t = await getTranslations('home');
  return (
    <section className={`${container} pt-16 grid md:grid-cols-2 gap-10`}>
      <div className="flex flex-col gap-4">
        <h2 className={`${kicker} text-foreground-secondary`}>{t('verdictsTitle')}</h2>
        <div className="flex flex-wrap gap-2">
          <VerdictPill verdict="epic" locale={locale} />
          <VerdictPill verdict="must_watch" locale={locale} />
          <VerdictPill verdict="worth_it" locale={locale} />
          <VerdictPill verdict="skip" locale={locale} />
        </div>
        <div className="rounded-2xl bg-card border border-card-border p-5">
          <h3 className="font-bold">{t('zeroTitle')}</h3>
          <p className="text-foreground-secondary mt-1">{t('zeroText')}</p>
        </div>
        <div className="rounded-2xl bg-card border border-card-border p-5">
          <h3 className="font-bold">{t('dreamTitle')}</h3>
          <p className="text-foreground-secondary mt-1">{t('dreamText')}</p>
        </div>
      </div>
      {nextNight && (
        <div className="flex flex-col gap-3">
          <h2 className={`${kicker} text-foreground-secondary`}>
            {t('tonightTitle')} · <span className="normal-case tracking-normal">{nightTitle(nextNight.date, locale)}</span>
          </h2>
          {nextNight.matches.slice(0, 5).map((match) => (
            <MatchRow key={match.id} match={match} locale={locale} />
          ))}
          <p className="text-sm text-foreground-secondary">
            {t('tonightNote')}{' '}
            {nextNight.matches.length > 5 && (
              <Link href={routes.night(locale, nextNight.date)} className="font-semibold text-primary">
                +{nextNight.matches.length - 5} →
              </Link>
            )}
          </p>
        </div>
      )}
    </section>
  );
}

const ICONS = [
  <path key="b" d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" />,
  <g key="w"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="18" height="8" rx="2" /></g>,
  <g key="g"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01" /></g>,
  <g key="t"><rect x="2" y="5" width="20" height="13" rx="2" /><path d="M8 21h8" /></g>,
];

export async function AppFeatures() {
  const t = await getTranslations('home');
  return (
    <section aria-labelledby="app-titre" className={`${container} pt-16`}>
      <h2 id="app-titre" className={`${kicker} text-foreground-secondary mb-5`}>{t('appTitle')}</h2>
      <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {ICONS.map((icon, i) => (
          <li key={i} className="flex md:flex-col gap-3">
            <span className="w-10 h-10 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </span>
            <span>
              <span className="block font-bold">{t(`feat${i + 1}Title`)}</span>
              <span className="text-sm text-foreground-secondary leading-relaxed">{t(`feat${i + 1}Text`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function FaqAndCta() {
  const t = await getTranslations('home');
  const questions = [1, 2, 3, 4] as const;
  return (
    <section className={`${container} pt-16 grid md:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start`}>
      <div>
        <h2 className={`${kicker} text-foreground-secondary mb-2`}>{t('faqTitle')}</h2>
        <dl>
          {questions.map((n) => (
            <div key={n} className="py-4 border-b border-card-border">
              <dt className="font-semibold">{t(`q${n}`)}</dt>
              <dd className="text-foreground-secondary mt-1 leading-relaxed">{t(`a${n}`)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-3xl bg-surface border border-card-border p-7 flex flex-col items-start gap-4">
        <p className="text-2xl font-bold leading-snug">{t('ctaTitle')}</p>
        <AppStoreButton campaign="accueil-bas" variant="text" />
      </div>
    </section>
  );
}
