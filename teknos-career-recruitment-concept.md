# Konsep Proyek dan Spesifikasi Eksekusi: Teknos Career Recruitment System

**Versi:** 1.0  
**Tanggal:** 15 Mei 2026  
**Target domain:** `career.teknos.id`  
**Tech stack utama:** Next.js + Supabase  
**Output dokumen:** Konsep proyek, sitemap, struktur database, backlog MVP, dan prompt eksekusi untuk Codex  
**Disusun untuk:** Briefing development dan eksekusi implementasi oleh AI coding agent/Codex

---

## 1. Ringkasan Eksekutif

Teknos akan membangun website karir terpisah pada subdomain `career.teknos.id`. Website ini menjadi portal resmi recruitment perusahaan agar kandidat dapat melihat lowongan kerja yang tersedia, membaca detail posisi, lalu mengirim lamaran tanpa perlu membuat akun.

Setelah kandidat mengisi form lamaran dan mengunggah dokumen recruitment, data akan masuk ke dashboard admin HRD. Admin HRD dapat melihat daftar pelamar, memfilter berdasarkan posisi/divisi/status, membuka detail kandidat, mengunduh dokumen, memberi catatan internal, mengubah status seleksi, serta mengelola lowongan kerja.

Untuk versi awal, sistem hanya memiliki satu role admin, yaitu **Admin HRD**. Fitur email otomatis ke kandidat belum menjadi kebutuhan MVP, tetapi struktur sistem disiapkan agar fitur tersebut bisa ditambahkan di fase berikutnya.

---

## 2. Latar Belakang Masalah

### Kondisi saat ini

Proses recruitment yang berjalan secara manual melalui WhatsApp, email, Google Form, atau dokumen terpisah biasanya cukup untuk volume kecil. Namun ketika pelamar bertambah, HRD akan kesulitan mengelola data kandidat secara konsisten.

### Masalah utama

- Data kandidat tersebar di banyak tempat.
- HRD sulit melakukan filter berdasarkan posisi, divisi, dan status.
- Dokumen kandidat tidak tersimpan dalam sistem recruitment yang rapi.
- Tidak ada halaman karir resmi yang dapat menjadi kanal recruitment terpusat.
- Proses tracking status kandidat belum terdokumentasi dengan baik.

### Solusi yang ditawarkan

Membangun website karir dan dashboard recruitment yang terpusat, ringan, aman, dan mudah dikembangkan. Kandidat tidak perlu login, sementara HRD memiliki dashboard internal untuk mengelola seluruh proses lamaran.

---

## 3. Tujuan dan Outcome

| Jenis | Penjelasan |
|---|---|
| Tujuan bisnis | Membuat kanal recruitment resmi Teknos yang profesional dan terpusat. |
| Tujuan kandidat | Kandidat dapat melihat lowongan dan mengirim lamaran dengan mudah tanpa login. |
| Tujuan HRD | HRD dapat mengelola lowongan, data pelamar, status seleksi, dan dokumen kandidat dari satu dashboard. |
| Outcome MVP | Sistem dapat menerima lamaran, menyimpan data kandidat, menampilkan data ke dashboard admin, dan mengelola lowongan. |
| Indikator keberhasilan | Kandidat berhasil submit lamaran, data muncul di dashboard, admin dapat update status, dan lowongan bisa dikelola dari admin panel. |

---

## 4. Target Pengguna dan Aktor

| Aktor | Deskripsi | Kebutuhan Utama | Hak Akses |
|---|---|---|---|
| Kandidat / Pelamar | Orang yang ingin melamar kerja ke Teknos | Melihat lowongan dan mengirim lamaran | Publik, tanpa login |
| Admin HRD | Tim HRD yang mengelola recruitment | Mengelola lowongan dan proses kandidat | Login admin |
| Management / User Department | Pihak internal yang mungkin membutuhkan data kandidat | Melihat kandidat yang sudah disaring HRD | Di luar MVP |

---

## 5. Scope Proyek

### 5.1 Termasuk dalam MVP

- Website publik `career.teknos.id`.
- Halaman home karir.
- Halaman daftar lowongan.
- Halaman detail lowongan.
- Form lamaran kandidat tanpa login.
- Upload dokumen recruitment standar.
- Halaman sukses setelah submit lamaran.
- Login admin HRD.
- Dashboard ringkasan recruitment.
- CRUD lowongan kerja.
- Daftar pelamar.
- Detail data pelamar.
- Download dokumen kandidat.
- Catatan internal HRD.
- Update status recruitment.
- Filter dan pencarian pelamar.
- Export data pelamar ke CSV.
- Basic audit log untuk aktivitas admin penting.

