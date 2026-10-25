/**
 * Politique de confidentialité du site et de l'app. À tenir à jour à chaque nouvelle donnée
 * collectée (dernière revue : 23 octobre 2026, app 1.3 et site C+B avec la Tier list).
 * TODO Alix : adresse de contact, à créer avec le nom de domaine (ex. contact@reggiereplay.com),
 * puis la renseigner dans CONTACT_EMAIL.
 */
export const CONTACT_EMAIL: string | null = null;

export interface PrivacySection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface PrivacyContent {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
  contactTitle: string;
  contactText: string;
  contactPending: string;
  editorLabel: string;
}

export const privacy: Record<'fr' | 'en', PrivacyContent> = {
  fr: {
    title: 'Confidentialité',
    description: 'Ce que Reggie collecte sur le site et dans l’app, et ce que nous ne collectons pas.',
    updated: 'Mise à jour le 23 octobre 2026',
    intro:
      'Reggie te dit quels matchs de basket US valent le coup d’être revus, sans spoil. Pas de compte, pas de nom, pas d’e-mail : on collecte le strict nécessaire pour faire marcher le site et l’app, et rien pour te suivre.',
    editorLabel: 'Éditeur : MRC Digital',
    sections: [
      {
        title: 'Sur le site',
        items: [
          'Ton thème (clair, sombre ou auto) et ta langue, gardés dans ton navigateur.',
          'Pour la Tier list : un identifiant au hasard, gardé dans ton navigateur, pour compter un seul vote par joueur et par jour. Il ne dit rien sur toi et n’est relié à aucune autre donnée.',
          'Pas de cookie publicitaire, pas d’outil de mesure d’audience, pas de pixel de réseau social.',
        ],
      },
      {
        title: 'Dans l’app',
        items: [
          'Tes réglages (équipe de cœur, thème, langue, mode spoil), gardés sur ton téléphone.',
          'Si tu actives les notifications : l’identifiant de notification de ton téléphone, ta langue, ton fuseau horaire, ton équipe de cœur et tes préférences de notification, pour t’envoyer le bon message à la bonne heure.',
          'Tes votes (Devine le verdict, d’accord ou pas avec une note), reliés à cet identifiant de notification, jamais à ton nom.',
          'Des statistiques d’usage anonymes (Firebase Analytics) uniquement si tu l’acceptes ; sans identifiant publicitaire.',
        ],
      },
      {
        title: 'Ce que nous ne collectons pas',
        items: [
          'Ni nom, ni e-mail, ni numéro de téléphone, ni adresse.',
          'Ni position, ni contacts, ni photos.',
          'Ni identifiant publicitaire, ni historique de navigation.',
        ],
      },
      {
        title: 'Où vont les données',
        items: [
          'Supabase, notre base de données, hébergée en Irlande (Union européenne) : les données des matchs, tes préférences de notification et les votes.',
          'Firebase, de Google : l’envoi des notifications et, si tu l’acceptes, les statistiques d’usage.',
          'Vercel : l’hébergement du site.',
        ],
        paragraphs: ['Rien n’est vendu ni partagé à des fins publicitaires.'],
      },
      {
        title: 'Combien de temps',
        items: [
          'Les réglages du site et de l’app restent sur ton appareil jusqu’à ce que tu les effaces ou désinstalles l’app.',
          'Les données de notification sont supprimées quand ton téléphone n’est plus joignable.',
          'Les votes de la Tier list sont conservés sous forme anonyme pour calculer le classement.',
        ],
      },
      {
        title: 'Tes droits',
        paragraphs: [
          'Tu peux demander l’accès, la correction ou la suppression de tes données, et t’opposer à leur traitement (RGPD). Le plus simple : couper les notifications ou désinstaller l’app supprime ce qui est lié à ton téléphone. Tu peux aussi saisir la CNIL (cnil.fr).',
          'Reggie s’adresse à tout le monde et ne collecte rien de particulier sur les mineurs.',
        ],
      },
    ],
    contactTitle: 'Contact',
    contactText: 'Une question sur tes données ? Écris-nous :',
    contactPending: 'L’adresse de contact arrive avec le nom de domaine du site.',
  },
  en: {
    title: 'Privacy',
    description: 'What Reggie collects on the website and in the app, and what it does not.',
    updated: 'Updated October 23, 2026',
    intro:
      'Reggie tells you which US basketball games are worth watching, spoiler-free. No account, no name, no email: we only collect what the website and the app need to work, and nothing to track you.',
    editorLabel: 'Publisher: MRC Digital',
    sections: [
      {
        title: 'On the website',
        items: [
          'Your theme (light, dark or auto) and language, kept in your browser.',
          'For the Tier list: a random ID kept in your browser, so we count one vote per player per day. It says nothing about you and is not linked to any other data.',
          'No advertising cookies, no audience measurement, no social media pixels.',
        ],
      },
      {
        title: 'In the app',
        items: [
          'Your settings (favorite team, theme, language, spoiler mode), kept on your phone.',
          'If you turn on notifications: your phone’s notification ID, language, time zone, favorite team and notification preferences, so we send the right message at the right time.',
          'Your votes (Guess the verdict, agree or not with a rating), linked to that notification ID, never to your name.',
          'Anonymous usage statistics (Firebase Analytics) only if you allow it; no advertising ID.',
        ],
      },
      {
        title: 'What we do not collect',
        items: [
          'No name, email, phone number or address.',
          'No location, contacts or photos.',
          'No advertising ID, no browsing history.',
        ],
      },
      {
        title: 'Where the data goes',
        items: [
          'Supabase, our database, hosted in Ireland (European Union): game data, notification preferences and votes.',
          'Firebase, by Google: sending notifications and, if you allow it, usage statistics.',
          'Vercel: website hosting.',
        ],
        paragraphs: ['Nothing is sold or shared for advertising.'],
      },
      {
        title: 'How long',
        items: [
          'Website and app settings stay on your device until you clear them or delete the app.',
          'Notification data is deleted once your phone can no longer be reached.',
          'Tier list votes are kept anonymously to compute the ranking.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: [
          'You can ask to access, correct or delete your data, and object to its processing (GDPR). The simplest way: turning off notifications or deleting the app removes what is linked to your phone.',
          'Reggie is for everyone and collects nothing specific about minors.',
        ],
      },
    ],
    contactTitle: 'Contact',
    contactText: 'A question about your data? Write to us:',
    contactPending: 'A contact address is coming with the website’s domain name.',
  },
};
