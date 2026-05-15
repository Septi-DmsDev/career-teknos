import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { type ApplicantStatus, applicantStatuses } from "@/lib/domain";

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  // 1. Verify admin session
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Verify admin profile
  const adminClient = createAdminSupabaseClient();
  const { data: adminProfile, error: adminError } = await adminClient
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (adminError || !adminProfile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Read optional query params
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const jobIdParam = searchParams.get("job_id");

  // 4. Query applicants with job and department join
  let query = adminClient
    .from("applicants")
    .select(
      `
      id,
      full_name,
      email,
      whatsapp_number,
      domicile_address,
      last_education,
      institution_name,
      major,
      graduation_year,
      work_experience,
      skills,
      expected_salary,
      available_start_date,
      source_info,
      current_status,
      submitted_at,
      job_id,
      jobs (
        title,
        departments (
          name
        )
      )
    `
    )
    .order("submitted_at", { ascending: false });

  if (statusParam && (applicantStatuses as readonly string[]).includes(statusParam)) {
    query = query.eq("current_status", statusParam as ApplicantStatus);
  }
  if (jobIdParam) {
    query = query.eq("job_id", jobIdParam);
  }

  const { data: applicants, error: queryError } = await query;

  if (queryError) {
    return NextResponse.json(
      { error: "Gagal mengambil data pelamar" },
      { status: 500 }
    );
  }

  // 5. Build CSV
  const headers = [
    "Nama Lengkap",
    "Email",
    "WhatsApp",
    "Alamat",
    "Pendidikan",
    "Institusi",
    "Jurusan",
    "Tahun Lulus",
    "Pengalaman",
    "Skill",
    "Ekspektasi Gaji",
    "Siap Kerja",
    "Sumber Info",
    "Status",
    "Posisi",
    "Divisi",
    "Tanggal Lamar",
  ];

  const rows = (applicants ?? []).map((a) => {
    const job = Array.isArray(a.jobs) ? a.jobs[0] : a.jobs;
    const jobTitle = job?.title ?? null;
    const department = Array.isArray(job?.departments)
      ? job?.departments[0]
      : job?.departments;
    const departmentName = department?.name ?? null;

    return [
      escapeCSV(a.full_name),
      escapeCSV(a.email),
      escapeCSV(a.whatsapp_number),
      escapeCSV(a.domicile_address),
      escapeCSV(a.last_education),
      escapeCSV(a.institution_name),
      escapeCSV(a.major),
      escapeCSV(a.graduation_year),
      escapeCSV(a.work_experience),
      escapeCSV(a.skills),
      escapeCSV(a.expected_salary),
      escapeCSV(a.available_start_date),
      escapeCSV(a.source_info),
      escapeCSV(a.current_status),
      escapeCSV(jobTitle),
      escapeCSV(departmentName),
      escapeCSV(a.submitted_at),
    ].join(",");
  });

  const csv = [headers.map(escapeCSV).join(","), ...rows].join("\n");

  // 6. Return as downloadable CSV
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pelamar-teknos.csv"',
    },
  });
}
