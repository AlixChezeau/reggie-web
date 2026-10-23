/**
 * Verdicts, libellés et format conseillé : les mêmes règles que l'app
 * (Reggie, lib/zeroSpoil.ts et lib/watchFormat.ts, lexique commun du 22/10/2026).
 */
import type { Match, MatchAnalysis } from '@/types';
import { ratingColors } from '@/constants/theme';

export type Locale = 'fr' | 'en';
export type DisplayVerdict = 'epic' | 'must_watch' | 'worth_it' | 'skip';
export type WatchFormat = 'full' | 'condensed' | 'highlights';

/** Note sur 10 avec une décimale, comme dans l'app. */
export function ratingOf(analysis: MatchAnalysis): number {
  const raw = analysis.match_interest_score ? analysis.match_interest_score / 10 : analysis.rating;
  return Math.round((raw || 0) * 10) / 10;
}

export function formatRating(rating: number, locale: Locale): string {
  const text = rating.toFixed(1);
  return locale === 'fr' ? text.replace('.', ',') : text;
}

export function verdictFor(analysis: MatchAnalysis): DisplayVerdict {
  const rating = ratingOf(analysis);
  if (rating >= 8) return 'epic';
  if (rating >= 7) return 'must_watch';
  if (rating >= 5) return 'worth_it';
  return 'skip';
}

const LABELS: Record<DisplayVerdict, [string, string]> = {
  epic: ['Épique', 'Epic'],
  must_watch: ['Immanquable', 'Must-watch'],
  worth_it: ['À voir', 'Worth it'],
  skip: ['À zapper', 'Skip it'],
};

export function verdictLabel(verdict: DisplayVerdict, locale: Locale): string {
  return LABELS[verdict][locale === 'fr' ? 0 : 1];
}

/** Libellé accordé au nombre qui le précède (« 2 Immanquables », « 3 À voir »). */
export function verdictLabelForCount(verdict: DisplayVerdict, count: number, locale: Locale): string {
  const label = verdictLabel(verdict, locale);
  const plural = locale === 'fr' && count > 1 && (verdict === 'epic' || verdict === 'must_watch');
  return plural ? `${label}s` : label;
}

export function verdictColor(verdict: DisplayVerdict): string {
  if (verdict === 'epic') return ratingColors.epic;
  if (verdict === 'must_watch') return ratingColors.mustWatch;
  if (verdict === 'worth_it') return ratingColors.worthIt;
  return ratingColors.skip;
}

/** Format conseillé pour revoir le match : il n'en dit pas plus que le verdict. */
export function watchFormatFor(verdict: DisplayVerdict): WatchFormat {
  if (verdict === 'epic' || verdict === 'must_watch') return 'full';
  if (verdict === 'worth_it') return 'condensed';
  return 'highlights';
}

const SENTENCES: Record<DisplayVerdict, [string, string]> = {
  epic: ['À ne surtout pas rater.', 'Not to be missed.'],
  must_watch: ['À ne pas rater.', 'A must-watch.'],
  worth_it: ['Un match à voir.', 'Worth watching.'],
  skip: ['Tu peux passer ton tour.', 'You can skip this one.'],
};

/** Les textes en base vouvoient encore : on les passe au tutoiement de la marque. */
function toTutoiement(text: string): string {
  return text
    .replace(/Vous pouvez passer votre tour/g, 'Tu peux passer ton tour')
    .replace(/vous pouvez passer votre tour/g, 'tu peux passer ton tour')
    .replace(/Vous pouvez/g, 'Tu peux')
    .replace(/vous pouvez/g, 'tu peux');
}

/** La phrase courte du mode Zéro spoil : rien sur le score ni sur le vainqueur. */
export function zeroSpoilText(analysis: MatchAnalysis, locale: Locale): string {
  const text = locale === 'fr' ? analysis.zero_spoil_fr : analysis.zero_spoil_en;
  if (text) return locale === 'fr' ? toTutoiement(text) : text;
  return SENTENCES[verdictFor(analysis)][locale === 'fr' ? 0 : 1];
}

export function localized(analysis: MatchAnalysis, field: 'headline' | 'summary', locale: Locale): string | undefined {
  const value = locale === 'fr' ? analysis[`${field}_fr`] : analysis[`${field}_en`];
  return value || analysis[field] || undefined;
}

/** Verdict affiché d'un match : après-match s'il existe, sinon avant-match. */
export function matchVerdict(match: Match): DisplayVerdict | null {
  return match.analysis ? verdictFor(match.analysis) : null;
}

export function isFinished(match: Match): boolean {
  return match.status === 'finished' && !!match.post_analysis;
}
