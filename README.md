# Ranked11

FIFA World Cup ranking trivia game built with Next.js 15. Rank the Top 10 in 20 historical categories, play the daily challenge, and test your knowledge in Normal or Hard mode.

## Features

- **Daily Challenge** — Same category for all players, rotates at UTC midnight
- **20 Categories** — Teams, players, coaches, countries, and tournaments
- **Dual interaction modes** — Drag & Drop (dnd-kit) and Tap to Place
- **Scoring system** — Distance-based scoring, max 100 points
- **Bilingual** — English and Portuguese (Brazil) via next-intl
- **Themes** — Light, dark, and system via next-themes
- **Responsive** — Mobile-first layout

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4 + shadcn/ui patterns
- next-intl, next-themes, @dnd-kit/core, Motion, Zod

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run Playwright E2E tests |

## Project Structure

```
src/
├── app/[locale]/     # Localized routes
├── components/       # UI, game, layout components
├── data/categories/  # Static JSON category data
├── hooks/            # Game and preference hooks
├── i18n/             # next-intl configuration
├── lib/              # Game engine, storage, repositories
└── types/            # TypeScript interfaces
messages/             # en.json, pt-BR.json
tests/                # Unit and E2E tests
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel (Next.js preset)
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL
4. Deploy — preview environments created per PR

## Post-MVP Roadmap

Repository adapters in `src/lib/repositories/` are ready for Supabase migration:

- `LocalJsonCategoryRepository` → `SupabaseCategoryRepository`
- `LocalStorageAttemptRepository` → `SupabaseAttemptRepository`
- Leaderboards via `SupabaseLeaderboardRepository`
- Schema reference: `supabase/schema.sql`

## License

Private — All rights reserved.
