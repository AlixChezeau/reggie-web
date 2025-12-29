// Rating colors (same in both modes)
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

export const getRatingLabel = (rating: number, lang: 'fr' | 'en'): string => {
  if (rating >= 8) return lang === 'fr' ? 'Épique' : 'Epic';
  if (rating >= 7) return 'Must Watch';
  if (rating >= 5) return 'Worth It';
  return lang === 'fr' ? 'À éviter' : 'Skip';
};

export const getVerdictColor = (recommendation: 'epic' | 'must_watch' | 'worth_it' | 'skip' | string): string => {
  switch (recommendation) {
    case 'epic': return ratingColors.epic;
    case 'must_watch': return ratingColors.mustWatch;
    case 'worth_it': return ratingColors.worthIt;
    case 'skip': return ratingColors.skip;
    default: return ratingColors.worthIt;
  }
};

// Tailwind CSS color classes for dark mode
export const darkTheme = {
  background: 'bg-[#0A0F1C]',
  backgroundGradient: 'bg-gradient-to-b from-[#0A0F1C] to-[#1C2430]',
  card: 'bg-white/5',
  cardBorder: 'border-white/10',
  text: 'text-[#F2F2F2]',
  textSecondary: 'text-[#9CA3AF]',
  textMuted: 'text-[#4A4A4A]',
  primary: 'text-[#FFB400]',
  primaryBg: 'bg-[#FFB400]',
};

// Tailwind CSS color classes for light mode
export const lightTheme = {
  background: 'bg-[#FDF6E3]',
  backgroundGradient: 'bg-gradient-to-b from-[#FDF6E3] to-[#FAF0D7]',
  card: 'bg-white',
  cardBorder: 'border-[#8B5A2B]/15',
  text: 'text-[#2D2D2D]',
  textSecondary: 'text-[#5C5C5C]',
  textMuted: 'text-[#8B8B8B]',
  primary: 'text-[#E67E22]',
  primaryBg: 'bg-[#E67E22]',
};

// CSS custom properties values
export const darkColors = {
  background: '#0A0F1C',
  backgroundGradient: '#1C2430',
  card: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#F2F2F2',
  textSecondary: '#9CA3AF',
  textMuted: '#4A4A4A',
  primary: '#FFB400',
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#3B82F6',
};

export const lightColors = {
  background: '#FDF6E3',
  backgroundGradient: '#FAF0D7',
  card: '#FFFFFF',
  cardBorder: 'rgba(139, 90, 43, 0.15)',
  text: '#2D2D2D',
  textSecondary: '#5C5C5C',
  textMuted: '#8B8B8B',
  primary: '#E67E22',
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#3B82F6',
};
