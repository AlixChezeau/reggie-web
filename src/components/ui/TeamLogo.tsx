import { Team } from '@/types';

/**
 * Sigle de l'équipe en volets façon tableau des départs, comme dans l'app (components/TeamFlap.tsx) :
 * une lettre par volet, le volet à la couleur 1 de l'équipe et la lettre à sa couleur 2.
 * Pas de logo officiel : les logos des équipes sont des marques déposées (refus App Store d'octobre 2026).
 * Couleurs ajustées pour rester lisibles (au moins 3,5:1) sans contour sur le texte : volet un peu
 * assombri ou lettre un peu éclaircie quand les deux couleurs de l'équipe sont trop proches.
 * Table identique à celle de l'app (clé = abréviation).
 */
const FLAP_COLORS: Record<string, [flap: string, letter: string]> = {
  ATL: ['#C31F23', '#C1D32F'],
  BKN: ['#000000', '#FFFFFF'],
  BOS: ['#005122', '#BB9857'],
  CHA: ['#1D1160', '#00849B'],
  CHI: ['#CE1141', '#000000'],
  CLE: ['#860038', '#FDBB30'],
  DAL: ['#00538C', '#72B0FF'],
  DEN: ['#0E2240', '#FEC524'],
  DET: ['#C8102E', '#B9C9F7'],
  GSW: ['#1D428A', '#FFC72C'],
  HOU: ['#CE1141', '#000000'],
  IND: ['#002D62', '#FDBB30'],
  LAC: ['#C8102E', '#B4C9F2'],
  LAL: ['#552583', '#FDB927'],
  MEM: ['#5D76A9', '#12173F'],
  MIA: ['#98002E', '#F9A01B'],
  MIL: ['#00471B', '#EEE1C6'],
  MIN: ['#0C2340', '#2C7CB6'],
  NOP: ['#0C2340', '#EB1035'],
  NYK: ['#004D83', '#F5872B'],
  OKC: ['#004C78', '#FF8468'],
  ORL: ['#0077C0', '#D9DEE2'],
  PHI: ['#004A80', '#FF7E98'],
  PHX: ['#1D1160', '#E56020'],
  POR: ['#E03A3E', '#000000'],
  SAC: ['#5A2D81', '#929DA5'],
  SAS: ['#C4CED4', '#000000'],
  TOR: ['#CE1141', '#000000'],
  UTA: ['#002B5C', '#00973B'],
  WAS: ['#002148', '#E71939'],
};

const FALLBACK: [string, string] = ['#1C2333', '#F5F1E6'];

/** Éclaircit une couleur hexadécimale (luminosité HSL + amount, entre 0 et 1). */
function lighten(hex: string, amount: number): string {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  l = Math.min(1, l + amount);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t: number) => {
    const u = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (u < 1 / 6) return p + (q - p) * 6 * u;
    if (u < 1 / 2) return q;
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
    return p;
  };
  const out = s === 0 ? [l, l, l] : [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
  return '#' + out.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
}

interface TeamLogoProps {
  team: Pick<Team, 'abbreviation'>;
  /** Taille de l'ancienne pastille : le volet fait 0,85 × cette hauteur, comme dans l'app */
  size?: number;
  className?: string;
}

/**
 * Le nom de l'équipe (surnom ou nom complet) est toujours écrit à côté : les volets sont
 * décoratifs et masqués pour les lecteurs d'écran.
 */
export function TeamLogo({ team, size = 48, className = '' }: TeamLogoProps) {
  const abbreviation = team.abbreviation.toUpperCase();
  const [flap, letterColor] = FLAP_COLORS[abbreviation] ?? FALLBACK;

  const height = Math.round(size * 0.85);
  const width = Math.round(height * 0.68);
  const half = height / 2;
  const radius = Math.max(2, Math.round(height * 0.12));
  const split = Math.max(1, Math.round(height / 40));
  const pinHeight = Math.max(2, Math.round(height * 0.14));
  const pinWidth = Math.max(1, Math.round(height * 0.045));
  const pin = lighten(flap, 0.16);
  const top = lighten(flap, 0.06);

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none ${className}`}
      style={{ gap: Math.max(1, Math.round(height * 0.05)) }}
    >
      {[...abbreviation].map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="relative block overflow-hidden"
          style={{ width, height, borderRadius: radius, backgroundColor: flap }}
        >
          {/* Moitié haute un peu plus claire, comme un vrai volet éclairé par le dessus */}
          <span className="absolute inset-x-0 top-0" style={{ height: half, backgroundColor: top }} />
          <span
            className="font-title absolute inset-0 text-center"
            style={{
              fontSize: Math.round(height * 0.8),
              lineHeight: `${height}px`,
              paddingTop: Math.round(height * 0.03),
              color: letterColor,
            }}
          >
            {ch}
          </span>
          {/* Fente au milieu, ombre du volet du haut, axes sur les côtés */}
          <span className="absolute inset-x-0" style={{ top: half - split / 2, height: split, backgroundColor: 'rgba(0,0,0,0.6)' }} />
          <span
            className="absolute inset-x-0"
            style={{ top: half + split / 2, height: Math.max(1, Math.round(height / 14)), backgroundColor: 'rgba(0,0,0,0.18)' }}
          />
          <span className="absolute left-0" style={{ top: half - pinHeight / 2, width: pinWidth, height: pinHeight, backgroundColor: pin }} />
          <span className="absolute right-0" style={{ top: half - pinHeight / 2, width: pinWidth, height: pinHeight, backgroundColor: pin }} />
          {/* Liseré : clair sur fond nuit, foncé sur fond parquet (variable --flap-edge, comme dans l'app) */}
          <span className="absolute inset-0 border" style={{ borderRadius: radius, borderColor: 'var(--flap-edge)' }} />
        </span>
      ))}
    </span>
  );
}
