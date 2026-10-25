import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Le dossier parent contient d'autres projets : on fixe la racine pour Turbopack
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aavurcfpfzbiinqassem.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Anciennes adresses de « Où regarder » (octobre 2026 : plus aucune mention de la ligue).
  // Les redirections de next.config passent avant le middleware de langue : redirection directe, permanente (308).
  async redirects() {
    return [
      { source: '/fr/ou-regarder-la-nba', destination: '/fr/ou-regarder-les-matchs', permanent: true },
      { source: '/fr/where-to-watch-nba', destination: '/fr/ou-regarder-les-matchs', permanent: true },
      { source: '/en/where-to-watch-nba', destination: '/en/where-to-watch', permanent: true },
      { source: '/en/ou-regarder-la-nba', destination: '/en/where-to-watch', permanent: true },
      // Sans préfixe de langue : vers la version française, comme le reste du site par défaut
      { source: '/ou-regarder-la-nba', destination: '/fr/ou-regarder-les-matchs', permanent: true },
      { source: '/where-to-watch-nba', destination: '/en/where-to-watch', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
