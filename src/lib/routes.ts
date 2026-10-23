/** Adresses du site dans chaque langue (les segments français et anglais diffèrent parfois). */
type Locale = 'fr' | 'en';

export const routes = {
  home: (l: Locale) => `/${l}`,
  lastNight: (l: Locale) => `/${l}/${l === 'fr' ? 'nuit' : 'night'}`,
  night: (l: Locale, etDate: string) => `/${l}/${l === 'fr' ? 'nuit' : 'night'}/${etDate}`,
  match: (l: Locale, slug: string) => `/${l}/match/${slug}`,
  tierList: (l: Locale) => `/${l}/tier-list`,
  methodology: (l: Locale) => `/${l}/${l === 'fr' ? 'methodologie' : 'methodology'}`,
  teams: (l: Locale) => `/${l}/${l === 'fr' ? 'equipes' : 'teams'}`,
  team: (l: Locale, slug: string) => `/${l}/${l === 'fr' ? 'equipe' : 'team'}/${slug}`,
  privacy: (l: Locale) => `/${l}/${l === 'fr' ? 'confidentialite' : 'privacy'}`,
};

/** Segments à traduire quand on change de langue : [français, anglais] */
export const translatedSegments: [string, string][] = [
  ['nuit', 'night'],
  ['equipe', 'team'],
  ['equipes', 'teams'],
  ['methodologie', 'methodology'],
  ['confidentialite', 'privacy'],
];
