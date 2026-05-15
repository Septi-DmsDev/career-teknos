create extension if not exists "pgcrypto";

create type public.job_status as enum ('draft', 'active', 'closed', 'archived');
create type public.applicant_status as enum (
  'new',
  'screening',
  'shortlisted',
  'interview',
  'accepted',
  'rejected',
  'talent_pool'
);
create type public.employment_type as enum (
  'full_time',
  'contract',
  'internship',
  'part_time'
);

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department_id uuid not null references public.departments(id),
  employment_type public.employment_type not null default 'full_time',
  location text not null,
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  status public.job_status not null default 'draft',
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  closed_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table public.applicants (
  id uuid primary key,
  job_id uuid not null references public.jobs(id),
  full_name text not null,
  birth_place text,
  birth_date date,
  gender text,
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
  expected_salary int,
  available_start_date date,
  source_info text,
  consent_data_usage boolean not null default true,
  current_status public.applicant_status not null default 'new',
  submitted_at timestamptz not null default now()
);

create unique index applicants_job_email_unique
  on public.applicants (job_id, lower(email));

create table public.applicant_documents (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default now()
);

create table public.applicant_notes (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  admin_id uuid not null references public.admin_profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table public.status_histories (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  from_status public.applicant_status,
  to_status public.applicant_status not null,
  admin_id uuid references public.admin_profiles(id),
  note text,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and is_active = true
  );
$$;

alter table public.admin_profiles enable row level security;
alter table public.departments enable row level security;
alter table public.jobs enable row level security;
alter table public.applicants enable row level security;
alter table public.applicant_documents enable row level security;
alter table public.applicant_notes enable row level security;
alter table public.status_histories enable row level security;
alter table public.activity_logs enable row level security;

create policy "public reads active departments"
  on public.departments for select
  using (is_active = true);

create policy "public reads active jobs"
  on public.jobs for select
  using (status = 'active');

create policy "admins manage departments"
  on public.departments for all
  using (public.is_active_admin())
  with check (public.is_active_admin());

create policy "admins manage jobs"
  on public.jobs for all
  using (public.is_active_admin())
  with check (public.is_active_admin());

create policy "admins read and update applicants"
  on public.applicants for all
  using (public.is_active_admin())
  with check (public.is_active_admin());

create policy "admins read applicant documents"
  on public.applicant_documents for select
  using (public.is_active_admin());

create policy "admins manage applicant notes"
  on public.applicant_notes for all
  using (public.is_active_admin())
  with check (public.is_active_admin());

create policy "admins manage status histories"
  on public.status_histories for all
  using (public.is_active_admin())
  with check (public.is_active_admin());

create policy "admins read and insert activity logs"
  on public.activity_logs for all
  using (public.is_active_admin())
  with check (public.is_active_admin());

create policy "admins read own profile"
  on public.admin_profiles for select
  using (id = auth.uid() and is_active = true);

insert into public.departments (code, name, slug, sort_order)
values
  ('warehouse',        'Gudang',           'gudang',           1),
  ('finishing',        'Finishing',        'finishing',        2),
  ('design',           'Desain',           'desain',           3),
  ('printing',         'Printing',         'printing',         4),
  ('customer-service', 'Customer Service', 'customer-service', 5),
  ('logistics-driver', 'Logistik / Driver','logistik-driver',  6),
  ('offset',           'Offset',           'offset',           7)
on conflict (code) do nothing;

-- Create private storage bucket manually or via Supabase dashboard:
-- insert into storage.buckets (id, name, public) values ('applicant-documents', 'applicant-documents', false);
