# Kura

An interactive anime discovery platform for exploring anime by studio, genre, and personal taste. Live data is proxied from the AniList GraphQL API; user libraries, collections, and settings are stored in a Neon PostgreSQL database.

## Features

- **Explore** — Browse thousands of anime with real-time search, genre filters, and sort options (Top Rated, Popular, Trending, Newest). Infinite scroll pagination.
- **Anime detail** — Full detail pages with synopsis, characters, studio link, and recommendations.
- **Studios** — Browse popular animation studios, click through to see their full catalogue.
- **Vault** — Personal library with five watch statuses (Watching, Completed, Plan to Watch, On Hold, Dropped). Entries are enriched with live AniList data.
- **Library button** — Add/change/remove any anime from your library directly on the detail page.
- **Settings** — Display name, preferred genres, and default sort order.
- **Auth** — Sign up / sign in via Neon Auth (Better Auth). Session-gated pages degrade gracefully for unauthenticated users.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Base UI) |
| GraphQL Server | Apollo Server v5 |
| GraphQL Client | Apollo Client v4 |
| ORM | Prisma v7 (with Neon adapter) |
| Database | Neon PostgreSQL |
| Auth | Neon Auth (Better Auth) |
| Anime Data | AniList GraphQL API (live, no key required) |
| Type Generation | GraphQL Code Generator |
| Hosting | Vercel |

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...path]/     # Neon Auth proxy handler
│   │   └── graphql/            # Apollo Server endpoint (GET + POST)
│   ├── auth/                   # Sign-in / sign-up pages
│   ├── explore/                # Anime browse + detail pages
│   ├── studios/                # Studio list + detail pages
│   ├── vault/                  # Personal library
│   └── settings/               # User preferences
├── graphql/
│   ├── schema/typeDefs.ts      # GraphQL schema
│   ├── resolvers/              # anilist.ts (AniList proxy) + library.ts (user data)
│   └── context.ts              # Request context (Prisma + auth session)
├── lib/
│   ├── prisma.ts               # PrismaClient singleton (Neon adapter)
│   ├── auth.ts                 # Neon Auth server instance
│   ├── auth-client.ts          # Neon Auth browser client
│   └── anilist.ts              # AniList fetch helper + raw queries
└── modules/
    ├── explore/                # AnimeCard, FilterSidebar, useAnimeFilter hook
    ├── studios/                # StudioCard
    └── vault/                  # LibraryButton, vault queries + mutations
```

## Data Flow

- **Anime data** — fetched live from AniList on every request (1-hour Next.js cache). Nothing stored locally.
- **User data** — library entries, personal ratings, collections, and settings stored in Neon PostgreSQL via Prisma.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

This also runs `prisma generate` and `prisma db push` automatically via the `postinstall` script.

### 2. Configure environment

Create a `.env` file:

```
DATABASE_URL="postgresql://..."
NEON_AUTH_BASE_URL="https://....neonauth.....aws.neon.tech/.../auth"
NEXT_PUBLIC_NEON_AUTH_BASE_URL="https://....neonauth.....aws.neon.tech/.../auth"
NEON_AUTH_COOKIE_SECRET="<32+ char secret — generate with: openssl rand -base64 32>"
```

### 3. Generate GraphQL types

```bash
npm run codegen
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to Neon |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Wipe and re-push the database |
| `npm run codegen` | Generate typed GraphQL hooks from schema + queries |
| `npm run lint` | Run ESLint |
