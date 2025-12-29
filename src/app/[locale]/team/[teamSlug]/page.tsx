// Re-export from the French version (same component, different URL for i18n)
export { default, generateMetadata, generateStaticParams } from '../../equipe/[teamSlug]/page';

export const revalidate = 3600; // Must be defined directly, not re-exported
