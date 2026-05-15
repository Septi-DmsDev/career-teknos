# Teknos Career — Phase 2: Full Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all MVP features on top of the Phase 1 scaffold — full application form, complete admin CRUD, Supabase integration, document download, CSV export, and audit logging.

**Architecture:** Existing single Next.js 15 App Router app under `src/`. Services at `src/lib/services/` already have Supabase fallback pattern (`hasSupabasePublicEnv()` / `hasSupabaseAdminEnv()`). Admin mutations use Server Actions. Public form submits to `/api/applications` route handler with service role key.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind CSS, shadcn/ui, React Hook Form, Zod, Supabase SSR (`@supabase/ssr`), Supabase JS, Vitest

**Current state (Phase 1 complete):**
- Scaffold: all folders, files, types, services, validations, sample fallback — ✅
- lint / typecheck / build / 4 tests — ✅ passing
- Application form: skeleton only (no RHF, no validation wiring, no API submit)
- Admin pages: skeleton/placeholder only
- `/api/applications`: DB insert only has 5 fields (missing all personal data fields)
- Document download API: stub
- CSV export API: stub
- Admin job CRUD: stub
- Admin applicant detail: stub

---

## File Map

**Modified files (Phase 2):**
- `src/app/api/applications/route.ts` — complete DB insert with all applicant fields
- `src/app/api/documents/[id]/download/route.ts` — implement signed URL
- `src/app/api/export/applicants/route.ts` — implement CSV generation
- `src/components/forms/application-form.tsx` — full multi-step RHF form
- `src/lib/services/applicants.ts` — add updateStatus, addNote, getApplicantById, getApplicants with filters
- `src/lib/services/jobs.ts` — add createJob, updateJob, updateJobStatus, getDepartments (admin)
- `src/lib/services/documents.ts` — add getApplicantDocuments, createSignedUrl
- `src/lib/services/audit.ts` — implement logActivity
- `src/app/(public)/page.tsx` — complete home page with all sections
- `src/app/(public)/lowongan/page.tsx` — filter + search wired
- `src/app/(public)/lowongan/[slug]/page.tsx` — full detail page
- `src/app/(public)/lowongan/[slug]/lamar/page.tsx` — wire ApplicationForm
- `src/app/admin/login/page.tsx` — implement Supabase Auth sign-in
- `src/app/admin/layout.tsx` — complete sidebar + auth logout
- `src/app/admin/dashboard/page.tsx` — already correct (needs service fix)
- `src/app/admin/lowongan/page.tsx` — job table with actions
- `src/app/admin/lowongan/tambah/page.tsx` — job create form
- `src/app/admin/lowongan/[id]/page.tsx` — job detail
- `src/app/admin/lowongan/[id]/edit/page.tsx` — job edit form
- `src/app/admin/pelamar/page.tsx` — applicant table with filters
- `src/app/admin/pelamar/[id]/page.tsx` — full applicant detail
- `src/app/admin/export/page.tsx` — export form
- `src/app/admin/pengaturan/page.tsx` — settings

**New files (Phase 2):**
- `src/components/forms/job-form.tsx` — shared form for create/edit job
- `src/components/forms/application-step1.tsx`
- `src/components/forms/application-step2.tsx`
- `src/components/forms/application-step3.tsx`
- `src/components/admin/status-badge.tsx`
- `src/components/admin/status-update-panel.tsx`
- `src/components/admin/note-panel.tsx`
- `src/components/admin/document-list.tsx`
- `src/components/admin/job-table.tsx`
- `src/app/admin/lowongan/_actions.ts` — Server Actions for job CRUD
- `src/app/admin/pelamar/_actions.ts` — Server Actions for status + notes

---

## Task 1: Fix Applications API — Full DB Insert

**Files:**
- Modify: `src/app/api/applications/route.ts`

The current insert only sends 5 fields. Fix to send all applicant fields from the full schema.

- [ ] Open `src/app/api/applications/route.ts`

- [ ] Replace the DB insert block (currently around line 81–90) with the full insert:

```typescript
const { error } = await supabase.from("applicants").insert({
  id: applicantId,
  job_id: parsed.data.jobId,
  full_name: parsed.data.fullName,
  birth_place: parsed.data.birthPlace || null,
  birth_date: parsed.data.birthDate || null,
  gender: parsed.data.gender || null,
  email: parsed.data.email,
  whatsapp_number: parsed.data.whatsapp,
  alternative_phone: parsed.data.alternativePhone || null,
  domicile_address: parsed.data.domicileAddress,
  last_education: parsed.data.lastEducation,
  institution_name: parsed.data.institutionName || null,
  major: parsed.data.major || null,
  graduation_year: parsed.data.graduationYear ? Number(parsed.data.graduationYear) : null,
  work_experience: parsed.data.workExperience || null,
  skills: parsed.data.skills || null,
  expected_salary: parsed.data.expectedSalary ? Number(parsed.data.expectedSalary) : null,
  available_start_date: parsed.data.availableStartDate || null,
  source_info: parsed.data.sourceInfo || null,
  consent_data_usage: true,
  current_status: "new",
});
```

- [ ] After the applicant insert, insert document metadata records:

