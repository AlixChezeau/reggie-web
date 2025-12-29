import { MetadataRoute } from 'next';
import { NBA_TEAMS } from '@/constants/teams';
import { getAllAnalyzedMatches } from '@/lib/supabase/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reggie.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matches = await getAllAnalyzedMatches();

  const staticPages: MetadataRoute.Sitemap = [
    // Homepages
    {
      url: `${BASE_URL}/fr`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    // Teams list pages
    {
      url: `${BASE_URL}/fr/equipes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/en/teams`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Methodology pages
    {
      url: `${BASE_URL}/fr/methodologie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/en/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Team pages
  const teamPages: MetadataRoute.Sitemap = NBA_TEAMS.flatMap((team) => [
    {
      url: `${BASE_URL}/fr/equipe/${team.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/en/team/${team.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ]);

  // Match pages
  const matchPages: MetadataRoute.Sitemap = matches.flatMap((match) => [
    {
      url: `${BASE_URL}/fr/match/${match.slug}`,
      lastModified: new Date(match.analysis?.created_at || match.scheduled_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/en/match/${match.slug}`,
      lastModified: new Date(match.analysis?.created_at || match.scheduled_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  return [...staticPages, ...teamPages, ...matchPages];
}
