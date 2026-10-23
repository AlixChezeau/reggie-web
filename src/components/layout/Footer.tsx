'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme, ThemeChoice } from './ThemeProvider';
import { LocaleSwitcher } from './LocaleSwitcher';
import { routes } from '@/lib/routes';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale() as 'fr' | 'en';
  const { choice, setChoice } = useTheme();

  const themes: { value: ThemeChoice; label: string }[] = [
    { value: 'system', label: t('system') },
    { value: 'dark', label: t('dark') },
    { value: 'light', label: t('light') },
  ];

  return (
    <footer className="bg-surface border-t border-card-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4">{t('links')}</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href={routes.methodology(locale)} className="text-foreground-secondary hover:text-primary">{t('methodology')}</Link></li>
              <li><Link href={routes.tierList(locale)} className="text-foreground-secondary hover:text-primary">{t('tierList')}</Link></li>
              <li><Link href={routes.teams(locale)} className="text-foreground-secondary hover:text-primary">{t('teams')}</Link></li>
              <li><Link href={routes.privacy(locale)} className="text-foreground-secondary hover:text-primary">{t('privacy')}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4">{t('theme')}</h2>
            <div className="flex items-center gap-2" role="group" aria-label={t('theme')}>
              {themes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setChoice(item.value)}
                  aria-pressed={choice === item.value}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    choice === item.value
                      ? 'bg-primary text-on-primary'
                      : 'bg-card border border-card-border text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4">{t('language')}</h2>
            <LocaleSwitcher />
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-card-border flex flex-col sm:flex-row gap-2 sm:justify-between text-sm text-foreground-muted">
          <p>{t('disclaimer')}</p>
          <p>Watch smart. No spoilers. · {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
