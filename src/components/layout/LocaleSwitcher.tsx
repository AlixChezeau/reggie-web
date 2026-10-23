'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { translatedSegments } from '@/lib/routes';

function pathFor(pathname: string, target: 'fr' | 'en'): string {
  const segments = pathname.split('/');
  segments[1] = target;
  const pair = translatedSegments.find(([fr, en]) => segments[2] === fr || segments[2] === en);
  if (pair) segments[2] = target === 'fr' ? pair[0] : pair[1];
  return segments.join('/') || `/${target}`;
}

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname() || `/${locale}`;

  const item = (target: 'fr' | 'en', label: string) => (
    <Link
      href={pathFor(pathname, target)}
      hrefLang={target}
      aria-current={locale === target ? 'true' : undefined}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
        locale === target ? 'bg-primary text-on-primary' : 'bg-card border border-card-border text-foreground-secondary hover:text-foreground'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex items-center gap-2">
      {item('fr', 'Français')}
      {item('en', 'English')}
    </div>
  );
}