```typescript
// After successful applicant insert, insert document metadata
const docInserts = uploadedPaths.map((storagePath) => {
  const parts = storagePath.split("/");
  const docType = parts[parts.length - 2]; // e.g. "cv", "ktp"
  const fileName = parts[parts.length - 1].replace(/^\d+-/, ""); // strip timestamp prefix
  return {
    applicant_id: applicantId,
    document_type: docType,
    file_name: fileName,
    file_path: storagePath,
  };
});
if (docInserts.length > 0) {
  await supabase.from("applicant_documents").insert(docInserts);
}

// Insert initial status history
await supabase.from("status_histories").insert({
  applicant_id: applicantId,
  old_status: null,
  new_status: "new",
  changed_by: null,
  note: "Lamaran masuk",
});
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Run: `npm run lint`
  Expected: no errors

- [ ] Commit:
```bash
git add src/app/api/applications/route.ts
git commit -m "fix: complete applicant DB insert with all fields, doc metadata, status history"
```

---

## Task 2: Document Download API

**Files:**
- Modify: `src/app/api/documents/[id]/download/route.ts`

- [ ] Open `src/app/api/documents/[id]/download/route.ts` and replace stub with:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verify admin session
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get document record
  const adminClient = createAdminSupabaseClient();
  const { data: doc, error } = await adminClient
    .from("applicant_documents")
    .select("file_path, file_name, mime_type")
    .eq("id", id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
  }

  // Generate signed URL (60 seconds)
  const { data: signed, error: signError } = await adminClient.storage
    .from("applicant-documents")
    .createSignedUrl(doc.file_path, 60);

  if (signError || !signed) {
    return NextResponse.json({ error: "Gagal membuat link dokumen" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl, fileName: doc.file_name });
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Commit:
```bash
git add src/app/api/documents/[id]/download/route.ts
git commit -m "feat: implement document signed URL download endpoint"
```

---

## Task 3: CSV Export API

**Files:**
- Modify: `src/app/api/export/applicants/route.ts`

- [ ] Open `src/app/api/export/applicants/route.ts` and replace stub with:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const jobId = searchParams.get("job_id");

  const adminClient = createAdminSupabaseClient();
  let query = adminClient
    .from("applicants")
    .select("full_name,email,whatsapp_number,domicile_address,last_education,institution_name,major,graduation_year,work_experience,skills,expected_salary,available_start_date,source_info,current_status,submitted_at,job:jobs(title,department:departments(name))")
    .order("submitted_at", { ascending: false });

  if (status) query = query.eq("current_status", status);
  if (jobId) query = query.eq("job_id", jobId);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }

  const headers = [
    "Nama Lengkap","Email","WhatsApp","Alamat","Pendidikan","Institusi","Jurusan",
    "Tahun Lulus","Pengalaman","Skill","Ekspektasi Gaji","Siap Kerja","Sumber Info",
    "Status","Posisi","Divisi","Tanggal Lamar",
  ];

  const rows = (data ?? []).map((a) => {
    const job = Array.isArray(a.job) ? a.job[0] : a.job;
    const dept = job && (Array.isArray(job.department) ? job.department[0] : job.department);
    return [
      a.full_name, a.email, a.whatsapp_number, a.domicile_address,
      a.last_education, a.institution_name, a.major, a.graduation_year,
      a.work_experience, a.skills, a.expected_salary, a.available_start_date,
      a.source_info, a.current_status, job?.title, dept?.name,
      a.submitted_at ? new Date(a.submitted_at).toLocaleDateString("id-ID") : "",
    ].map(escapeCSV).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pelamar-${date}.csv"`,
    },
  });
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Commit:
```bash
git add src/app/api/export/applicants/route.ts
git commit -m "feat: implement CSV export endpoint for applicants"
```

---

## Task 4: Admin Server Actions — Jobs

**Files:**
- Create: `src/app/admin/lowongan/_actions.ts`

