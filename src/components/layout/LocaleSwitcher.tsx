'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the path
    const segments = pathname.split('/');
    segments[1] = newLocale;

    // Handle path translations (equipe <-> team, methodologie <-> methodology, confidentialite <-> privacy)
    if (segments[2] === 'equipe' && newLocale === 'en') {
      segments[2] = 'team';
    } else if (segments[2] === 'team' && newLocale === 'fr') {
      segments[2] = 'equipe';
    } else if (segments[2] === 'methodologie' && newLocale === 'en') {
      segments[2] = 'methodology';
    } else if (segments[2] === 'methodology' && newLocale === 'fr') {
      segments[2] = 'methodologie';
    } else if (segments[2] === 'confidentialite' && newLocale === 'en') {
      segments[2] = 'privacy';
    } else if (segments[2] === 'privacy' && newLocale === 'fr') {
      segments[2] = 'confidentialite';
    }

    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLocale('fr')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          locale === 'fr'
            ? 'bg-primary text-background'
            : 'bg-card-border text-foreground-secondary hover:text-foreground'
        }`}
      >
        Français
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-primary text-background'
            : 'bg-card-border text-foreground-secondary hover:text-foreground'
        }`}
      >
        English
      </button>
    </div>
  );
}
