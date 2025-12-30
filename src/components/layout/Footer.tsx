'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from './ThemeProvider';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  // Try to get theme, with fallback for SSR
  let theme = 'dark';
  let toggleTheme = () => {};
  let isDark = true;

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
    isDark = themeContext.isDark;
  } catch {
    // Context not available during SSR, use defaults
  }

  return (
    <footer className="bg-card border-t border-card-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Theme Toggle */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('theme')}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-primary text-background'
                    : 'bg-card-border text-foreground-secondary hover:text-foreground'
                }`}
              >
                {t('dark')}
              </button>
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isDark
                    ? 'bg-primary text-background'
                    : 'bg-card-border text-foreground-secondary hover:text-foreground'
                }`}
              >
                {t('light')}
              </button>
            </div>
          </div>

          {/* Language Switcher */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t('language')}</h3>
            <LocaleSwitcher />
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Links</h3>
            <div className="flex flex-col gap-2">
              <Link
                href={`/${locale}/${locale === 'fr' ? 'methodologie' : 'methodology'}`}
                className="text-foreground-secondary hover:text-primary transition-colors text-sm"
              >
                {t('methodology')}
              </Link>
              <Link
                href={`/${locale}/${locale === 'fr' ? 'confidentialite' : 'privacy'}`}
                className="text-foreground-secondary hover:text-primary transition-colors text-sm"
              >
                {t('privacy')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-card-border text-center">
          <p className="text-foreground-muted text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
