import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { getMatchBySlug } from '@/lib/supabase/queries';
import { formatRating, localized, ratingOf, verdictFor } from '@/lib/verdict';

export const revalidate = 600;

/**
 * Contenu du mode « Fais-moi rêver » d'un match, chargé seulement quand le visiteur le
 * demande : la page elle-même ne contient ainsi aucun bilan d'après-match.
 * Jamais de score ici non plus (les requêtes ne le lisent pas).
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = new URL(request.url).searchParams.get('locale') === 'en' ? 'en' : 'fr';
  const match = await getMatchBySlug(slug);
  const analysis = match?.analysis;
  if (!match || !analysis) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const t = await getTranslations({ locale, namespace: 'match' });
  const finished = match.status === 'finished';
  const criteria: { label: string; value: number; max: number }[] = [];
  if (finished && analysis.interest_breakdown) {
    const b = analysis.interest_breakdown;
    criteria.push(
      { label: t('suspense'), value: b.clutch_factor, max: 35 },
      { label: t('stakes'), value: b.stakes, max: 30 },
      { label: t('performances'), value: b.performances, max: 20 },
      { label: t('starPower'), value: b.star_power, max: 15 },
    );
  } else if (!finished && analysis.prematch_breakdown) {
    const b = analysis.prematch_breakdown;
    criteria.push(
      { label: t('stakes'), value: b.stakes, max: 55 },
      { label: t('recentForm'), value: b.recent_form, max: 30 },
      { label: t('starPower'), value: b.star_power, max: 15 },
    );
  }

  const bestFor = analysis.verdict
    ? (locale === 'fr' ? analysis.verdict.best_for_fr : analysis.verdict.best_for_en) || analysis.verdict.best_for
    : undefined;

  return NextResponse.json(
    {
      rating: formatRating(ratingOf(analysis), locale),
      verdict: verdictFor(analysis),
      // Avant le match, le titre et le résumé sont déjà sur la page
      headline: finished ? localized(analysis, 'headline', locale) : undefined,
      summary: finished ? localized(analysis, 'summary', locale) : undefined,
      bestFor,
      criteria,
    },
    // Pas d'indexation par les moteurs de recherche
    { headers: { 'X-Robots-Tag': 'noindex' } }
  );
}
