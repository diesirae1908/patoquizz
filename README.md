# Patoquizz

Quiz quotidien de géographie française, inspiré de SUTOM/Wordle.

## Fonctionnalités

- 6 questions par jour, difficulté croissante
- Réponse libre avec tolérance aux fautes de frappe
- Partage spoiler-free du résultat
- Compte optionnel avec statistiques et classement
- Plus de 1 100 questions pré-générées

## Stack

- Next.js 16 (App Router)
- Supabase (Postgres + Auth)
- Tailwind CSS
- Déploiement Render

## Développement local

```bash
npm install
cp .env.example .env.local
# Remplir les variables Supabase
npm run dev
```

## Base de données

1. Exécuter `supabase/migrations/001_initial_schema.sql` dans l'éditeur SQL Supabase
2. Lancer le seed :

```bash
npm run seed
```

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build production
- `npm run seed` — insérer questions et quiz quotidiens
- `npm run questions:count` — compter les questions générées
