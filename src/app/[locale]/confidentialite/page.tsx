import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CONTACT_EMAIL, privacy } from '@/content/privacy';
import { routes } from '@/lib/routes';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = privacy[locale === 'fr' ? 'fr' : 'en'];
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: routes.privacy(locale as 'fr' | 'en'),
      languages: { fr: routes.privacy('fr'), en: routes.privacy('en') },
    },
  };
}

/** Confidentialité du site et de l'app : contenu dans src/content/privacy.ts */
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = privacy[locale === 'fr' ? 'fr' : 'en'];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-title text-5xl md:text-6xl leading-[0.95]">{c.title}</h1>
        <p className="text-sm text-foreground-secondary">{c.updated}</p>
        <p className="text-lg leading-relaxed text-foreground-secondary">{c.intro}</p>
      </header>

      {c.sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">{section.title}</h2>
          {section.items && (
            <ul className="flex flex-col gap-2 text-foreground-secondary leading-relaxed">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-primary font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {section.paragraphs?.map((p) => (
            <p key={p} className="text-foreground-secondary leading-relaxed">{p}</p>
          ))}
        </section>
      ))}

      <section className="rounded-2xl bg-card border border-card-border p-5 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{c.contactTitle}</h2>
        {CONTACT_EMAIL ? (
          <p className="text-foreground-secondary">
            {c.contactText}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>
          </p>
        ) : (
          <p className="text-foreground-secondary">{c.contactPending}</p>
        )}
        <p className="text-sm text-foreground-secondary">{c.editorLabel}</p>
      </section>
    </div>
  );
}
