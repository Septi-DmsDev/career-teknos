# Teknos Career Recruitment System — Design Spec

**Date:** 2026-05-15  
**Domain:** career.teknos.id  
**Status:** Approved for implementation

---

## 1. Overview

Single Next.js 15 App Router project containing both the public career site and the internal HRD admin dashboard. Backed by an existing Supabase project (PostgreSQL + Auth + Storage). Deployed to VPS via Docker with Nginx as reverse proxy.

**Confirmed decisions:**
- Deployment: VPS + Docker (`output: 'standalone'`) + Nginx + Let's Encrypt SSL
- Mandatory documents: CV + KTP + Ijazah. Transkrip, Pas Foto, Portofolio are optional.
- Visual: Modern professional, Navy/Blue brand (`#1E3A5F` primary, `#2563EB` accent), Inter font
- Supabase: existing project, keys already available
- Single admin role: Admin HRD

---

## 2. Architecture

### Approach

Monorepo single Next.js app with route groups `(public)` and `admin`. Shared types, shared Zod schemas, shared Supabase clients. One deployment unit.

### Folder Structure

```
c:\NEXT\career-teknos/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                        # Home karir
│   │   ├── lowongan/
│   │   │   ├── page.tsx                    # Daftar lowongan
│   │   │   └── [slug]/
│   │   │       ├── page.tsx                # Detail lowongan
│   │   │       └── lamar/page.tsx          # Form lamaran
│   │   ├── lamaran/berhasil/page.tsx       # Success page
│   │   └── privacy/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── layout.tsx                      # Auth guard + sidebar layout
│   │   ├── dashboard/page.tsx
│   │   ├── lowongan/
│   │   │   ├── page.tsx
│   │   │   ├── tambah/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/page.tsx
│   │   ├── pelamar/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── export/page.tsx
│   │   └── pengaturan/page.tsx
│   ├── api/
│   │   ├── applications/route.ts           # Submit lamaran (service role)
│   │   ├── documents/[id]/download/route.ts # Signed URL download
│   │   └── export/applicants/route.ts      # CSV export
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── public/                             # Hero, JobCard, JobFilter, etc.
│   ├── admin/                              # Sidebar, StatCard, ApplicantTable, etc.
│   ├── forms/                              # ApplicationForm, JobForm
│   └── ui/                                # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser anon client
│   │   ├── server.ts                       # Server component client (cookies)
│   │   └── admin.ts                        # Service role client (server only)
│   ├── validations/
│   │   ├── application.ts                  # Zod schema form lamaran
│   │   └── job.ts                          # Zod schema form lowongan
│   ├── services/
│   │   ├── jobs.ts
│   │   ├── applicants.ts
│   │   ├── documents.ts
│   │   └── audit.ts
│   └── utils.ts
├── middleware.ts                           # Protect /admin/* routes
├── types/
│   └── database.ts                         # Supabase generated types
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── next.config.ts                          # output: 'standalone'
```

### Key Architectural Rules

1. `lib/services/` is the only layer that queries Supabase — UI components never query directly
2. `lib/supabase/admin.ts` (service role) is imported **only** in `app/api/` route handlers — never in components or client-side code
3. `middleware.ts` protects all `/admin/*` routes except `/admin/login` by checking Supabase session
4. Public pages use `lib/supabase/server.ts` (anon key + RLS) to fetch only active jobs
5. All critical validation runs server-side via Zod before any DB write

---

## 3. Database

### Tables

| Table | Purpose |
|---|---|
| `admin_profiles` | Linked to `auth.users`, tracks HRD admin accounts |
| `departments` | 7 divisions master data |
| `jobs` | Job listings with status lifecycle |
| `applicants` | Candidate submissions, unique per (job_id, email) |
| `applicant_documents` | File metadata pointing to Storage paths |
| `applicant_notes` | Internal HRD notes per applicant |
| `status_histories` | Immutable audit trail of status changes |
| `activity_logs` | Admin action audit log |

### Job Status Lifecycle

```
draft → active → closed → archived
           ↑
      (can unpublish back to draft)
```

### Applicant Status Lifecycle

```
new → screening → shortlisted → interview → accepted
                                          ↘ rejected
                                          ↘ talent_pool
```

### Anti-duplicate

`UNIQUE INDEX` on `(job_id, lower(email))` — one active application per candidate per job.

### Seed Data

7 departments seeded on first migration: Gudang, Finishing, Desain, Printing, Customer Service, Logistik/Driver, Offset.

