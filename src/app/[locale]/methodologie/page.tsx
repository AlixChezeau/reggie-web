import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { DisplayVerdict } from '@/lib/verdict';
import { routes } from '@/lib/routes';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'methodology' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: routes.methodology(locale as 'fr' | 'en'),
      languages: { fr: '/fr/methodologie', en: '/en/methodology' },
    },
  };
}

function points(value: number, locale: string): string {
  const text = value.toFixed(1).replace(/\.0$/, '');
  return locale === 'fr' ? text.replace('.', ',') : text;
}

function Criterion({ label, text, value, locale, unit }: { label: string; text?: string; value: number; locale: string; unit: string }) {
  return (
    <li className="py-3.5 border-t border-card-border">
      <div className="flex justify-between font-semibold">
        <span>{label}</span>
        <span className="text-primary">{unit.replace('{value}', points(value, locale))}</span>
      </div>
      <div className="h-2 rounded-full bg-card-border overflow-hidden mt-2" aria-hidden="true">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value * 10}%` }} />
      </div>
      {text && <p className="text-sm text-foreground-secondary mt-2">{text}</p>}
    </li>
  );
}

/** Comment Reggie note : note sur 10, quatre verdicts, critères avant et après le match (barème de l'app). */
export default async function MethodologyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('methodology');
  const l = locale as 'fr' | 'en';
  const unit = t.raw('points') as string;

  const verdicts: { verdict: DisplayVerdict; key: string }[] = [
    { verdict: 'epic', key: 'epic' },
    { verdict: 'must_watch', key: 'mustWatch' },
    { verdict: 'worth_it', key: 'worthIt' },
    { verdict: 'skip', key: 'skip' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <h1 className="font-title text-5xl md:text-6xl leading-[0.95]">{t('title')}</h1>
        <p className="text-lg text-foreground-secondary leading-relaxed">{t('intro')}</p>
      </header>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground-secondary mb-2">{t('verdictsTitle')}</h2>
        <ul>
          {verdicts.map(({ verdict, key }) => (
            <li key={key} className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-3 py-3.5 border-t border-card-border">
              <VerdictPill verdict={verdict} locale={l} className="justify-self-start" />
              <span className="text-foreground-secondary">{t(key)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">{t('postTitle')}</h2>
        <p className="text-foreground-secondary mt-1 mb-3">{t('postIntro')}</p>
        <ul>
          <Criterion label={t('suspense')} text={t('suspenseText')} value={3.5} locale={locale} unit={unit} />
          <Criterion label={t('stakes')} text={t('stakesText')} value={3} locale={locale} unit={unit} />
          <Criterion label={t('performances')} text={t('performancesText')} value={2} locale={locale} unit={unit} />
          <Criterion label={t('stars')} text={t('starsText')} value={1.5} locale={locale} unit={unit} />
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">{t('preTitle')}</h2>
        <p className="text-foreground-secondary mt-1 mb-3">{t('preIntro')}</p>
        <ul>
          <Criterion label={t('preStakes')} value={5.5} locale={locale} unit={unit} />
          <Criterion label={t('preForm')} value={3} locale={locale} unit={unit} />
          <Criterion label={t('preStars')} value={1.5} locale={locale} unit={unit} />
        </ul>
        <p className="text-sm text-foreground-secondary mt-3">{t('earlySeason')}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">{t('aiTitle')}</h2>
        <p className="text-foreground-secondary leading-relaxed">{t('aiText')}</p>
      </section>

      <section className="rounded-2xl bg-surface border border-card-border p-5 flex flex-col gap-2">
        <h2 className="font-bold">{t('limitsTitle')}</h2>
        <p className="text-foreground-secondary leading-relaxed">{t('limitsText')}</p>
      </section>
    </div>
  );
}
