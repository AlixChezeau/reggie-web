import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('methodology');

  return {
    title: `${t('title')} | Reggie`,
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/${locale === 'fr' ? 'methodologie' : 'methodology'}`,
      languages: {
        fr: '/fr/methodologie',
        en: '/en/methodology',
      },
    },
  };
}

interface CriterionProps {
  label: string;
  description: string;
  maxValue: number;
}

function Criterion({ label, description, maxValue }: CriterionProps) {
  return (
    <div className="py-4 border-b border-card-border last:border-0">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-primary font-semibold">/{maxValue}</span>
      </div>
      <p className="text-sm text-foreground-secondary">{description}</p>
    </div>
  );
}

export default async function MethodologyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('methodology');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1
        className="text-4xl font-bold text-primary mb-6"
        style={{ fontFamily: 'var(--font-title)' }}
      >
        {t('title')}
      </h1>

      <p className="text-lg text-foreground-secondary mb-12 text-center">
        {t('intro')}
      </p>

      {/* Pre-match Section */}
      <section className="bg-card rounded-xl border border-card-border p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📅</span>
          <h2 className="text-2xl font-bold text-foreground">
            {t('prematch.title')}
          </h2>
        </div>
        <p className="text-foreground-secondary mb-6">
          {t('prematch.subtitle')}
        </p>

        <div>
          <Criterion
            label={t('prematch.stakes.label')}
            description={t('prematch.stakes.description')}
            maxValue={55}
          />
          <Criterion
            label={t('prematch.stars.label')}
            description={t('prematch.stars.description')}
            maxValue={15}
          />
          <Criterion
            label={t('prematch.form.label')}
            description={t('prematch.form.description')}
            maxValue={30}
          />
        </div>

        <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-card-border">
          <span className="font-semibold text-foreground">{t('total')}</span>
          <span className="text-2xl font-bold text-primary">/100</span>
        </div>
      </section>

      {/* Post-match Section */}
      <section className="bg-card rounded-xl border border-card-border p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">✅</span>
          <h2 className="text-2xl font-bold text-foreground">
            {t('postmatch.title')}
          </h2>
        </div>
        <p className="text-foreground-secondary mb-6">
          {t('postmatch.subtitle')}
        </p>

        <div>
          <Criterion
            label={t('postmatch.stakes.label')}
            description={t('postmatch.stakes.description')}
            maxValue={30}
          />
          <Criterion
            label={t('postmatch.stars.label')}
            description={t('postmatch.stars.description')}
            maxValue={15}
          />
          <Criterion
            label={t('postmatch.performances.label')}
            description={t('postmatch.performances.description')}
            maxValue={20}
          />
          <Criterion
            label={t('postmatch.clutch.label')}
            description={t('postmatch.clutch.description')}
            maxValue={35}
          />
        </div>

        <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-card-border">
          <span className="font-semibold text-foreground">{t('total')}</span>
          <span className="text-2xl font-bold text-primary">/100</span>
        </div>
      </section>

      {/* Footer Note */}
      <p className="text-center text-sm text-foreground-muted">
        {t('footer')}
      </p>
    </div>
  );
}
