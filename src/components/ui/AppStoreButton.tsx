import { getTranslations } from 'next-intl/server';
import { APP_STORE_URL } from '@/constants/theme';

interface AppStoreButtonProps {
  /** Pour mesurer quel bloc de la page amène à l'App Store */
  campaign: string;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Bouton vers la fiche App Store de Reggie.
 * Le paramètre ct (campagne) dit quel bloc a mené à l'App Store. TODO : ajouter pt (jeton
 * fournisseur, dans App Store Connect > Analytics > Campagnes) pour que les campagnes soient comptées.
 * TODO : remplacer par le badge officiel « Télécharger dans l'App Store » (SVG fourni par
 * Apple sur https://developer.apple.com/app-store/marketing/guidelines/), en français et en anglais.
 */
export async function AppStoreButton({ campaign, size = 'md', className = '' }: AppStoreButtonProps) {
  const t = await getTranslations('appStore');
  const href = `${APP_STORE_URL}?ct=${encodeURIComponent(campaign)}`;
  const big = size === 'lg';

  return (
    <a
      href={href}
      aria-label={t('a11y')}
      className={`inline-flex items-center gap-2.5 rounded-xl bg-black text-white border border-white/25 hover:bg-neutral-900 transition-colors ${big ? 'px-5 py-3' : 'px-4 py-2.5'} ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className={big ? 'w-7 h-7' : 'w-6 h-6'} fill="currentColor">
        <path d="M16.37 12.62c-.02-2.3 1.88-3.41 1.97-3.46-1.07-1.57-2.74-1.78-3.33-1.8-1.42-.14-2.77.83-3.49.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.6-.75 3-.75 1.4 0 1.79.75 3.01.73 1.25-.02 2.04-1.13 2.8-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.47-3.71zM14.07 5.86c.64-.78 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.77-.97 2.82 1.02.08 2.07-.52 2.71-1.28z" />
      </svg>
      <span className="flex flex-col leading-tight text-left">
        <span className={big ? 'text-xs' : 'text-[11px]'}>{t('line1')}</span>
        <span className={`font-semibold ${big ? 'text-xl' : 'text-lg'} -mt-0.5`}>{t('line2')}</span>
      </span>
    </a>
  );
}
