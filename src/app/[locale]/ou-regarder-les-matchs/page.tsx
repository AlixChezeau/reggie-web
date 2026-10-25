import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AppStoreButton } from '@/components/ui/AppStoreButton';
import { whereToWatch } from '@/content/whereToWatch';
import { routes } from '@/lib/routes';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = whereToWatch[locale === 'fr' ? 'fr' : 'en'];
  return {
    title: c.title,
    description: c.intro,
    alternates: {
      canonical: routes.whereToWatch(locale as 'fr' | 'en'),
      languages: { fr: routes.whereToWatch('fr'), en: routes.whereToWatch('en') },
    },
  };
}

/** Où regarder les matchs : en français l'offre en France, en anglais l'offre aux États-Unis. Jamais de résultat. */
export default async function WhereToWatchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = whereToWatch[locale === 'fr' ? 'fr' : 'en'];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="font-title text-5xl md:text-6xl leading-[0.95]">{c.title}</h1>
        <p className="text-lg leading-relaxed text-foreground-secondary">{c.intro}</p>
        <p className="text-sm text-foreground-secondary">{c.checked}</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground-secondary">{c.offersTitle}</h2>
        {c.offers.map((offer) => (
          <article key={offer.name} className="rounded-2xl bg-card border border-card-border p-5 flex flex-col gap-2">
            <h3 className="text-xl font-bold">{offer.name}</h3>
            <p className="leading-relaxed">{offer.what}</p>
            <p className="text-sm text-foreground-secondary">
              <span className="font-semibold text-foreground">{c.replayLabel} </span>
              {offer.replay}
            </p>
            <a href={offer.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline self-start">
              {c.linkLabel} →
            </a>
          </article>
        ))}
      </section>

      <section className="rounded-3xl bg-surface border border-card-border p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">{c.tipsTitle}</h2>
        <ul className="flex flex-col gap-3">
          {c.tips.map((tip) => (
            <li key={tip} className="flex gap-3 leading-relaxed">
              <span aria-hidden="true" className="text-primary font-bold">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <AppStoreButton campaign="ou-regarder" className="mt-2" />
      </section>

      <p className="text-sm text-foreground-secondary">{c.note}</p>
    </div>
  );
}