- [ ] Create `src/app/admin/lowongan/_actions.ts`:

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { jobFormSchema, type JobFormData } from "@/lib/validations/job";

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function createJobAction(formData: FormData) {
  const user = await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = jobFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Data tidak valid", issues: parsed.error.flatten() };
  }

  const adminClient = createAdminSupabaseClient();
  const now = new Date().toISOString();
  const { data, error } = await adminClient
    .from("jobs")
    .insert({
      ...parsed.data,
      application_deadline: parsed.data.application_deadline || null,
      responsibilities: parsed.data.responsibilities || null,
      benefits: parsed.data.benefits || null,
      published_at: parsed.data.status === "active" ? now : null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Audit log
  await adminClient.from("activity_logs").insert({
    admin_id: user.id,
    action: "job_created",
    entity_type: "job",
    entity_id: data.id,
    metadata: { title: parsed.data.title, status: parsed.data.status },
  });

  revalidatePath("/admin/lowongan");
  redirect(`/admin/lowongan/${data.id}`);
}

export async function updateJobAction(id: string, formData: FormData) {
  const user = await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = jobFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Data tidak valid", issues: parsed.error.flatten() };
  }

  const adminClient = createAdminSupabaseClient();

  // Get current job for published_at / closed_at logic
  const { data: current } = await adminClient
    .from("jobs")
    .select("status, published_at, closed_at")
    .eq("id", id)
    .single();

  const now = new Date().toISOString();
  const publishedAt =
    parsed.data.status === "active" && current?.status !== "active"
      ? now
      : (current?.published_at ?? null);
  const closedAt =
    parsed.data.status === "closed" && current?.status !== "closed"
      ? now
      : (current?.closed_at ?? null);

  const { error } = await adminClient
    .from("jobs")
    .update({
      ...parsed.data,
      application_deadline: parsed.data.application_deadline || null,
      responsibilities: parsed.data.responsibilities || null,
      benefits: parsed.data.benefits || null,
      published_at: publishedAt,
      closed_at: closedAt,
      updated_by: user.id,
      updated_at: now,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await adminClient.from("activity_logs").insert({
    admin_id: user.id,
    action: "job_updated",
    entity_type: "job",
    entity_id: id,
    metadata: { status: parsed.data.status },
  });

  revalidatePath("/admin/lowongan");
  revalidatePath(`/admin/lowongan/${id}`);
  redirect(`/admin/lowongan/${id}`);
}

export async function updateJobStatusAction(id: string, status: string) {
  const user = await requireAdmin();
  const adminClient = createAdminSupabaseClient();
  const now = new Date().toISOString();
  const update: Record<string, unknown> = { status, updated_by: user.id, updated_at: now };
  if (status === "active") update.published_at = now;
  if (status === "closed") update.closed_at = now;

  const { error } = await adminClient.from("jobs").update(update).eq("id", id);
  if (error) return { error: error.message };

  await adminClient.from("activity_logs").insert({
    admin_id: user.id,
    action: `job_${status}`,
    entity_type: "job",
    entity_id: id,
  });

  revalidatePath("/admin/lowongan");
  revalidatePath(`/admin/lowongan/${id}`);
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Commit:
```bash
git add src/app/admin/lowongan/_actions.ts
git commit -m "feat: add server actions for job CRUD and status management"
```

---

## Task 5: Admin Server Actions — Applicants

**Files:**
- Create: `src/app/admin/pelamar/_actions.ts`

- [ ] Create `src/app/admin/pelamar/_actions.ts`:

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ApplicantStatus } from "@/lib/domain";

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function updateApplicantStatusAction(
  applicantId: string,
  newStatus: ApplicantStatus,
  note?: string,
) {
  const user = await requireAdmin();
  const adminClient = createAdminSupabaseClient();

  const { data: current } = await adminClient
    .from("applicants")
    .select("current_status")
    .eq("id", applicantId)
    .single();

  const { error } = await adminClient
    .from("applicants")
    .update({ current_status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", applicantId);

  if (error) return { error: error.message };

  await adminClient.from("status_histories").insert({
    applicant_id: applicantId,
    old_status: current?.current_status ?? null,
    new_status: newStatus,
    changed_by: user.id,
    note: note ?? null,
  });

  await adminClient.from("activity_logs").insert({
    admin_id: user.id,
    action: "applicant_status_changed",
    entity_type: "applicant",
    entity_id: applicantId,
    metadata: { old: current?.current_status, new: newStatus },
  });

  revalidatePath(`/admin/pelamar/${applicantId}`);
  revalidatePath("/admin/pelamar");
  revalidatePath("/admin/dashboard");
}

export async function addApplicantNoteAction(applicantId: string, note: string) {
  const user = await requireAdmin();
  if (!note.trim()) return { error: "Catatan tidak boleh kosong" };

  const adminClient = createAdminSupabaseClient();
  const { error } = await adminClient.from("applicant_notes").insert({
    applicant_id: applicantId,
    admin_id: user.id,
    note: note.trim(),
  });

  if (error) return { error: error.message };

  await adminClient.from("activity_logs").insert({
    admin_id: user.id,
    action: "note_added",
    entity_type: "applicant",
    entity_id: applicantId,
  });

  revalidatePath(`/admin/pelamar/${applicantId}`);
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Commit:
```bash
git add src/app/admin/pelamar/_actions.ts
git commit -m "feat: add server actions for applicant status update and notes"
```

---

## Task 6: Complete Service Layer

**Files:**
- Modify: `src/lib/services/applicants.ts`
- Modify: `src/lib/services/jobs.ts`
- Modify: `src/lib/services/documents.ts`

- [ ] Open `src/lib/services/applicants.ts` and add/replace with complete implementation:

```typescript
import type { ApplicantStatus } from "@/lib/domain";
import { sampleApplicants } from "@/lib/data/sample";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ApplicantFilters {
  search?: string;
  status?: ApplicantStatus;
  jobId?: string;
  page?: number;
  limit?: number;
}

export async function getApplicants(filters: ApplicantFilters = {}) {
  if (!hasSupabasePublicEnv()) {
    return { data: sampleApplicants, count: sampleApplicants.length };
  }
  const { search, status, jobId, page = 1, limit = 20 } = filters;
  const supabase = await createServerSupabaseClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from("applicants")
    .select("id,full_name,email,whatsapp_number,current_status,submitted_at,job:jobs(id,title,department:departments(name))", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,whatsapp_number.ilike.%${search}%`,
    );
  }
  if (status) query = query.eq("current_status", status);
  if (jobId) query = query.eq("job_id", jobId);

  const { data, error, count } = await query;
  if (error) return { data: sampleApplicants, count: sampleApplicants.length };
  return { data: data ?? [], count: count ?? 0 };
}

export async function getApplicantById(id: string) {
  if (!hasSupabasePublicEnv()) {
    return sampleApplicants.find((a) => a.id === id) ?? null;
  }
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("applicants")
    .select(`
      *,
      job:jobs(id,title,slug,department:departments(id,name,slug)),
      documents:applicant_documents(*),
      notes:applicant_notes(*, admin:admin_profiles(full_name)),
      status_histories(*)
    `)
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getApplicantStats() {
  if (!hasSupabasePublicEnv()) {
    return { total: 0, new: 0, screening: 0, shortlisted: 0, interview: 0, accepted: 0, rejected: 0, talent_pool: 0, activeJobs: 0 };
  }
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("applicants").select("current_status");
  const stats = { total: 0, new: 0, screening: 0, shortlisted: 0, interview: 0, accepted: 0, rejected: 0, talent_pool: 0, activeJobs: 0 };
  for (const { current_status } of data ?? []) {
    stats.total++;
    if (current_status in stats) (stats as Record<string, number>)[current_status]++;
  }
  const { count } = await supabase.from("jobs").select("id", { count: "exact" }).eq("status", "active");
  stats.activeJobs = count ?? 0;
  return stats;
}

export async function getRecentApplicants(limit = 10) {
  if (!hasSupabasePublicEnv()) return sampleApplicants.slice(0, limit);
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("applicants")
    .select("id,full_name,email,current_status,submitted_at,job:jobs(title,department:departments(name))")
    .order("submitted_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
```

- [ ] Open `src/lib/services/jobs.ts` and add admin functions (getDepartments, getAllJobsAdmin, getJobByIdAdmin):

```typescript
export async function getDepartments() {
  if (!hasSupabasePublicEnv()) return [];
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("departments")
    .select("id,name,slug,sort_order")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getAllJobsAdmin() {
  if (!hasSupabasePublicEnv()) return sampleJobs;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("jobs")
    .select("*,department:departments(id,name,slug)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getJobByIdAdmin(id: string) {
  if (!hasSupabasePublicEnv()) return sampleJobs.find((j) => j.id === id) ?? null;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("jobs")
    .select("*,department:departments(id,name,slug)")
    .eq("id", id)
    .single();
  return data ?? null;
}
```

- [ ] Open `src/lib/services/documents.ts` and implement:

```typescript
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function buildApplicantDocumentPath({
  applicantId,
  documentType,
  fileName,
}: {
  applicantId: string;
  documentType: string;
  fileName: string;
}): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `applicants/${applicantId}/${documentType}/${Date.now()}-${safe}`;
}

export async function getApplicantDocuments(applicantId: string) {
  if (!hasSupabasePublicEnv()) return [];
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("applicant_documents")
    .select("*")
    .eq("applicant_id", applicantId)
    .order("uploaded_at");
  return data ?? [];
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Commit:
```bash
git add src/lib/services/
git commit -m "feat: complete service layer for applicants, jobs admin, and documents"
```

---

## Task 7: Full Application Form (Multi-Step RHF)

**Files:**
- Create: `src/components/forms/application-step1.tsx`
- Create: `src/components/forms/application-step2.tsx`
- Create: `src/components/forms/application-step3.tsx`
- Modify: `src/components/forms/application-form.tsx`

- [ ] Create `src/components/forms/application-step1.tsx`:

```typescript
"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ApplicationFormValues } from "@/lib/validations/application";

interface Props {
  form: UseFormReturn<ApplicationFormValues>;
}

const educationOptions = ["SD","SMP","SMA/SMK","D1","D2","D3","D4","S1","S2","S3"];
const genderOptions = [{ value: "male", label: "Laki-laki" }, { value: "female", label: "Perempuan" }];

export function ApplicationStep1({ form }: Props) {
  const { register, formState: { errors } } = form;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap *</label>
        <input {...register("fullName")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
        <input type="email" {...register("email")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp *</label>
        <input {...register("whatsapp")} placeholder="+62..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tempat Lahir</label>
        <input {...register("birthPlace")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal Lahir</label>
        <input type="date" {...register("birthDate")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Jenis Kelamin</label>
        <select {...register("gender")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none">
          <option value="">Pilih...</option>
          {genderOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">No. Alternatif</label>
        <input {...register("alternativePhone")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Alamat Domisili *</label>
        <textarea {...register("domicileAddress")} rows={2} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        {errors.domicileAddress && <p className="mt-1 text-xs text-red-500">{errors.domicileAddress.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Pendidikan Terakhir *</label>
        <select {...register("lastEducation")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none">
          <option value="">Pilih...</option>
          {educationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.lastEducation && <p className="mt-1 text-xs text-red-500">{errors.lastEducation.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Institusi/Sekolah</label>
        <input {...register("institutionName")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Jurusan</label>
        <input {...register("major")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tahun Lulus</label>
        <input type="number" {...register("graduationYear")} min="1990" max="2030" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
    </div>
  );
}
```

- [ ] Create `src/components/forms/application-step2.tsx`:

```typescript
"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ApplicationFormValues } from "@/lib/validations/application";

interface Props { form: UseFormReturn<ApplicationFormValues>; }

const sourceOptions = ["LinkedIn","Instagram","Teman/Kenalan","Website Teknos","Jobstreet","Lainnya"];

export function ApplicationStep2({ form }: Props) {
  const { register } = form;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Pengalaman Kerja</label>
        <textarea {...register("workExperience")} rows={4} placeholder="Ceritakan pengalaman kerja Anda secara singkat..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Skill Utama</label>
        <textarea {...register("skills")} rows={2} placeholder="Contoh: AutoCAD, Desain Grafis, Operasional Gudang..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Ekspektasi Gaji (Rp)</label>
        <input type="number" {...register("expectedSalary")} placeholder="3500000" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Siap Mulai Kerja</label>
        <input type="date" {...register("availableStartDate")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Dari mana info lowongan ini?</label>
        <select {...register("sourceInfo")} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none">
          <option value="">Pilih...</option>
          {sourceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}
```

- [ ] Create `src/components/forms/application-step3.tsx`:

```typescript
"use client";

import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ApplicationFormValues } from "@/lib/validations/application";
import { documentRules, documentTypes } from "@/lib/validations/application";

interface Props { form: UseFormReturn<ApplicationFormValues>; }

export function ApplicationStep3({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div className="grid gap-5">
      {documentTypes.map((type) => {
        const rule = documentRules[type];
        const fieldFile = watch(type as keyof ApplicationFormValues) as File | undefined;
        return (
          <div key={type} className="rounded-md border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800">
                  {rule.label} {rule.required && <span className="text-red-500">*</span>}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {rule.hint} · Maks. {rule.maxMb} MB
                </p>
                {fieldFile && (
                  <p className="mt-1 text-xs text-green-600">{fieldFile.name}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRefs.current[type]?.click()}
                className="shrink-0 rounded-md border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/5"
              >
                {fieldFile ? "Ganti" : "Upload"}
              </button>
            </div>
            <input
              ref={(el) => { fileRefs.current[type] = el; }}
              type="file"
              accept={rule.mimeTypes.join(",")}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setValue(type as keyof ApplicationFormValues, file as never, { shouldValidate: true });
              }}
            />
            {errors[type as keyof ApplicationFormValues] && (
              <p className="mt-1 text-xs text-red-500">
                {(errors[type as keyof ApplicationFormValues] as { message?: string })?.message}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex items-start gap-3 rounded-md border border-slate-200 p-4">
        <input type="checkbox" id="consent" {...register("consent")} className="mt-0.5 h-4 w-4 accent-brand" />
        <label htmlFor="consent" className="text-sm text-slate-700">
          Saya menyetujui penggunaan data pribadi saya untuk keperluan proses rekrutmen Teknos. *
        </label>
      </div>
      {errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}
    </div>
  );
}
```

- [ ] Replace `src/components/forms/application-form.tsx` with full multi-step RHF implementation:

```typescript
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JobDetail } from "@/lib/domain";
import { applicationSchema, type ApplicationFormValues } from "@/lib/validations/application";
import { ApplicationStep1 } from "./application-step1";
import { ApplicationStep2 } from "./application-step2";
import { ApplicationStep3 } from "./application-step3";

const STEPS = ["Data Diri", "Info Karir", "Dokumen"];

export function ApplicationForm({ job }: { job: JobDetail }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
  });

  async function onSubmit(values: ApplicationFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.append("jobId", job.id);
    Object.entries(values).forEach(([key, val]) => {
      if (val instanceof File) formData.append(key, val);
      else if (val !== undefined && val !== null && val !== "")
        formData.append(key, String(val));
    });

    startTransition(async () => {
      try {
        const res = await fetch("/api/applications", { method: "POST", body: formData });
        if (res.status === 409) {
          setServerError("Anda sudah pernah melamar posisi ini sebelumnya.");
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setServerError(body.error ?? "Terjadi kesalahan. Silakan coba lagi.");
          return;
        }
        router.push("/lamaran/berhasil");
      } catch {
        setServerError("Koneksi gagal. Periksa internet Anda dan coba lagi.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {/* Step indicator */}
      <div className="mb-6 flex gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => i < step && setStep(i)}
            className={`flex-1 rounded-md border py-2 text-sm font-semibold transition-colors ${
              i === step
                ? "border-brand bg-brand text-white"
                : i < step
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {step === 0 && <ApplicationStep1 form={form} />}
        {step === 1 && <ApplicationStep2 form={form} />}
        {step === 2 && <ApplicationStep3 form={form} />}

        {serverError && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{serverError}</div>
        )}

        <div className="mt-6 flex justify-between gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Kembali
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="ml-auto rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
            >
              Lanjut
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="ml-auto rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
            >
              {isPending ? "Mengirim..." : "Kirim Lamaran"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

- [ ] Run: `npm run typecheck`
  Expected: no type errors

- [ ] Run: `npm run build`
  Expected: builds successfully

- [ ] Commit:
```bash
git add src/components/forms/
git commit -m "feat: complete multi-step application form with RHF, Zod, and file upload"
```

---

## Task 8: Admin Login Page

**Files:**
- Modify: `src/app/admin/login/page.tsx`

- [ ] Replace the stub login page with full Supabase Auth implementation:

```typescript
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email atau password salah. Silakan coba lagi.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white font-bold text-lg">T</div>
          <h1 className="text-2xl font-bold text-slate-900">Admin HRD</h1>
          <p className="mt-1 text-sm text-slate-500">Teknos Career Recruitment</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
          >
            {isPending ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Commit:
```bash
git add src/app/admin/login/page.tsx
git commit -m "feat: implement admin login page with Supabase Auth"
```

---

## Task 9: Admin Job Management Pages

**Files:**
- Create: `src/components/forms/job-form.tsx`
- Create: `src/components/admin/job-table.tsx`
- Modify: `src/app/admin/lowongan/page.tsx`
- Modify: `src/app/admin/lowongan/tambah/page.tsx`
- Modify: `src/app/admin/lowongan/[id]/page.tsx`
- Modify: `src/app/admin/lowongan/[id]/edit/page.tsx`

- [ ] Create `src/components/forms/job-form.tsx`:

```typescript
"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/utils";
import type { Department, JobDetail } from "@/lib/domain";

interface Props {
  departments: Department[];
  defaultValues?: Partial<JobDetail>;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  submitLabel: string;
}

export function JobForm({ departments, defaultValues, action, submitLabel }: Props) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");

  return (
    <form action={formAction} className="grid gap-5 max-w-2xl">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Judul Posisi *</label>
          <input
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Slug *</label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Divisi *</label>
          <select name="department_id" required defaultValue={defaultValues?.departmentCode ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none">
            <option value="">Pilih divisi...</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tipe Kerja *</label>
          <select name="employment_type" required defaultValue={defaultValues?.employmentType ?? "full_time"} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none">
            <option value="full_time">Full Time</option>
            <option value="contract">Kontrak</option>
            <option value="internship">Magang</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Lokasi *</label>
          <input name="location" defaultValue={defaultValues?.location ?? ""} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Deadline Lamaran</label>
          <input type="date" name="application_deadline" defaultValue={defaultValues?.deadline ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi Pekerjaan *</label>
          <textarea name="description" defaultValue={defaultValues?.description ?? ""} rows={5} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Tanggung Jawab</label>
          <textarea name="responsibilities" defaultValue={defaultValues?.responsibilities ?? ""} rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Kualifikasi *</label>
          <textarea name="requirements" defaultValue={defaultValues?.requirements ?? ""} rows={4} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Benefit</label>
          <textarea name="benefits" defaultValue={defaultValues?.benefits ?? ""} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select name="status" defaultValue={defaultValues?.status ?? "draft"} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none">
            <option value="draft">Draft</option>
            <option value="active">Aktif (Publish)</option>
            <option value="closed">Ditutup</option>
            <option value="archived">Diarsipkan</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : submitLabel}
        </button>
        <a href="/admin/lowongan" className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Batal
        </a>
      </div>
    </form>
  );
}
```

- [ ] Update `src/app/admin/lowongan/tambah/page.tsx`:

```typescript
import { getDepartments } from "@/lib/services/jobs";
import { JobForm } from "@/components/forms/job-form";
import { createJobAction } from "../_actions";

export default async function TambahLowonganPage() {
  const departments = await getDepartments();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Tambah Lowongan</h1>
      <JobForm departments={departments} action={createJobAction} submitLabel="Simpan Lowongan" />
    </div>
  );
}
```

- [ ] Update `src/app/admin/lowongan/[id]/edit/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { getDepartments, getJobByIdAdmin } from "@/lib/services/jobs";
import { JobForm } from "@/components/forms/job-form";
import { updateJobAction } from "../../_actions";

export default async function EditLowonganPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [job, departments] = await Promise.all([getJobByIdAdmin(id), getDepartments()]);
  if (!job) notFound();

  const action = updateJobAction.bind(null, id);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Lowongan</h1>
      <JobForm departments={departments} defaultValues={job} action={action} submitLabel="Simpan Perubahan" />
    </div>
  );
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Run: `npm run build`
  Expected: builds successfully

- [ ] Commit:
```bash
git add src/components/forms/job-form.tsx src/components/admin/job-table.tsx src/app/admin/lowongan/
git commit -m "feat: complete admin job management pages and JobForm component"
```

---

## Task 10: Admin Applicant Detail Page

**Files:**
- Create: `src/components/admin/status-badge.tsx`
- Create: `src/components/admin/status-update-panel.tsx`
- Create: `src/components/admin/note-panel.tsx`
- Create: `src/components/admin/document-list.tsx`
- Modify: `src/app/admin/pelamar/[id]/page.tsx`

- [ ] Create `src/components/admin/status-badge.tsx`:

```typescript
import { APPLICANT_STATUS_LABELS, APPLICANT_STATUS_COLORS } from "@/lib/domain";
import type { ApplicantStatus } from "@/lib/domain";

export function StatusBadge({ status }: { status: ApplicantStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${APPLICANT_STATUS_COLORS[status]}`}>
      {APPLICANT_STATUS_LABELS[status]}
    </span>
  );
}
```

- [ ] Add to `src/lib/domain.ts`:

```typescript
export const APPLICANT_STATUS_LABELS: Record<ApplicantStatus, string> = {
  new: "Baru", screening: "Screening", shortlisted: "Shortlisted",
  interview: "Interview", accepted: "Diterima", rejected: "Ditolak", talent_pool: "Talent Pool",
};
export const APPLICANT_STATUS_COLORS: Record<ApplicantStatus, string> = {
  new: "bg-slate-100 text-slate-700",
  screening: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  talent_pool: "bg-orange-100 text-orange-700",
};
```

- [ ] Create `src/components/admin/status-update-panel.tsx`:

```typescript
"use client";

import { useState, useTransition } from "react";
import { APPLICANT_STATUS_LABELS } from "@/lib/domain";
import type { ApplicantStatus } from "@/lib/domain";
import { updateApplicantStatusAction } from "@/app/admin/pelamar/_actions";

const ALL_STATUSES: ApplicantStatus[] = ["new","screening","shortlisted","interview","accepted","rejected","talent_pool"];

export function StatusUpdatePanel({ applicantId, currentStatus }: { applicantId: string; currentStatus: ApplicantStatus }) {
  const [selected, setSelected] = useState<ApplicantStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    if (selected === currentStatus) return;
    startTransition(async () => {
      const result = await updateApplicantStatusAction(applicantId, selected, note || undefined);
      if (result?.error) setMessage(result.error);
      else { setMessage("Status berhasil diperbarui"); setNote(""); }
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 font-semibold text-slate-900">Update Status</h3>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as ApplicantStatus)}
        className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      >
        {ALL_STATUSES.map((s) => <option key={s} value={s}>{APPLICANT_STATUS_LABELS[s]}</option>)}
      </select>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Catatan perubahan status (opsional)..."
        rows={2}
        className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
      {message && <p className="mb-2 text-xs text-green-600">{message}</p>}
      <button
        onClick={handleUpdate}
        disabled={isPending || selected === currentStatus}
        className="w-full rounded-md bg-brand py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
      >
        {isPending ? "Menyimpan..." : "Simpan Status"}
      </button>
    </div>
  );
}
```

- [ ] Create `src/components/admin/note-panel.tsx`:

```typescript
"use client";

import { useState, useTransition } from "react";
import { addApplicantNoteAction } from "@/app/admin/pelamar/_actions";

export function NotePanel({ applicantId }: { applicantId: string }) {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!note.trim()) return;
    startTransition(async () => {
      const result = await addApplicantNoteAction(applicantId, note);
      if (result?.error) setMessage(result.error);
      else { setMessage("Catatan disimpan"); setNote(""); }
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 font-semibold text-slate-900">Tambah Catatan</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Tulis catatan internal HRD..."
        rows={3}
        className="mb-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
      {message && <p className="mb-2 text-xs text-green-600">{message}</p>}
      <button
        onClick={handleSubmit}
        disabled={isPending || !note.trim()}
        className="w-full rounded-md bg-slate-800 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {isPending ? "Menyimpan..." : "Simpan Catatan"}
      </button>
    </div>
  );
}
```

- [ ] Create `src/components/admin/document-list.tsx`:

```typescript
"use client";

import { useState } from "react";
import { DOCUMENT_TYPE_LABELS } from "@/lib/domain";

interface Doc { id: string; document_type: string; file_name: string; }

export function DocumentList({ documents }: { documents: Doc[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDownload(doc: Doc) {
    setLoading(doc.id);
    try {
      const res = await fetch(`/api/documents/${doc.id}/download`);
      const { url, fileName } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    } finally {
      setLoading(null);
    }
  }

  if (documents.length === 0) return <p className="text-sm text-slate-500">Tidak ada dokumen.</p>;

  return (
    <div className="grid gap-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
          <div>
            <p className="text-sm font-medium text-slate-800">
              {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
            </p>
            <p className="text-xs text-slate-500">{doc.file_name}</p>
          </div>
          <button
            onClick={() => handleDownload(doc)}
            disabled={loading === doc.id}
            className="rounded-md border border-brand px-3 py-1 text-xs font-medium text-brand hover:bg-brand/5 disabled:opacity-50"
          >
            {loading === doc.id ? "..." : "Download"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] Update `src/app/admin/pelamar/[id]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { getApplicantById } from "@/lib/services/applicants";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatusUpdatePanel } from "@/components/admin/status-update-panel";
import { NotePanel } from "@/components/admin/note-panel";
import { DocumentList } from "@/components/admin/document-list";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { ApplicantStatus } from "@/lib/domain";

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const applicant = await getApplicantById(id);
  if (!applicant) notFound();

  const job = Array.isArray(applicant.job) ? applicant.job[0] : applicant.job;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: candidate data */}
      <div className="lg:col-span-2 grid gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{applicant.full_name}</h1>
              <p className="text-sm text-slate-500">{job?.title} · {formatDate(applicant.submitted_at)}</p>
            </div>
            <StatusBadge status={applicant.current_status as ApplicantStatus} />
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            {[
              ["Email", applicant.email],
              ["WhatsApp", applicant.whatsapp_number],
              ["No. Alternatif", applicant.alternative_phone],
              ["TTL", applicant.birth_place && applicant.birth_date ? `${applicant.birth_place}, ${formatDate(applicant.birth_date)}` : null],
              ["Gender", applicant.gender === "male" ? "Laki-laki" : applicant.gender === "female" ? "Perempuan" : null],
              ["Alamat", applicant.domicile_address],
              ["Pendidikan", applicant.last_education],
              ["Institusi", applicant.institution_name],
              ["Jurusan", applicant.major],
              ["Tahun Lulus", applicant.graduation_year],
              ["Skill", applicant.skills],
              ["Ekspektasi Gaji", formatCurrency(applicant.expected_salary)],
              ["Siap Mulai", formatDate(applicant.available_start_date)],
              ["Sumber Info", applicant.source_info],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-800">{String(value)}</dd>
              </div>
            ))}
          </dl>

          {applicant.work_experience && (
            <div className="mt-4">
              <p className="mb-1 text-xs text-slate-500">Pengalaman Kerja</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{applicant.work_experience}</p>
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-900">Dokumen</h2>
          <DocumentList documents={applicant.documents ?? []} />
        </div>

        {/* Notes */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-900">Catatan HRD</h2>
          {(applicant.notes ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada catatan.</p>
          ) : (
            <div className="grid gap-3">
              {(applicant.notes ?? []).map((n: { id: string; note: string; created_at: string; admin?: { full_name: string } | null }) => (
                <div key={n.id} className="rounded-md bg-slate-50 p-3 text-sm">
                  <p className="text-slate-800">{n.note}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {n.admin?.full_name ?? "Admin"} · {formatDate(n.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status history */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-900">Riwayat Status</h2>
          {(applicant.status_histories ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada riwayat.</p>
          ) : (
            <div className="grid gap-2">
              {(applicant.status_histories ?? []).map((h: { id: string; old_status: string | null; new_status: string; note: string | null; created_at: string }) => (
                <div key={h.id} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  <div>
                    <span className="text-slate-600">
                      {h.old_status ? `${h.old_status} → ` : ""}{h.new_status}
                    </span>
                    {h.note && <span className="ml-2 text-slate-500">({h.note})</span>}
                    <span className="ml-2 text-xs text-slate-400">{formatDate(h.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: action panel */}
      <div className="grid gap-4 content-start">
        <StatusUpdatePanel applicantId={id} currentStatus={applicant.current_status as ApplicantStatus} />
        <NotePanel applicantId={id} />
        <a
          href="/admin/pelamar"
          className="block rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Kembali ke Daftar Pelamar
        </a>
      </div>
    </div>
  );
}
```

- [ ] Run: `npm run typecheck`
  Expected: no errors

- [ ] Run: `npm run build`
  Expected: builds successfully

- [ ] Commit:
```bash
git add src/components/admin/ src/app/admin/pelamar/[id]/page.tsx
git commit -m "feat: complete applicant detail page with status, notes, and document download"
```

---

## Task 11: Admin Applicant List Page

**Files:**
- Modify: `src/app/admin/pelamar/page.tsx`

- [ ] Update `src/app/admin/pelamar/page.tsx`:

```typescript
import Link from "next/link";
import { getApplicants } from "@/lib/services/applicants";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils";
import type { ApplicantStatus } from "@/lib/domain";
import { APPLICANT_STATUS_LABELS } from "@/lib/domain";

const ALL_STATUSES: ApplicantStatus[] = ["new","screening","shortlisted","interview","accepted","rejected","talent_pool"];

export default async function PelamarPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { data: applicants, count } = await getApplicants({
    search: params.search,
    status: params.status as ApplicantStatus | undefined,
    page,
  });
  const totalPages = Math.ceil((count ?? 0) / 20);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Daftar Pelamar</h1>
        <span className="text-sm text-slate-500">{count} pelamar</span>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Cari nama, email, WhatsApp..."
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <select name="status" defaultValue={params.status ?? ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none">
          <option value="">Semua Status</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{APPLICANT_STATUS_LABELS[s]}</option>)}
        </select>
        <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90">
          Filter
        </button>
        <a href="/admin/pelamar" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Reset
        </a>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {["Nama","Posisi","WhatsApp","Tanggal Lamar","Status",""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applicants.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-slate-500">Tidak ada pelamar ditemukan.</td></tr>
            ) : applicants.map((a) => {
              const job = Array.isArray(a.job) ? a.job[0] : a.job;
              return (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{a.full_name}</td>
                  <td className="px-4 py-3 text-slate-600">{job?.title ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{a.whatsapp_number}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(a.submitted_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.current_status as ApplicantStatus} /></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/pelamar/${a.id}`} className="text-brand hover:underline text-xs font-medium">
                      Detail →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${p === page ? "bg-brand text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] Run: `npm run typecheck && npm run build`
  Expected: no errors, builds successfully

- [ ] Commit:
```bash
git add src/app/admin/pelamar/page.tsx
git commit -m "feat: complete applicant list page with filters, search, and pagination"
```

---

## Task 12: Admin Export Page

**Files:**
- Modify: `src/app/admin/export/page.tsx`

- [ ] Update `src/app/admin/export/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { APPLICANT_STATUS_LABELS } from "@/lib/domain";
import type { ApplicantStatus } from "@/lib/domain";

const ALL_STATUSES: ApplicantStatus[] = ["new","screening","shortlisted","interview","accepted","rejected","talent_pool"];

export default function ExportPage() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleExport() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      const res = await fetch(`/api/export/applicants?${params}`);
      if (!res.ok) { alert("Gagal mengexport data"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pelamar-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Export Data Pelamar</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Filter Status (opsional)</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="">Semua Status</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{APPLICANT_STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {isLoading ? "Mengexport..." : "Export CSV"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] Commit:
```bash
git add src/app/admin/export/page.tsx
git commit -m "feat: complete CSV export page with status filter"
```

---

## Task 13: Admin Settings Page

**Files:**
- Modify: `src/app/admin/pengaturan/page.tsx`

- [ ] Update `src/app/admin/pengaturan/page.tsx`:

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PengaturanPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Pengaturan</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 grid gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
          <p className="mt-1 font-medium text-slate-900">{user.email}</p>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">User ID</label>
          <p className="mt-1 font-mono text-xs text-slate-600">{user.id}</p>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Terakhir Login</label>
          <p className="mt-1 text-sm text-slate-700">
            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("id-ID") : "-"}
          </p>
        </div>
        <hr className="border-slate-200" />
        <p className="text-sm text-slate-500">Untuk mengubah password, gunakan Supabase Auth dashboard atau minta reset melalui email.</p>
      </div>
    </div>
  );
}
```

- [ ] Run: `npm run typecheck && npm run build`
  Expected: no errors

- [ ] Commit:
```bash
git add src/app/admin/pengaturan/page.tsx
git commit -m "feat: complete admin settings page showing user info"
```

---

## Task 14: Final Verification

- [ ] Run full test suite:
```bash
npm test
```
Expected: all tests pass

- [ ] Run typecheck:
```bash
npm run typecheck
```
Expected: 0 errors

- [ ] Run lint:
```bash
npm run lint
```
Expected: 0 errors

- [ ] Run build:
```bash
npm run build
```
Expected: successful build, Next.js 15 standalone output

- [ ] Start dev server and verify key flows manually:
```bash
npm run dev
```

Manual checks:
1. `http://localhost:3000/` — home page loads
2. `http://localhost:3000/lowongan` — job list loads (sample data if no Supabase)
3. `http://localhost:3000/lowongan/[any-slug]/lamar` — form shows 3 steps, step navigation works
4. `http://localhost:3000/admin/login` — login form renders
5. `http://localhost:3000/admin` — redirects to login if not authenticated

- [ ] Final commit:
```bash
git add -A
git commit -m "feat: complete Phase 2 MVP implementation — full application form, admin CRUD, export, document download"
```

---

## Definition of Done

- [ ] Public site renders home, job list, job detail, form
- [ ] Application form submits to `/api/applications` with all fields
- [ ] Files uploaded to Supabase Storage private bucket
- [ ] Admin can log in via Supabase Auth
- [ ] Admin dashboard shows recruitment stats
- [ ] Admin can create/edit/publish/close jobs
- [ ] Admin can view applicant list with filters and search
- [ ] Admin can view full applicant detail
- [ ] Admin can update applicant status (history saved)
- [ ] Admin can add internal notes
- [ ] Admin can download documents via signed URL
- [ ] Admin can export CSV
- [ ] All tests pass, no typecheck errors, build succeeds
