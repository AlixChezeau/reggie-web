# Reggie · site web

Le site de Reggie, l'app qui dit quel match NBA revoir, sans spoil. Il pousse d'abord vers l'app
(App Store en tête, aperçu de l'app), puis montre la dernière nuit en couleurs comme preuve.

**Règle absolue : jamais de spoil.** Aucune requête ne lit les scores. Les pages publiques montrent des
verdicts (Épique · Immanquable · À voir · À zapper) et les matchs à venir. La note sur 10 et l'analyse
d'après-match ne sont chargées qu'à la demande (« Fais-moi rêver », route `/api/fais-moi-rever/[slug]`).

## Pages

| Adresse | Contenu |
|---|---|
| `/fr`, `/en` | Accueil : l'app d'abord, la dernière nuit en preuve, les prochains matchs |
| `/fr/nuit/[date]`, `/en/night/[date]` | Une nuit (date NBA, heure de New York) ; `/fr/nuit` renvoie vers la dernière |
| `/[langue]/match/[affiche]` | Un match, en Zéro spoil par défaut |
| `/[langue]/tier-list` | Tier list des fans (aperçu : les votes ne sont pas encore enregistrés) |
| `/fr/methodologie`, `/en/methodology` | Comment Reggie note |
| `/fr/equipes`, `/fr/equipe/[équipe]` (et `/en/teams`, `/en/team/…`) | Les équipes et leurs verdicts |
| `/fr/confidentialite`, `/en/privacy` | Confidentialité |

## Lancer en local

```bash
cp .env.example .env.local   # puis remplir l'URL et la clé publishable Supabase
npm install
npm run dev                  # http://localhost:3000
```

Le site ne lit que des données publiques avec la clé **publishable** de Supabase
(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Jamais de clé secrète dans ce dépôt public ni dans Vercel.

## Stack

Next.js 16 (App Router), next-intl (français et anglais US), Tailwind CSS 4, Supabase en lecture seule.
Les couleurs, le lexique et le format conseillé suivent l'app (`constants/theme.ts`, `lib/zeroSpoil.ts`,
`lib/watchFormat.ts` du dépôt reggie-mobile) ; les logos viennent de `assets/brand/` de l'app.
