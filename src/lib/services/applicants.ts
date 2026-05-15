import { sampleApplicants } from "@/lib/data/sample";
import type { ApplicantStatus, ApplicantSummary } from "@/lib/domain";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ApplicantFilters {
  search?: string;
  status?: ApplicantStatus;
  jobId?: string;
  page?: number;
  limit?: number;
}

export async function getApplicants(
  filters: ApplicantFilters = {},
): Promise<{ data: ApplicantSummary[]; count: number }> {
  if (!hasSupabasePublicEnv()) {
    let data = sampleApplicants;

    if (filters.status) {
      data = data.filter((a) => a.status === filters.status);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(
        (a) =>
          a.fullName.toLowerCase().includes(search) ||
          a.email.toLowerCase().includes(search) ||
          a.whatsapp.toLowerCase().includes(search),
      );
    }

    const count = data.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const start = (page - 1) * limit;
    data = data.slice(start, start + limit);

    return { data, count };
  }

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("applicants")
    .select(
      "id,full_name,email,whatsapp_number,current_status,submitted_at,jobs(id,title,departments(id,name))",
      { count: "exact" },
    );

  if (filters.status) {
    query = query.eq("current_status", filters.status);
  }

  if (filters.jobId) {
    query = query.eq("job_id", filters.jobId);
  }

  if (filters.search) {
    const search = `%${filters.search}%`;
    query = query.or(
      `full_name.ilike.${search},email.ilike.${search},whatsapp_number.ilike.${search}`,
    );
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query
    .order("submitted_at", { ascending: false })
    .range(start, start + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) {
    return { data: sampleApplicants, count: sampleApplicants.length };
  }

  const mapped: ApplicantSummary[] = data.map((row) => {
    const job = Array.isArray(row.jobs) ? row.jobs[0] : row.jobs;
    const department = job
      ? Array.isArray(job.departments)
        ? job.departments[0]
        : job.departments
      : null;

    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      whatsapp: row.whatsapp_number,
      jobTitle: job?.title ?? "",
      departmentName: department?.name ?? "",
      status: row.current_status,
      submittedAt: row.submitted_at,
    };
  });

  return { data: mapped, count: count ?? 0 };
}

export async function getApplicantById(id: string) {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("applicants")
    .select(
      "*, jobs(id,title,slug,departments(id,name)), applicant_documents(*), applicant_notes(*, admin_profiles(full_name)), status_histories(*)",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getRecentApplicants(limit = 10): Promise<ApplicantSummary[]> {
  if (!hasSupabasePublicEnv()) {
    return sampleApplicants.slice(0, limit);
  }

  const { data } = await getApplicants({ limit });
  return data;
}

export async function getApplicantStats() {
  if (!hasSupabasePublicEnv()) {
    const statusCounts = sampleApplicants.reduce<Record<ApplicantStatus, number>>(
      (accumulator, applicant) => {
        accumulator[applicant.status] += 1;
        return accumulator;
      },
      {
        new: 0,
        screening: 0,
        shortlisted: 0,
        interview: 0,
        accepted: 0,
        rejected: 0,
        talent_pool: 0,
      },
    );

    return {
      total: sampleApplicants.length,
      activeJobs: 3,
      ...statusCounts,
    };
  }

  const supabase = await createServerSupabaseClient();

  const { data, count } = await supabase
    .from("applicants")
    .select("current_status", { count: "exact" });

  const statusCounts: Record<ApplicantStatus, number> = {
    new: 0,
    screening: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
    talent_pool: 0,
  };

  if (data) {
    for (const row of data) {
      const s = row.current_status as ApplicantStatus;
      if (s in statusCounts) {
        statusCounts[s] += 1;
      }
    }
  }

  const { count: activeJobsCount } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  return {
    total: count ?? 0,
    activeJobs: activeJobsCount ?? 0,
    ...statusCounts,
  };
}
