'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { routes } from '@/lib/routes';
import { appStoreHref } from '@/constants/theme';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as 'fr' | 'en';
  const [open, setOpen] = useState(false);

  const links = [
    { href: routes.lastNight(locale), label: t('night') },
    { href: `${routes.home(locale)}#comment-ca-marche`, label: t('how') },
    { href: routes.tierList(locale), label: t('tierList') },
    { href: routes.methodology(locale), label: t('methodology') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-card-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-16">
          <Link href={routes.home(locale)} aria-label={t('home')} className="flex items-center shrink-0">
            <Image src="/brand/reggie-logo.svg" alt="Reggie" width={124} height={66} priority className="h-10 w-auto" />
          </Link>

          <nav aria-label={locale === 'fr' ? 'Principal' : 'Main'} className="hidden md:flex items-center gap-7 ml-auto">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href={appStoreHref('en-tete')}
            className="ml-auto md:ml-4 inline-flex items-center rounded-full bg-primary text-on-primary text-sm font-bold px-4 py-2.5 hover:opacity-90 transition-opacity"
          >
            <span className="hidden sm:inline">{t('install')}</span>
            <span className="sm:hidden">{t('installShort')}</span>
          </a>

          <button
            type="button"
            className="md:hidden -mr-1 w-11 h-11 inline-flex items-center justify-center rounded-full border border-card-border text-foreground"
            aria-label={open ? t('closeMenu') : t('menu')}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {open && (
          <nav id="menu-mobile" aria-label={locale === 'fr' ? 'Principal' : 'Main'} className="md:hidden pb-4 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 border-t border-card-border text-base font-medium text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
