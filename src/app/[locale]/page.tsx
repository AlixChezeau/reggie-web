import { setRequestLocale } from 'next-intl/server';
import { getLastNight, getNextNight } from '@/lib/supabase/queries';
import { Hero, LastNightProof, HowItWorks, VerdictsAndComingUp, AppFeatures, FaqAndCta } from '@/components/home/HomeSections';
import { generateWebsiteJsonLd } from '@/lib/seo/jsonld';

// Les verdicts arrivent dans la matinée : la page se régénère toutes les 5 minutes
export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Accueil « C+B » : l'app d'abord (promesse, App Store, aperçu), puis la dernière nuit
 * en couleurs comme preuve. Aucun score, aucun vainqueur.
 */
export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as 'fr' | 'en';
  setRequestLocale(locale);

  const [lastNight, nextNight] = await Promise.all([getLastNight(), getNextNight()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteJsonLd(locale)) }} />
      <Hero lastNight={lastNight} locale={locale} />
      <LastNightProof lastNight={lastNight} locale={locale} />
      <HowItWorks />
      <VerdictsAndComingUp nextNight={nextNight} locale={locale} />
      <AppFeatures />
      <FaqAndCta />
    </>
  );
}
