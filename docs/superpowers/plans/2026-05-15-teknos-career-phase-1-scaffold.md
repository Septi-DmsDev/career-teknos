# Teknos Career Phase 1 Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the initial Next.js recruitment app foundation from the approved design spec.

**Architecture:** Single Next.js App Router application with public career routes, admin routes, shared Supabase clients, shared validation schemas, and service modules under `src/`. This phase creates a working scaffold and placeholders that compile, while keeping data writes behind route handlers.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Zod, React Hook Form, Supabase SSR, Supabase JS, Docker standalone deployment.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/(public)/page.tsx`

- [ ] Generate a Next.js App Router TypeScript project with Tailwind and ESLint.
- [ ] Preserve existing `docs/` and concept markdown files.
- [ ] Set `next.config.ts` to `output: 'standalone'`.
- [ ] Run `npm install`.
- [ ] Run `npm run lint`.

### Task 2: Shared Domain Types and Validation

**Files:**
- Create: `src/types/database.ts`
- Create: `src/lib/domain.ts`
- Create: `src/lib/validations/application.ts`
- Create: `src/lib/validations/job.ts`
- Create: `src/lib/utils.ts`

- [ ] Define MVP enums and lightweight database row types.
- [ ] Define application form validation, including required CV, KTP, and Ijazah document types.
- [ ] Define job form validation and slug rules.
- [ ] Add utility helpers for class names, slug generation, and file name sanitization.
- [ ] Run `npm run lint`.

### Task 3: Supabase Boundary

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`
- Create: `src/middleware.ts`
- Create: `.env.example`

- [ ] Add browser, server, and service-role Supabase clients.
- [ ] Keep service-role client server-only.
- [ ] Add middleware protection for `/admin/*` except `/admin/login`.
- [ ] Document required environment variables.
- [ ] Run `npm run lint`.

### Task 4: Public and Admin Shell

**Files:**
- Create: `src/components/public/*`
- Create: `src/components/admin/*`
- Create: `src/components/ui/*`
- Create: `src/app/(public)/lowongan/page.tsx`
- Create: `src/app/(public)/lowongan/[slug]/page.tsx`
- Create: `src/app/(public)/lowongan/[slug]/lamar/page.tsx`
- Create: `src/app/(public)/lamaran/berhasil/page.tsx`
- Create: `src/app/(public)/privacy/page.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/dashboard/page.tsx`
- Create: `src/app/admin/lowongan/page.tsx`
- Create: `src/app/admin/pelamar/page.tsx`
- Create: `src/app/admin/export/page.tsx`
- Create: `src/app/admin/pengaturan/page.tsx`

- [ ] Add responsive public shell and job listing placeholders.
- [ ] Add login page and protected admin layout skeleton.
- [ ] Add dashboard/table placeholders that match the approved MVP sitemap.
- [ ] Run `npm run lint`.

### Task 5: API and Deployment Foundation

**Files:**
- Create: `src/app/api/applications/route.ts`
- Create: `src/app/api/documents/[id]/download/route.ts`
- Create: `src/app/api/export/applicants/route.ts`
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `supabase/seed.sql`
- Create: `Dockerfile`
- Create: `docker-compose.yml`

- [ ] Add route handlers with validation and safe placeholder responses where DB integration needs real Supabase credentials.
- [ ] Add initial SQL migration with tables, RLS helper, policies, and storage bucket note.
- [ ] Add seed departments.
- [ ] Add Docker standalone deployment files.
- [ ] Run `npm run lint` and `npm run build`.
