'use client';

import { useState } from 'react';

interface Criterion {
  label: string;
  value: number;
  max: number;
}

interface DreamContent {
  rating: string;
  ratingColor: string;
  headline?: string;
  summary?: string;
  bestFor?: string;
  criteria: Criterion[];
}

interface DreamRevealProps {
  slug: string;
  locale: 'fr' | 'en';
  labels: {
    ctaTitle: string;
    ctaText: string;
    button: string;
    back: string;
    rating: string;
    bestFor: string;
    criteria: string;
    error: string;
  };
}

function points(value: number, locale: 'fr' | 'en'): string {
  const text = (value / 10).toFixed(1);
  return locale === 'fr' ? text.replace('.', ',') : text;
}

/**
 * Mode « Fais-moi rêver » : la note sur 10 et l'analyse, chargées seulement à la demande
 * (la page ne les contient pas). Le score n'existe jamais ici.
 */
export function DreamReveal({ slug, locale, labels }: DreamRevealProps) {
  const [content, setContent] = useState<DreamContent | null>(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  const reveal = async () => {
    if (content) {
      setOpen(true);
      return;
    }
    setState('loading');
    try {
      const response = await fetch(`/api/fais-moi-rever/${encodeURIComponent(slug)}?locale=${locale}`);
      if (!response.ok) throw new Error(String(response.status));
      setContent(await response.json());
      setOpen(true);
      setState('idle');
    } catch {
      setState('error');
    }
  };

  if (!open || !content) {
    return (
      <div className="rounded-2xl bg-card border border-primary/45 p-5 flex flex-col items-start gap-3">
        <p className="text-lg font-bold">{labels.ctaTitle}</p>
        <p className="text-foreground-secondary">{labels.ctaText}</p>
        <button
          type="button"
          onClick={reveal}
          disabled={state === 'loading'}
          aria-busy={state === 'loading'}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary font-semibold px-5 py-2.5 hover:opacity-90"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round">
            <path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
            <path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
          </svg>
          {labels.button}
        </button>
        {state === 'error' && <p role="alert" className="text-sm text-error">{labels.error}</p>}
      </div>
    );
  }

  const { rating, ratingColor, headline, summary, bestFor, criteria } = content;

  return (
    <div className="flex flex-col gap-5" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="font-title text-4xl leading-none rounded-xl px-3.5 py-2" style={{ backgroundColor: ratingColor, color: '#0A0F1C' }}>
          {rating}
        </span>
        <span className="text-foreground-secondary">{labels.rating} / 10</span>
      </div>
      {headline && <h2 className="text-2xl font-bold text-primary leading-snug">{headline}</h2>}
      {summary && <p className="text-lg leading-relaxed">{summary}</p>}
      {bestFor && (
        <p className="text-foreground-secondary">
          {labels.bestFor} : {bestFor}
        </p>
      )}
      {criteria.length > 0 && (
        <div className="rounded-2xl bg-card border border-card-border p-5">
          <h3 className="font-bold mb-3">{labels.criteria}</h3>
          <ul className="flex flex-col gap-3">
            {criteria.map((c) => (
              <li key={c.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground-secondary">{c.label}</span>
                  <span className="font-semibold">
                    {points(c.value, locale)} / {points(c.max, locale)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-card-border overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (c.value / c.max) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="self-start rounded-full border border-card-border px-4 py-2 text-sm font-semibold hover:border-primary/50"
      >
        {labels.back}
      </button>
    </div>
  );
}