---

## 4. Security Model

### RLS Policies

| Table | Public (anon) | Admin (authenticated) |
|---|---|---|
| `departments` | SELECT active only | ALL |
| `jobs` | SELECT status=active only | ALL |
| `applicants` | None | SELECT, UPDATE |
| `applicant_documents` | None | SELECT |
| `applicant_notes` | None | ALL |
| `status_histories` | None | ALL |
| `activity_logs` | None | SELECT, INSERT |
| `admin_profiles` | None | SELECT own row |

All admin policies gate through `is_active_admin()` helper function.

### API Security

- `POST /api/applications` — uses service role to insert applicant + documents. Validates with Zod before any DB operation. **UUID pre-generation:** generate `applicant_id = crypto.randomUUID()` server-side first, use it as both the Storage path prefix (`applicants/{applicant_id}/...`) and the explicit `id` when inserting to `applicants` table. This avoids chicken-and-egg between upload path and DB insert. If any file upload fails or DB insert fails, delete all files already uploaded for this `applicant_id` (cleanup on error).
- `GET /api/documents/[id]/download` — validates admin session, generates short-lived Supabase signed URL (60 seconds), streams to admin browser.
- `GET /api/export/applicants` — validates admin session, streams CSV response with proper headers.

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=        # safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # safe for client
SUPABASE_SERVICE_ROLE_KEY=       # server only, never exposed
NEXT_PUBLIC_SITE_URL=https://career.teknos.id
MAX_UPLOAD_MB=5
```

---

## 5. Storage

### Bucket

`applicant-documents` — private bucket. No public access.

### Path Convention

```
applicants/{applicant_id}/{doc_type}/{timestamp}-{sanitized_filename}
```

### File Rules

| Document | Required | Formats | Max Size |
|---|---|---|---|
| CV | **Yes** | PDF, DOC, DOCX | 5 MB |
| KTP | **Yes** | JPG, PNG, PDF | 5 MB |
| Ijazah | **Yes** | JPG, PNG, PDF | 5 MB |
| Transkrip | No | JPG, PNG, PDF | 5 MB |
| Pas Foto | No | JPG, PNG | 2 MB |
| Portofolio | No | PDF, any file | 10 MB |

Validation runs server-side in `/api/applications` before upload to Storage.

---

## 6. Public Site

### Visual Design

- Primary: `#1E3A5F` (Navy), Accent: `#2563EB` (Blue-600)
- Background: `#F8FAFC`, Text: `#0F172A`
- Font: Inter (via `next/font/google`)
- Component library: shadcn/ui (Button, Card, Badge, Input, Select, Checkbox, Toast)

### Pages

**`/` — Home Karir**
- Hero: headline + CTA → `/lowongan`
- "Kenapa Teknos" section: 3–4 value points
- Division grid: 7 divisions with icons
- 3 latest active jobs (server component)
- Final CTA

**`/lowongan` — Daftar Lowongan**
- Server component fetches all active jobs
- Client component handles division filter (pill tabs) + title search
- Job cards: title, division badge, location, employment type, deadline
- Empty state when no results

**`/lowongan/[slug]` — Detail Lowongan**
- `generateMetadata` for SEO
- Full job detail: description, responsibilities, requirements, benefits, deadline
- If job is not active: `redirect('/lowongan')`
- Sticky "Lamar Sekarang" CTA button

**`/lowongan/[slug]/lamar` — Form Lamaran (3 Steps)**

| Step | Fields |
|---|---|
| 1. Data Diri | Nama, TTL, Gender, Email, WhatsApp, No. Alternatif, Alamat, Pendidikan, Institusi, Jurusan, Tahun Lulus |
| 2. Info Karir | Pengalaman Kerja, Skill Utama, Ekspektasi Gaji, Tanggal Siap Kerja, Sumber Info |
| 3. Dokumen | CV (wajib), KTP (wajib), Ijazah (wajib), Transkrip, Pas Foto, Portofolio, Checkbox Consent |

- Zod validation per step, React Hook Form state persists across steps
- `POST /api/applications` on final submit
- Loading state during upload + submit
- On success: redirect to `/lamaran/berhasil`
- On duplicate (same email + job): show specific error message
- On error: toast with clear message, do not lose form data

**`/lamaran/berhasil`**
- Confirmation message with applicant name
- Link back to `/lowongan`

---

## 7. Admin Dashboard

### Auth Flow