### 5.2 Di luar MVP untuk saat ini

- Akun kandidat.
- Kandidat tracking status lamaran.
- Multi-role admin.
- Approval manager.
- Notifikasi email otomatis.
- Notifikasi WhatsApp.
- Integrasi psikotes.
- Jadwal interview otomatis.
- Integrasi payroll/HRIS.
- Public API recruitment.

### 5.3 Asumsi

- Role admin hanya satu: Admin HRD.
- Kandidat dapat submit lamaran tanpa login.
- Kandidat boleh melamar lebih dari satu posisi, tetapi sistem perlu mencegah spam submit berulang untuk posisi yang sama dengan kombinasi email + job_id.
- Dokumen kandidat disimpan di Supabase Storage private bucket.
- Email otomatis akan ditambahkan di fase enhancement.

---

## 6. Divisi dan Kategori Lowongan

Divisi awal yang tersedia:

| Kode | Nama Divisi | Contoh Posisi |
|---|---|---|
| warehouse | Gudang | Staff Gudang, Checker, Packing |
| finishing | Finishing | Operator Finishing, Staff Produksi Finishing |
| design | Desain | Desainer Grafis, Prepress Designer |
| printing | Printing | Operator Printing, Staff Produksi |
| customer-service | Customer Service | CS Online, CS Counter |
| logistics-driver | Logistik / Driver | Driver, Kurir, Staff Delivery |
| offset | Offset | Operator Offset, Helper Offset |

---

## 7. Tech Stack Rekomendasi

### 7.1 Frontend dan Backend

| Komponen | Rekomendasi | Catatan |
|---|---|---|
| Framework | Next.js App Router | Cocok untuk website publik dan dashboard admin dalam satu codebase. |
| Bahasa | TypeScript | Wajib untuk maintainability. |
| Styling | Tailwind CSS | Cepat untuk layout dan dashboard. |
| UI Component | shadcn/ui | Cocok untuk table, form, dialog, dropdown, toast. |
| Form handling | React Hook Form | Untuk validasi form kandidat dan admin. |
| Validation | Zod | Shared validation schema frontend dan server. |
| Database | Supabase PostgreSQL | Database utama recruitment. |
| Auth | Supabase Auth | Login admin HRD. |
| Storage | Supabase Storage | Menyimpan CV, KTP, ijazah, pas foto, portofolio. |
| Server write | Next.js Server Actions / Route Handlers | Untuk submit lamaran dengan service role secara aman. |
| Export | CSV generation dari server | MVP cukup CSV, Excel bisa enhancement. |
| Deployment | Vercel / server Node.js compatible | Sesuaikan infrastruktur Teknos. |

### 7.2 Prinsip arsitektur

- Public website dan admin dashboard berada dalam satu project Next.js.
- Public page boleh membaca lowongan aktif menggunakan Supabase anon key dengan RLS terbatas.
- Submit lamaran kandidat sebaiknya melalui server action atau route handler, bukan langsung insert dari browser.
- Service role key hanya berada di server environment, tidak boleh terekspos ke client.
- Dokumen kandidat disimpan di private bucket dan diakses admin melalui signed URL atau server download endpoint.
- Semua validasi penting harus dilakukan di server.

---

## 8. Sitemap

### 8.1 Sitemap Publik

```text
career.teknos.id
/
├── /                         Home Karir
├── /lowongan                 Daftar Lowongan Aktif
├── /lowongan/[slug]          Detail Lowongan
├── /lowongan/[slug]/lamar    Form Lamaran
├── /lamaran/berhasil         Halaman Sukses Submit
└── /privacy                  Kebijakan Privasi Data Kandidat
```

### 8.2 Sitemap Admin

```text
career.teknos.id/admin
/admin/login                  Login Admin HRD
/admin                        Redirect ke /admin/dashboard
/admin/dashboard              Ringkasan recruitment
/admin/lowongan               Daftar lowongan
/admin/lowongan/tambah        Tambah lowongan
/admin/lowongan/[id]          Detail lowongan
/admin/lowongan/[id]/edit     Edit lowongan
/admin/pelamar                Daftar pelamar
/admin/pelamar/[id]           Detail pelamar
/admin/export                 Export data pelamar
/admin/pengaturan             Pengaturan admin sederhana
```

### 8.3 Navigasi Publik

| Menu | Tujuan |
|---|---|
| Beranda | Masuk ke halaman utama karir |
| Lowongan | Melihat semua lowongan aktif |
| Tentang Teknos | Ringkasan singkat perusahaan/budaya kerja |
| Lamar Sekarang | CTA menuju daftar lowongan atau form lowongan tertentu |

