/**
 * Où regarder les matchs, saison 2026-27. Offres vérifiées le 23 octobre 2026 : en français, l'offre
 * en France ; en anglais, l'offre aux États-Unis. Pas de prix ici : ils changent souvent, on renvoie
 * vers les sites officiels. À revérifier à chaque début de saison et avant les playoffs.
 */
export const WHERE_TO_WATCH_CHECKED_AT = '2026-10-23';

export interface Offer {
  name: string;
  what: string;
  replay: string;
  url: string;
}

export interface WhereToWatchContent {
  title: string;
  intro: string;
  checked: string;
  offersTitle: string;
  offers: Offer[];
  replayLabel: string;
  linkLabel: string;
  tipsTitle: string;
  tips: string[];
  note: string;
}

export const whereToWatch: Record<'fr' | 'en', WhereToWatchContent> = {
  fr: {
    title: 'Où regarder les matchs en France',
    intro:
      "Trois offres se partagent la saison 2026-27 en France. Reggie te dit quel match revoir et dans quel format ; voici où le trouver.",
    checked: 'Offres vérifiées le 23 octobre 2026.',
    offersTitle: 'Les offres de la saison 2026-27',
    offers: [
      {
        name: 'League Pass',
        what: "Tous les matchs de la saison, en direct et en différé. C'est l'offre la plus complète pour revoir un match le matin.",
        replay: 'Matchs complets, condensés et résumés.',
        url: 'https://www.nba.com/watch/league-pass-stream',
      },
      {
        name: 'beIN Sports',
        what: "Jusqu'à neuf matchs de saison régulière par semaine, le All-Star Game, une partie des playoffs et les Finales 2027.",
        replay: 'Rediffusions et résumés selon les matchs.',
        url: 'https://www.beinsports.com/france/',
      },
      {
        name: 'Prime Video',
        what: "Une sélection de matchs de saison régulière, la phase finale de la Cup, le Play-In, une partie des playoffs et les matchs joués à Paris et à Manchester en 2027.",
        replay: 'Matchs à la demande après le direct.',
        url: 'https://www.primevideo.com',
      },
    ],
    replayLabel: 'Pour revoir :',
    linkLabel: 'Voir l’offre',
    tipsTitle: 'Revoir un match sans se faire spoiler',
    tips: [
      'Coupe les notifications des applis de sport et de tes réseaux avant d’aller dormir.',
      'Lance le match depuis la recherche plutôt que depuis l’accueil : les miniatures et les titres trahissent souvent le résultat.',
      'Cache la barre de progression : sa longueur annonce une prolongation.',
      'Ouvre Reggie en mode Zéro spoil : le verdict et le format conseillé, rien d’autre.',
    ],
    note: "Reggie est indépendant : il n'est affilié à aucune ligue, équipe ni diffuseur. Les offres et les prix peuvent changer : vérifie sur leur site avant de t'abonner.",
  },
  en: {
    title: 'Where to watch the games in the US',
    intro:
      'The 2026-27 season is split between three national TV partners, with League Pass covering the rest. Reggie tells you which game to watch and in what format; here is where to find it.',
    checked: 'Offers checked on October 23, 2026.',
    offersTitle: 'Where the 2026-27 games are',
    offers: [
      {
        name: 'NBC and Peacock',
        what: 'Monday nights on Peacock, Tuesday nights on NBC and Peacock, Sunday nights on NBC from late January.',
        replay: 'Full games on demand on Peacock.',
        url: 'https://www.peacocktv.com',
      },
      {
        name: 'ESPN and ABC',
        what: 'Wednesday and Friday nights on ESPN, Saturday primetime and Sunday afternoons on ABC, and the Finals on ABC.',
        replay: 'Games in the ESPN app.',
        url: 'https://www.espn.com/watch/',
      },
      {
        name: 'Prime Video',
        what: 'Thursday and Friday nights, plus Saturday afternoons from February.',
        replay: 'Full games on demand after the live broadcast.',
        url: 'https://www.primevideo.com',
      },
      {
        name: 'League Pass',
        what: 'Every game that is not on national TV or in your local market. Local games are on your regional network.',
        replay: 'Full games, condensed games and highlights.',
        url: 'https://www.nba.com/watch/league-pass-stream',
      },
    ],
    replayLabel: 'To watch later:',
    linkLabel: 'See the offer',
    tipsTitle: 'Watch a game without spoilers',
    tips: [
      'Mute sports and social notifications before bed.',
      'Start the game from search, not from the home screen: thumbnails and titles often give away the result.',
      'Hide the progress bar: its length gives away overtime.',
      'Open Reggie in Zero Spoil mode: the verdict and the best format, nothing else.',
    ],
    note: 'Reggie is independent and not affiliated with any league, team or broadcaster. Offers and prices change: check their site before subscribing.',
  },
};
