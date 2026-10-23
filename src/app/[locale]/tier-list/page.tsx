import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TierList } from '@/components/tier-list/TierList';
import { AppStoreButton } from '@/components/ui/AppStoreButton';
import { routes } from '@/lib/routes';
import { getTierListRanking } from '@/lib/supabase/queries';

// Le classement bouge avec les votes : la page se régénère chaque minute
export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tierList' });
  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: { canonical: routes.tierList(locale as 'fr' | 'en'), languages: { fr: '/fr/tier-list', en: '/en/tier-list' } },
  };
}

/** Tier list des fans : vrais votes si la base répond, sinon aperçu avec des données d'exemple. */
export default async function TierListPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tierList');
  const tHome = await getTranslations('home');
  const players = await getTierListRanking();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{t('kicker')}</p>
        <h1 className="font-title text-5xl md:text-6xl leading-[0.95]">{t('title')}</h1>
        <p className="text-lg text-foreground-secondary leading-relaxed">{t('intro')}</p>
      </header>

      {!players && (
        <p role="note" className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
          {t('demo')}
        </p>
      )}

      <TierList players={players} />

      <section className="rounded-2xl bg-surface border border-card-border p-5 flex flex-col gap-2">
        <h2 className="font-bold">{t('howTitle')}</h2>
        <p className="text-foreground-secondary leading-relaxed">{t('howText')}</p>
      </section>

      <section className="rounded-3xl bg-surface border border-card-border p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-lg font-bold flex-1">{tHome('ctaTitle')}</p>
        <AppStoreButton campaign="tier-list" />
      </section>
    </div>
  );
}