### 8.4 Navigasi Admin

| Menu | Tujuan |
|---|---|
| Dashboard | Melihat statistik cepat recruitment |
| Lowongan | Mengelola lowongan kerja |
| Pelamar | Mengelola kandidat masuk |
| Export | Mengunduh data pelamar |
| Pengaturan | Akun admin dan konfigurasi sederhana |

---

## 9. Struktur Halaman dan Konten

### 9.1 Home Karir `/`

Konten utama:

- Hero section: headline karir Teknos.
- CTA: Lihat Lowongan.
- Ringkasan singkat kenapa bekerja di Teknos.
- Highlight divisi: Gudang, Finishing, Desain, Printing, CS, Logistik/Driver, Offset.
- Preview lowongan terbaru.
- CTA akhir: Temukan posisi yang cocok.

Acceptance criteria:

- Pengunjung dapat melihat lowongan aktif terbaru.
- Tombol CTA mengarah ke `/lowongan`.
- Tampilan responsive mobile.

### 9.2 Daftar Lowongan `/lowongan`

Fitur:

- List lowongan aktif.
- Filter divisi.
- Search judul posisi.
- Badge tipe pekerjaan dan lokasi.
- Empty state jika tidak ada lowongan.

Acceptance criteria:

- Hanya lowongan aktif yang tampil.
- Filter divisi bekerja.
- Search bekerja minimal berdasarkan judul posisi.
- Klik kartu lowongan membuka detail lowongan.

### 9.3 Detail Lowongan `/lowongan/[slug]`

Konten:

- Judul posisi.
- Divisi.
- Lokasi.
- Tipe pekerjaan.
- Deskripsi pekerjaan.
- Kualifikasi.
- Benefit jika ada.
- Batas lamaran jika ada.
- CTA Lamar Sekarang.

Acceptance criteria:

- Lowongan nonaktif tidak tampil di publik.
- Tombol Lamar Sekarang menuju `/lowongan/[slug]/lamar`.
- Metadata SEO dasar tersedia.

### 9.4 Form Lamaran `/lowongan/[slug]/lamar`

Field minimal:

- Nama lengkap.
- Tempat lahir.
- Tanggal lahir.
- Jenis kelamin.
- Email.
- Nomor WhatsApp.
- Nomor alternatif.
- Alamat domisili.
- Pendidikan terakhir.
- Nama institusi.
- Jurusan.
- Tahun lulus.
- Pengalaman kerja ringkas.
- Skill utama.
- Ekspektasi gaji.
- Tanggal siap kerja.
- Sumber informasi lowongan.
- Upload CV.
- Upload KTP.
- Upload ijazah.
- Upload transkrip.
- Upload pas foto.
- Upload portofolio jika relevan.
- Checkbox persetujuan penggunaan data.

Acceptance criteria:

- Kandidat tidak perlu login.
- Field wajib divalidasi.
- Email harus valid.
- Nomor WhatsApp wajib diisi.
- CV wajib di-upload.
- File dibatasi tipe dan ukuran.
- Setelah submit berhasil, kandidat diarahkan ke halaman sukses.
- Jika gagal, tampil pesan error yang jelas.

### 9.5 Dashboard Admin `/admin/dashboard`

Widget:

- Total pelamar.
- Pelamar baru.
- Screening.
- Shortlisted.
- Interview.
- Diterima.
- Ditolak.
- Lowongan aktif.
- Pelamar terbaru.

Acceptance criteria:

- Halaman hanya bisa diakses admin login.
- Statistik sesuai data database.
- Ada link cepat ke daftar pelamar dan lowongan.

### 9.6 Manajemen Lowongan `/admin/lowongan`

Fitur:

- Tabel lowongan.
- Search lowongan.
- Filter status aktif/nonaktif/draft.
- Tambah lowongan.
- Edit lowongan.
- Publish/unpublish lowongan.

Acceptance criteria:

- Admin dapat membuat lowongan baru.
- Admin dapat mengubah status lowongan.
- Slug lowongan unik.
- Lowongan nonaktif tidak muncul di public page.

### 9.7 Daftar Pelamar `/admin/pelamar`

Fitur:

- Tabel pelamar.
- Filter posisi.
- Filter divisi.
- Filter status.
- Search nama/email/WhatsApp.
- Sort terbaru/terlama.
- Link ke detail pelamar.

Acceptance criteria:

- Hanya admin login yang bisa akses.
- Filter dan search berjalan.
- Setiap baris menampilkan nama, posisi, divisi, tanggal submit, dan status.

