import { getLocale, getTranslations } from 'next-intl/server';
import { appStoreHref } from '@/constants/theme';

interface AppStoreButtonProps {
  /** Pour mesurer quel bloc de la page amène à l'App Store */
  campaign: string;
  size?: 'md' | 'lg';
  /**
   * badge : le badge officiel d'Apple. Apple demande un seul badge par mise en page :
   * sur une page qui en a déjà un, les autres appels utilisent « text », un bouton à nos couleurs.
   */
  variant?: 'badge' | 'text';
  className?: string;
}

/**
 * Lien vers la fiche App Store de Reggie.
 * Badges officiels d'Apple (outils marketing App Store), non modifiés : noir en thème clair
 * (badge préféré), blanc en thème sombre (badge alternatif, prévu quand le noir est trop lourd).
 * Hauteur minimale 40 px à l'écran, marge libre autour d'au moins un quart de la hauteur.
 */
export async function AppStoreButton({ campaign, size = 'md', variant = 'badge', className = '' }: AppStoreButtonProps) {
  const t = await getTranslations('appStore');
  const locale = (await getLocale()) === 'fr' ? 'fr' : 'en';
  const href = appStoreHref(campaign);

  if (variant === 'text') {
    return (
      <a
        href={href}
        className={`inline-flex items-center rounded-full bg-primary text-on-primary font-bold px-5 py-3 hover:opacity-90 transition-opacity ${className}`}
      >
        {t('install')}
      </a>
    );
  }

  const height = size === 'lg' ? 'h-14' : 'h-12';
  return (
    <a href={href} aria-label={t('a11y')} className={`inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG officiel servi tel quel */}
      <img src={`/badges/app-store-${locale}-black.svg`} alt="" className={`${height} w-auto badge-light`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/badges/app-store-${locale}-white.svg`} alt="" className={`${height} w-auto badge-dark`} />
    </a>
  );
}
