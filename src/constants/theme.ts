/**
 * Couleurs de l'app (Reggie, constants/theme.ts). Les couleurs de verdict sont les mêmes
 * dans les deux thèmes ; le reste du thème vit dans src/app/globals.css.
 */
export const ratingColors = {
  epic: '#8B5CF6',         // Violet (8+)
  mustWatch: '#22C55E',    // Vert (7-7.9)
  worthIt: '#EAB308',      // Jaune (5-6.9)
  skip: '#EF4444',         // Rouge (0-4.9)
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return ratingColors.epic;
  if (rating >= 7) return ratingColors.mustWatch;
  if (rating >= 5) return ratingColors.worthIt;
  return ratingColors.skip;
};

/** Or de la marque (thème sombre) et orange basket (thème clair), comme dans l'app */
export const brandColors = {
  gold: '#FFB400',
  logo: '#FCA300',
  orange: '#E67E22',
  night: '#0A0F1C',
};

/** Fiche App Store de Reggie */
export const APP_STORE_URL = 'https://apps.apple.com/app/id6756739200';