### 9.8 Detail Pelamar `/admin/pelamar/[id]`

Fitur:

- Data lengkap kandidat.
- Dokumen kandidat dengan tombol download/view.
- Status recruitment.
- Update status.
- Catatan HRD.
- Riwayat status.
- Riwayat aktivitas sederhana.

Acceptance criteria:

- Admin dapat mengubah status kandidat.
- Perubahan status masuk ke status history.
- Admin dapat menambah catatan internal.
- Dokumen hanya bisa diakses admin.

---

## 10. User Flow

### 10.1 Flow Kandidat Melamar

```text
Kandidat membuka career.teknos.id
-> melihat halaman karir
-> klik menu Lowongan
-> memilih divisi atau mencari posisi
-> membuka detail lowongan
-> klik Lamar Sekarang
-> mengisi form data diri
-> upload dokumen recruitment
-> centang persetujuan penggunaan data
-> submit lamaran
-> sistem validasi data dan file
-> data disimpan ke database
-> dokumen disimpan ke private storage
-> kandidat melihat halaman sukses
-> data muncul di dashboard HRD
```

### 10.2 Flow Admin Mengelola Lowongan

```text
Admin membuka /admin/login
-> login menggunakan Supabase Auth
-> masuk dashboard
-> membuka menu Lowongan
-> klik Tambah Lowongan
-> mengisi detail posisi
-> simpan sebagai draft atau publish
-> lowongan aktif tampil di public site
```

### 10.3 Flow Admin Memproses Kandidat

```text
Admin login
-> buka menu Pelamar
-> filter berdasarkan divisi/posisi/status
-> buka detail kandidat
-> cek data dan dokumen
-> beri catatan internal
-> ubah status recruitment
-> status history tersimpan
```

---

## 11. Status Recruitment

| Status | Kode | Deskripsi |
|---|---|---|
| Baru | new | Lamaran baru masuk dan belum dicek. |
| Screening | screening | HRD sedang meninjau data kandidat. |
| Shortlisted | shortlisted | Kandidat masuk daftar prioritas. |
| Interview | interview | Kandidat diproses/dijadwalkan interview secara manual. |
| Diterima | accepted | Kandidat diterima. |
| Ditolak | rejected | Kandidat tidak lanjut. |
| Talent Pool | talent_pool | Kandidat potensial untuk kebutuhan berikutnya. |

---

## 12. Struktur Database Supabase PostgreSQL

### 12.1 Ringkasan tabel

| Tabel | Fungsi |
|---|---|
| admin_profiles | Profil admin yang terhubung dengan Supabase Auth. |
| departments | Master divisi lowongan. |
| jobs | Data lowongan kerja. |
| applicants | Data utama kandidat/pelamar. |
| applicant_documents | Metadata dokumen kandidat di Supabase Storage. |
| applicant_notes | Catatan internal HRD. |
| status_histories | Riwayat perubahan status kandidat. |
| activity_logs | Audit log aktivitas admin penting. |

### 12.2 SQL schema awal

```sql
-- Enable extensions
create extension if not exists "pgcrypto";

-- 1. Admin profiles
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Departments
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Jobs
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id),
  title text not null,
  slug text not null unique,
  employment_type text not null default 'full_time'
    check (employment_type in ('full_time', 'contract', 'internship', 'freelance')),
  location text not null,
  description text not null,
  responsibilities text,
  requirements text not null,
  benefits text,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'closed', 'archived')),
  published_at timestamptz,
  closed_at timestamptz,
  application_deadline date,
  created_by uuid references public.admin_profiles(id),
  updated_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_jobs_department_id on public.jobs(department_id);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_slug on public.jobs(slug);

-- 4. Applicants
create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id),
  full_name text not null,
  birth_place text,
  birth_date date,
  gender text check (gender in ('male', 'female')),
  email text not null,
  whatsapp_number text not null,
  alternative_phone text,
  domicile_address text not null,
  last_education text not null,
  institution_name text,
  major text,
  graduation_year int,
  work_experience text,
  skills text,
  expected_salary numeric(14,2),
  available_start_date date,
  source_info text,
  consent_data_usage boolean not null default false,
  current_status text not null default 'new'
    check (current_status in ('new', 'screening', 'shortlisted', 'interview', 'accepted', 'rejected', 'talent_pool')),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applicants_consent_required check (consent_data_usage = true)
);

create index if not exists idx_applicants_job_id on public.applicants(job_id);
create index if not exists idx_applicants_status on public.applicants(current_status);
create index if not exists idx_applicants_email on public.applicants(email);
create index if not exists idx_applicants_submitted_at on public.applicants(submitted_at desc);

-- Optional anti-duplicate soft rule for MVP.
-- Allows one active application per email per job.
create unique index if not exists uq_applicants_job_email
on public.applicants(job_id, lower(email));

-- 5. Applicant documents
create table if not exists public.applicant_documents (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  document_type text not null
    check (document_type in ('cv', 'ktp', 'ijazah', 'transkrip', 'pas_foto', 'portfolio', 'other')),
  file_name text not null,
  file_path text not null,
  mime_type text,
  file_size bigint,
  uploaded_at timestamptz not null default now()
);

create index if not exists idx_applicant_documents_applicant_id on public.applicant_documents(applicant_id);
create index if not exists idx_applicant_documents_type on public.applicant_documents(document_type);

-- 6. Applicant notes
create table if not exists public.applicant_notes (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  admin_id uuid references public.admin_profiles(id),
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_applicant_notes_applicant_id on public.applicant_notes(applicant_id);

-- 7. Status histories
create table if not exists public.status_histories (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references public.admin_profiles(id),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_status_histories_applicant_id on public.status_histories(applicant_id);
create index if not exists idx_status_histories_created_at on public.status_histories(created_at desc);

-- 8. Activity logs
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_admin_id on public.activity_logs(admin_id);
create index if not exists idx_activity_logs_entity on public.activity_logs(entity_type, entity_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);
```

