# Teknos Career Recruitment System

Next.js App Router application for `career.teknos.id`, covering the public career site and the internal HRD recruitment dashboard in one deployment unit.

## Stack

- Next.js 15 App Router
- TypeScript strict mode
- Tailwind CSS
- Supabase PostgreSQL, Auth, and Storage
- Zod validation
- Docker standalone deployment

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://career.teknos.id
MAX_UPLOAD_MB=5
```

Without Supabase env values, the app uses local sample data so the scaffold can still build and run.

## Project Structure

```text
src/
  app/                 App Router routes
  components/          Public, admin, form, and UI components
  lib/                 Services, validation, Supabase clients, utilities
  types/               Shared database types
supabase/
  migrations/          SQL migrations
  seed.sql             Department seed data
```

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Deployment

The app is configured with `output: "standalone"` for VPS Docker deployment.

```bash
docker build -t teknos-career .
docker compose up -d
```
