import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('privacy');

  return {
    title: `${t('title')} | Reggie`,
    description: t('description'),
    alternates: {
      canonical: `/${locale}/${locale === 'fr' ? 'confidentialite' : 'privacy'}`,
      languages: {
        fr: '/fr/confidentialite',
        en: '/en/privacy',
      },
    },
  };
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="text-foreground-secondary space-y-3">{children}</div>
    </section>
  );
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('privacy');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1
        className="text-4xl font-bold text-primary mb-4"
        style={{ fontFamily: 'var(--font-title)' }}
      >
        {t('title')}
      </h1>

      <p className="text-sm text-foreground-muted mb-8">
        {t('lastUpdated')}: {t('lastUpdatedDate')}
      </p>

      <div className="bg-card rounded-xl border border-card-border p-6 mb-8">
        <p className="text-foreground-secondary">{t('intro')}</p>
      </div>

      {/* Editor */}
      <Section title={t('editor.title')}>
        <p>
          <strong>{t('editor.name')}:</strong> MRC Digital
        </p>
        <p>
          <strong>{t('editor.contact')}:</strong> contact@reggie.app
        </p>
      </Section>

      {/* Data Collected */}
      <Section title={t('dataCollected.title')}>
        <div className="bg-card rounded-lg border border-card-border p-4 mb-4">
          <h3 className="font-semibold text-foreground mb-2">
            {t('dataCollected.website.title')}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>{t('dataCollected.website.noPersonalData')}</li>
            <li>{t('dataCollected.website.noAccount')}</li>
            <li>{t('dataCollected.website.theme')}</li>
            <li>{t('dataCollected.website.language')}</li>
          </ul>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-4">
          <h3 className="font-semibold text-foreground mb-2">
            {t('dataCollected.mobile.title')}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>{t('dataCollected.mobile.favoriteTeam')}</li>
            <li>{t('dataCollected.mobile.theme')}</li>
            <li>{t('dataCollected.mobile.language')}</li>
            <li>{t('dataCollected.mobile.systemLanguage')}</li>
          </ul>
        </div>
      </Section>

      {/* Data Not Collected */}
      <Section title={t('dataNotCollected.title')}>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('dataNotCollected.personalInfo')}</li>
          <li>{t('dataNotCollected.location')}</li>
          <li>{t('dataNotCollected.advertisingId')}</li>
          <li>{t('dataNotCollected.biometric')}</li>
          <li>{t('dataNotCollected.browsingHistory')}</li>
          <li>{t('dataNotCollected.analytics')}</li>
        </ul>
      </Section>

      {/* Cookies */}
      <Section title={t('cookies.title')}>
        <p>{t('cookies.website')}</p>
        <p>{t('cookies.mobile')}</p>
      </Section>

      {/* Third Party Services */}
      <Section title={t('thirdParty.title')}>
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-card-border p-4">
            <h3 className="font-semibold text-foreground mb-2">Supabase</h3>
            <p className="text-sm">{t('thirdParty.supabase')}</p>
          </div>

          <div className="bg-card rounded-lg border border-card-border p-4">
            <h3 className="font-semibold text-foreground mb-2">Expo</h3>
            <p className="text-sm">{t('thirdParty.expo')}</p>
          </div>
        </div>
      </Section>

      {/* Legal Basis */}
      <Section title={t('legalBasis.title')}>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('legalBasis.legitimateInterest')}</li>
          <li>{t('legalBasis.consent')}</li>
        </ul>
      </Section>

      {/* Data Retention */}
      <Section title={t('dataRetention.title')}>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('dataRetention.preferences')}</li>
          <li>{t('dataRetention.nbaData')}</li>
        </ul>
      </Section>

      {/* User Rights */}
      <Section title={t('userRights.title')}>
        <p className="mb-3">{t('userRights.intro')}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('userRights.access')}</li>
          <li>{t('userRights.rectification')}</li>
          <li>{t('userRights.erasure')}</li>
          <li>{t('userRights.portability')}</li>
          <li>{t('userRights.objection')}</li>
        </ul>
        <p className="mt-3 text-sm italic">{t('userRights.note')}</p>
      </Section>

      {/* Security */}
      <Section title={t('security.title')}>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('security.https')}</li>
          <li>{t('security.localStorage')}</li>
          <li>{t('security.noTransmission')}</li>
        </ul>
      </Section>

      {/* Minors */}
      <Section title={t('minors.title')}>
        <p>{t('minors.content')}</p>
      </Section>

      {/* Changes */}
      <Section title={t('changes.title')}>
        <p>{t('changes.content')}</p>
      </Section>

      {/* Contact */}
      <Section title={t('contact.title')}>
        <p>{t('contact.content')}</p>
        <p className="mt-2">
          <strong>Email:</strong>{' '}
          <a
            href="mailto:contact@reggie.app"
            className="text-primary hover:underline"
          >
            contact@reggie.app
          </a>
        </p>
      </Section>
    </div>
  );
}