### 12.3 Seed data divisi

```sql
insert into public.departments (name, slug, sort_order) values
('Gudang', 'warehouse', 1),
('Finishing', 'finishing', 2),
('Desain', 'design', 3),
('Printing', 'printing', 4),
('Customer Service', 'customer-service', 5),
('Logistik / Driver', 'logistics-driver', 6),
('Offset', 'offset', 7)
on conflict (slug) do nothing;
```

---

## 13. RLS dan Security Model

### 13.1 Prinsip RLS

- Public user hanya boleh membaca lowongan aktif.
- Public user tidak langsung insert ke `applicants` dari browser.
- Submit lamaran dilakukan melalui Next.js server action/route handler dengan service role.
- Admin login melalui Supabase Auth.
- Admin yang aktif dapat mengakses data dashboard.
- Storage dokumen kandidat bersifat private.

### 13.2 Helper function admin aktif

```sql
create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.is_active = true
  );
$$;
```

### 13.3 Enable RLS

```sql
alter table public.admin_profiles enable row level security;
alter table public.departments enable row level security;
alter table public.jobs enable row level security;
alter table public.applicants enable row level security;
alter table public.applicant_documents enable row level security;
alter table public.applicant_notes enable row level security;
alter table public.status_histories enable row level security;
alter table public.activity_logs enable row level security;
```

### 13.4 Policies awal

```sql
-- Admin profiles
create policy "Admin can read own profile"
on public.admin_profiles
for select
to authenticated
using (id = auth.uid());

-- Departments public read active
create policy "Public can read active departments"
on public.departments
for select
to anon, authenticated
using (is_active = true);

create policy "Admin can manage departments"
on public.departments
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

-- Jobs public read active
create policy "Public can read active jobs"
on public.jobs
for select
to anon, authenticated
using (status = 'active');

create policy "Admin can manage jobs"
on public.jobs
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

-- Applicants admin only via authenticated dashboard.
-- Public applicant insert should use server-side service role, so no anon insert policy is needed.
create policy "Admin can read applicants"
on public.applicants
for select
to authenticated
using (public.is_active_admin());

create policy "Admin can update applicants"
on public.applicants
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

-- Applicant documents admin only
create policy "Admin can read applicant documents"
on public.applicant_documents
for select
to authenticated
using (public.is_active_admin());

-- Notes admin only
create policy "Admin can manage applicant notes"
on public.applicant_notes
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

-- Status histories admin only
create policy "Admin can manage status histories"
on public.status_histories
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

-- Activity logs admin read/insert
create policy "Admin can read activity logs"
on public.activity_logs
for select
to authenticated
using (public.is_active_admin());

create policy "Admin can insert activity logs"
on public.activity_logs
for insert
to authenticated
with check (public.is_active_admin());
```

Catatan implementasi:

- Insert ke `applicants` dan `applicant_documents` untuk kandidat dilakukan dari server menggunakan `SUPABASE_SERVICE_ROLE_KEY`.
- Jangan pernah expose service role key ke browser.
- Jika ingin kandidat insert langsung dari browser, perlu kebijakan RLS tambahan yang sangat hati-hati. Untuk MVP ini tidak disarankan.

---

## 14. Supabase Storage

