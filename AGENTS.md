# Agent Rules

## Tech Stack

- **Prisma 7** — Database ORM with multi-tenant schema
- **Supabase** — PostgreSQL hosting, Auth, Realtime, Storage
- **Next.js** — Admin dashboard (App Router)
- **Expo** — Consumer mobile app

## Code Style (mandatory)

- **Simple, readable code** — clarity over cleverness. No fancy one-liners when a clear multi-line version is easier to understand.
- **Extract logic into hooks and services** — components should be thin; business logic and data-fetching live in dedicated hooks/services.
- **Use utils and types** — shared helpers go in `utils/`, shared types go in `types/`. No inline type definitions or utility logic scattered across components.
- **Break code into smaller components** — no monolithic files. If a component grows beyond a single responsibility, split it.