- `/admin/login`: Supabase Auth email/password sign-in
- On success: redirect to `/admin/dashboard`
- `middleware.ts`: check session on every `/admin/*` request, redirect to login if missing
- Logout: sign out + redirect to `/admin/login`

### Layout

- Left sidebar: Teknos logo, nav links (Dashboard, Lowongan, Pelamar, Export, Pengaturan), admin name, logout button
- Top bar: page title + breadcrumb
- Responsive: sidebar collapses to hamburger on mobile

### Pages

**`/admin/dashboard`**
- 8 stat cards: Total, Baru, Screening, Shortlisted, Interview, Diterima, Ditolak, Lowongan Aktif
- "Pelamar Terbaru" table: 10 most recent with name, position, division, date, status badge, link to detail
- Quick links to `/admin/pelamar` and `/admin/lowongan`

**`/admin/lowongan`**
- Table: title, division, employment type, status, created date, applicant count
- Search by title, filter by status (draft/active/closed/archived)
- Actions per row: Edit, Publish/Unpublish, Close
- "Tambah Lowongan" button

**`/admin/lowongan/tambah` & `[id]/edit`**
- Fields: title, slug (auto-generated, editable), division, employment type, location, description, responsibilities, requirements, benefits, deadline, status
- Slug uniqueness validated server-side
- Save as Draft or Publish directly

**`/admin/pelamar`**
- Table: name, position, division, WhatsApp, submitted date, status badge
- Filters: position, division, status
- Search: name / email / WhatsApp
- Sort: newest / oldest
- Pagination (20 per page)

**`/admin/pelamar/[id]`**
Two-column layout:
- Left: Full candidate data, status history timeline, activity log
- Right panel: Status update dropdown + confirm button, Notes textarea + save button, Document list with download buttons

**`/admin/export`**
- Optional filters: division, position, status, date range
- "Export CSV" button → streams CSV download from server
- Columns: name, email, WhatsApp, position, division, status, submitted date, education, institution, expected salary

**`/admin/pengaturan`**
- Display: admin name, email (read-only from Supabase Auth)
- Change password via Supabase Auth `updateUser`

### Audit Logging

Written to `activity_logs` from server-side on:
- Admin login
- Job created / published / closed
- Applicant status changed
- Note added
- Document downloaded
- CSV exported

---

## 8. Deployment

### Next.js Config

```ts
// next.config.ts
const nextConfig = {
  output: 'standalone',
}
```

### Dockerfile (Multi-stage)

```dockerfile
FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### Nginx Config

```nginx
server {
    listen 443 ssl http2;
    server_name career.teknos.id;

    ssl_certificate /etc/letsencrypt/live/career.teknos.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/career.teknos.id/privkey.pem;

    client_max_body_size 15M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name career.teknos.id;
    return 301 https://$host$request_uri;
}
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

### Dev Workflow

```bash
npm run dev                       # local dev
docker build -t teknos-career .   # build image
docker compose up -d              # run on VPS
docker compose logs -f            # tail logs
```

---

## 9. Edge Cases

| Area | Case | Handling |
|---|---|---|
| Form lamaran | Duplicate email + job | Return 409, show specific message, keep form data |
| File upload | DB insert fails after upload | Delete uploaded files from Storage (cleanup) |
| File upload | File too large | Reject before upload with max size message |
| File upload | Invalid format | Reject before upload with accepted formats message |
| Public job | Job not active | Redirect to `/lowongan` |
| Admin | Session expired | Middleware redirects to `/admin/login` |
| Admin | Status change | Write to `status_histories` before updating `applicants.current_status` |
| Document download | File not found in Storage | Return 404 with clear error |

---

## 10. Definition of Done (MVP)

- [ ] Public site displays active jobs
- [ ] Candidates can submit application without login (CV + KTP + Ijazah required)
- [ ] Documents stored in private Supabase Storage bucket
- [ ] Candidate data saved to database
- [ ] Admin can log in and log out
- [ ] Admin dashboard shows recruitment statistics
- [ ] Admin can create, edit, publish, and close job listings
- [ ] Admin can view and filter applicant list
- [ ] Admin can view full applicant detail
- [ ] Admin can update applicant status (history saved)
- [ ] Admin can add internal notes
- [ ] Admin can download candidate documents via signed URL
- [ ] Admin can export applicant data as CSV
- [ ] RLS active — public cannot access candidate data
- [ ] Deployed to VPS via Docker + Nginx
