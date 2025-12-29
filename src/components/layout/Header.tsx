'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-title)' }}>
              REGGIE
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('latest-news')}
              className="text-foreground-secondary hover:text-foreground transition-colors text-sm font-medium"
            >
              {t('news')}
            </button>
            <button
              onClick={() => scrollTo('today-matches')}
              className="text-foreground-secondary hover:text-foreground transition-colors text-sm font-medium"
            >
              {t('today')}
            </button>
            <button
              onClick={() => scrollTo('standings')}
              className="text-foreground-secondary hover:text-foreground transition-colors text-sm font-medium"
            >
              {t('standings')}
            </button>
            <Link
              href={`/${locale}/${locale === 'fr' ? 'equipes' : 'teams'}`}
              className="text-foreground-secondary hover:text-foreground transition-colors text-sm font-medium"
            >
              {t('teams')}
            </Link>
            <Link
              href={`/${locale}/${locale === 'fr' ? 'methodologie' : 'methodology'}`}
              className="text-foreground-secondary hover:text-foreground transition-colors text-sm font-medium"
            >
              {t('methodology')}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-foreground-secondary hover:text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