### 14.1 Bucket

| Bucket | Public | Fungsi |
|---|---|---|
| applicant-documents | false | Menyimpan dokumen kandidat. |
| job-assets | true/false opsional | Gambar pendukung lowongan jika dibutuhkan nanti. |

### 14.2 Struktur path dokumen

```text
applicant-documents/
└── applicants/
    └── {applicant_id}/
        ├── cv/{timestamp}-{filename}
        ├── ktp/{timestamp}-{filename}
        ├── ijazah/{timestamp}-{filename}
        ├── transkrip/{timestamp}-{filename}
        ├── pas_foto/{timestamp}-{filename}
        └── portfolio/{timestamp}-{filename}
```

### 14.3 Aturan file

| Dokumen | Wajib MVP | Format | Ukuran maksimum rekomendasi |
|---|---:|---|---:|
| CV | Ya | PDF/DOC/DOCX | 5 MB |
| KTP | Ya/opsional, perlu keputusan HRD | JPG/PNG/PDF | 5 MB |
| Ijazah | Ya/opsional, perlu keputusan HRD | JPG/PNG/PDF | 5 MB |
| Transkrip | Opsional | JPG/PNG/PDF | 5 MB |
| Pas Foto | Opsional | JPG/PNG | 2 MB |
| Portofolio | Opsional, relevan untuk desain | PDF/link/file | 10 MB |

Rekomendasi MVP: CV wajib, dokumen lain dibuat opsional dahulu agar friction kandidat tidak terlalu tinggi. Jika HRD ingin standar lengkap sejak awal, KTP dan ijazah dapat dibuat wajib.

---

## 15. Rekomendasi Struktur Project Next.js

```text
teknos-career/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── lowongan/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── lamar/page.tsx
│   │   ├── lamaran/berhasil/page.tsx
│   │   └── privacy/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
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
│   │   ├── applications/route.ts
│   │   ├── documents/[id]/download/route.ts
│   │   └── export/applicants/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── public/
│   ├── admin/
│   ├── forms/
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── validations/
│   │   ├── application.ts
│   │   └── job.ts
│   ├── services/
│   │   ├── jobs.ts
│   │   ├── applicants.ts
│   │   ├── documents.ts
│   │   └── audit.ts
│   └── utils.ts
├── middleware.ts
├── types/
│   └── database.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
├── package.json
└── README.md
```

---

## 16. Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://career.teknos.id
MAX_UPLOAD_MB=5
```

Catatan:

- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` boleh dipakai di client.
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh dipakai di server.
- Jangan commit file `.env.local`.

---

## 17. Data Validation Rules

### 17.1 Form lamaran

| Field | Rule |
|---|---|
| full_name | Required, min 3 karakter |
| email | Required, valid email |
| whatsapp_number | Required, hanya angka/plus/spasi, min 8 karakter |
| domicile_address | Required |
| last_education | Required |
| consent_data_usage | Required true |
| cv | Required, max 5 MB, PDF/DOC/DOCX |
| ktp | Optional atau required sesuai keputusan HRD |
| ijazah | Optional atau required sesuai keputusan HRD |
| portfolio | Optional, disarankan untuk divisi Desain |

### 17.2 Form lowongan

| Field | Rule |
|---|---|
| title | Required |
| slug | Required, unique, lowercase kebab-case |
| department_id | Required |
| employment_type | Required |
| location | Required |
| description | Required |
| requirements | Required |
| status | draft/active/closed/archived |

---

## 18. Backlog MVP

### P0 - Wajib MVP

| ID | Fitur | Acceptance Criteria |
|---|---|---|
| P0-01 | Setup project Next.js TypeScript | Project berjalan lokal, Tailwind aktif, struktur folder siap. |
| P0-02 | Setup Supabase client/server/admin | Client anon dan server service role dipisahkan. |
| P0-03 | Migration database | Semua tabel utama berhasil dibuat. |
| P0-04 | Seed departments | Divisi awal tersedia di database. |
| P0-05 | Public list jobs | Lowongan aktif tampil di `/lowongan`. |
| P0-06 | Public job detail | Detail lowongan tampil berdasarkan slug. |
| P0-07 | Application form | Kandidat bisa mengisi dan submit lamaran. |
| P0-08 | File upload | CV dan dokumen lain tersimpan di private bucket. |
| P0-09 | Admin login | Admin dapat login dan logout. |
| P0-10 | Protected admin routes | `/admin/*` tidak dapat diakses tanpa login. |
| P0-11 | Admin dashboard | Statistik recruitment tampil. |
| P0-12 | CRUD jobs | Admin dapat tambah, edit, publish, close lowongan. |
| P0-13 | Applicant list | Admin dapat melihat dan memfilter pelamar. |
| P0-14 | Applicant detail | Admin dapat melihat detail dan dokumen kandidat. |
| P0-15 | Update applicant status | Status berubah dan history tersimpan. |
| P0-16 | Admin notes | Admin dapat menambah catatan internal. |
| P0-17 | CSV export | Admin dapat export daftar pelamar. |

