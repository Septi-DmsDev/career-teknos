import { sampleJobs } from "@/lib/data/sample";
import type { JobDetail, JobSummary } from "@/lib/domain";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getActiveJobs(): Promise<JobSummary[]> {
  if (!hasSupabasePublicEnv()) {
    return sampleJobs;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id,title,slug,employment_type,location,deadline,status,departments(code,name)",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return sampleJobs;
  }

  return data.map((job) => {
    const department = Array.isArray(job.departments)
      ? job.departments[0]
      : job.departments;

    return {
      id: job.id,
      slug: job.slug,
      title: job.title,
      departmentCode: department?.code ?? "warehouse",
      departmentName: department?.name ?? "Gudang",
      employmentType: job.employment_type,
      location: job.location,
      deadline: job.deadline,
      status: job.status,
    };
  });
}

export async function getLatestJobs(limit = 3) {
  const jobs = await getActiveJobs();
  return jobs.slice(0, limit);
}

export async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  const fallback = sampleJobs.find((job) => job.slug === slug) ?? null;

  if (!hasSupabasePublicEnv()) {
    return fallback;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id,title,slug,employment_type,location,deadline,status,description,responsibilities,requirements,benefits,departments(code,name)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return fallback;
  }

  const department = Array.isArray(data.departments)
    ? data.departments[0]
    : data.departments;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    departmentCode: department?.code ?? "warehouse",
    departmentName: department?.name ?? "Gudang",
    employmentType: data.employment_type,
    location: data.location,
    deadline: data.deadline,
    status: data.status,
    description: data.description,
    responsibilities: data.responsibilities,
    requirements: data.requirements,
    benefits: data.benefits,
  };
}