### P1 - Penting setelah MVP

| ID | Fitur | Catatan |
|---|---|---|
| P1-01 | Email konfirmasi submit | Kirim email ke kandidat setelah lamaran masuk. |
| P1-02 | Email update status | Kirim email ketika status tertentu berubah. |
| P1-03 | Advanced filter | Filter tanggal submit, pendidikan, pengalaman. |
| P1-04 | Better audit log UI | Tampilkan riwayat aktivitas admin lebih lengkap. |
| P1-05 | Talent pool view | Tampilan khusus kandidat talent pool. |

### P2 - Nice to have

| ID | Fitur | Catatan |
|---|---|---|
| P2-01 | Jadwal interview | Jadwal manual dari dashboard. |
| P2-02 | Multi-role admin | Super admin, HR staff, interviewer. |
| P2-03 | Kandidat tracking | Kandidat cek status lamaran dengan token/email. |
| P2-04 | WhatsApp notification | Integrasi provider WhatsApp. |
| P2-05 | Analytics recruitment | Conversion rate lowongan dan sumber kandidat. |

---

## 19. Roadmap Development

| Fase | Fokus | Deliverable |
|---|---|---|
| Fase 1 | Setup dasar | Next.js project, Supabase project, env, database migration, seed divisi. |
| Fase 2 | Public website | Home karir, daftar lowongan, detail lowongan. |
| Fase 3 | Lamaran kandidat | Form lamaran, upload dokumen, validasi, success page. |
| Fase 4 | Admin foundation | Auth, protected routes, admin layout, dashboard. |
| Fase 5 | Admin recruitment | CRUD lowongan, list pelamar, detail pelamar, status, notes. |
| Fase 6 | Export dan hardening | CSV export, RLS review, storage security, audit log. |
| Fase 7 | Enhancement | Email notification, talent pool, jadwal interview. |

---

## 20. Edge Cases yang Harus Ditangani

| Area | Edge Case | Penanganan |
|---|---|---|
| Form lamaran | Field wajib kosong | Tampilkan validasi per field. |
| File upload | File terlalu besar | Tolak upload dengan pesan ukuran maksimum. |
| File upload | Format tidak didukung | Tolak upload dengan pesan format valid. |
| Submit | Email sama melamar posisi sama | Tampilkan pesan bahwa lamaran sudah pernah dikirim. |
| Submit | Upload berhasil tapi database gagal | Hapus file yang sudah terupload atau tandai cleanup. |
| Public jobs | Lowongan sudah closed | Redirect ke daftar lowongan atau tampil status closed. |
| Admin | Belum login | Redirect ke `/admin/login`. |
| Admin | Status berubah | Simpan history perubahan. |
| Storage | Admin download file | Generate signed URL dari server. |

---

## 21. Keputusan yang Masih Perlu Dibuat

1. Apakah KTP dan ijazah wajib sejak MVP, atau opsional dulu?
2. Apakah kandidat boleh melamar lebih dari satu posisi? Rekomendasi: boleh, tetapi tidak boleh duplikat untuk posisi yang sama.
3. Batas maksimal ukuran file final: 5 MB per dokumen atau berbeda per jenis dokumen?
4. Apakah perlu retensi data kandidat, misalnya data otomatis diarsipkan/dihapus setelah 12 bulan?
5. Apakah desain visual harus mengikuti website utama Teknos secara penuh atau dibuat lebih modern khusus karir?
6. Apakah `career.teknos.id` akan dideploy di Vercel, VPS, atau hosting internal?

---

## 22. Rekomendasi Implementasi Detail untuk Codex

### 22.1 Urutan eksekusi yang disarankan

1. Buat project Next.js App Router dengan TypeScript dan Tailwind.
2. Install shadcn/ui, Supabase client, Zod, React Hook Form.
3. Buat file `.env.example`.
4. Buat Supabase migration sesuai SQL schema di dokumen ini.
5. Buat Supabase client files:
   - `lib/supabase/client.ts`
   - `lib/supabase/server.ts`
   - `lib/supabase/admin.ts`
6. Implement public pages:
   - `/`
   - `/lowongan`
   - `/lowongan/[slug]`
   - `/lowongan/[slug]/lamar`
   - `/lamaran/berhasil`
7. Implement route handler submit application:
   - `app/api/applications/route.ts`
8. Implement admin auth dan middleware protection.
9. Implement admin dashboard.
10. Implement CRUD lowongan.
11. Implement daftar dan detail pelamar.
12. Implement status update, notes, dan status history.
13. Implement private document download endpoint.
14. Implement CSV export.
15. Review RLS, environment, dan security.

### 22.2 Coding convention

- Gunakan TypeScript ketat.
- Pisahkan query database ke `lib/services`.
- Gunakan Zod untuk semua input validation.
- Jangan menulis query Supabase langsung di banyak komponen UI.
- Public components dan admin components dipisah.
- Gunakan server components untuk data fetching jika memungkinkan.
- Gunakan client components hanya untuk form interaktif, filter, dialog, dan upload.
- Semua error server harus dikembalikan dalam format aman, jangan expose stack trace.

### 22.3 Definition of Done MVP

MVP dianggap selesai jika:

- Website publik dapat menampilkan lowongan aktif.
- Kandidat dapat submit lamaran tanpa login.
- CV dan dokumen kandidat tersimpan di Supabase Storage private bucket.
- Data kandidat tersimpan di database.
- Admin dapat login.
- Admin dapat melihat dashboard, lowongan, dan pelamar.
- Admin dapat mengubah status kandidat.
- Admin dapat menambah catatan internal.
- Admin dapat mengunduh dokumen kandidat.
- Admin dapat export data pelamar.
- RLS aktif dan public tidak bisa mengakses data kandidat.

---

## 23. Prompt Eksekusi untuk Codex

Gunakan prompt ini untuk memulai eksekusi di Codex:

```text
Kamu adalah senior full-stack engineer yang akan membangun MVP website karir dan recruitment HRD Teknos menggunakan Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase PostgreSQL, Supabase Auth, dan Supabase Storage.

Konteks proyek:
Teknos ingin membuat website karir pada subdomain career.teknos.id. Kandidat dapat melihat daftar lowongan, membuka detail lowongan, lalu mengirim lamaran tanpa login. Data kandidat dan dokumen recruitment harus masuk ke dashboard admin HRD. Admin HRD adalah satu-satunya role di MVP. Admin dapat login, mengelola lowongan, melihat pelamar, membuka detail kandidat, mengunduh dokumen, memberi catatan internal, mengubah status recruitment, dan export data pelamar.

Divisi awal:
Gudang, Finishing, Desain, Printing, Customer Service, Logistik/Driver, dan Offset.

Modul MVP:
1. Public home karir.
2. Daftar lowongan aktif.
3. Detail lowongan.
4. Form lamaran tanpa login.
5. Upload dokumen kandidat ke Supabase Storage private bucket.
6. Admin login dengan Supabase Auth.
7. Protected admin dashboard.
8. CRUD lowongan.
9. List dan detail pelamar.
10. Update status kandidat.
11. Catatan internal HRD.
12. Status history.
13. CSV export.
14. Basic audit log.

Batasan penting:
- Jangan expose SUPABASE_SERVICE_ROLE_KEY ke client.
- Submit lamaran harus lewat server action atau route handler.
- Public user hanya boleh membaca lowongan aktif.
- Data kandidat dan dokumen kandidat hanya boleh diakses admin login.
- Gunakan Zod untuk validasi input.
- Gunakan struktur folder yang rapi sesuai dokumen spesifikasi.
- Buat migration SQL Supabase berdasarkan schema yang tersedia di dokumen ini.
- Implementasi harus production-minded, aman, dan mudah dikembangkan.

Tugas awal:
1. Setup project structure.
2. Buat migration database dan seed divisi.
3. Buat Supabase client/server/admin helper.
4. Implement halaman public lowongan.
5. Implement form lamaran dan upload dokumen.
6. Implement admin login dan protected dashboard.

Berikan perubahan kode secara bertahap, jelaskan file yang dibuat/diubah, dan pastikan setiap tahap bisa dijalankan sebelum melanjutkan tahap berikutnya.
```

---

## 24. Catatan Final

Dokumen ini disusun sebagai dasar konsep dan spesifikasi awal. Untuk implementasi nyata, bagian yang paling perlu dikonfirmasi sebelum development penuh adalah kebijakan dokumen wajib, batas ukuran file, retensi data kandidat, dan lokasi deployment.

Rekomendasi MVP tetap dibuat sederhana: fokus pada public lowongan, submit lamaran, dashboard HRD, dan keamanan data kandidat.
