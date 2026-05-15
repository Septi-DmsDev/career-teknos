"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { jobSchema } from "@/lib/validations/job";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, error: "Unauthorized" as const };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id, is_active")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !profile.is_active) {
    return { user: null, error: "Forbidden" as const };
  }

  return { user, error: null };
}

// ---------------------------------------------------------------------------
// createJobAction
// ---------------------------------------------------------------------------

export async function createJobAction(formData: FormData) {
  const { user, error: authError } = await requireAdmin();
  if (authError || !user) {
    return { error: authError ?? "Unauthorized" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = jobSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: "Validation failed",
      issues: parsed.error.issues,
    };
  }

  const data = parsed.data;
  const admin = createAdminSupabaseClient();

  const { data: job, error: insertError } = await admin
    .from("jobs")
    .insert({
      title: data.title,
      slug: data.slug,
      department_id: data.departmentId,
      employment_type: data.employmentType,
      location: data.location,
      description: data.description,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      benefits: data.benefits,
      status: data.status,
      deadline: data.deadline || null,
    })
    .select("id")
    .single();

  if (insertError || !job) {
    return { error: insertError?.message ?? "Failed to create job" };
  }

  await admin.from("activity_logs").insert({
    admin_id: user.id,
    action: "job_created",
    metadata: { job_id: job.id, title: data.title },
  });

  revalidatePath("/admin/lowongan");
  redirect(`/admin/lowongan/${job.id}`);
}

// ---------------------------------------------------------------------------
// updateJobAction
// ---------------------------------------------------------------------------

export async function updateJobAction(id: string, formData: FormData) {
  const { user, error: authError } = await requireAdmin();
  if (authError || !user) {
    return { error: authError ?? "Unauthorized" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = jobSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: "Validation failed",
      issues: parsed.error.issues,
    };
  }

  const data = parsed.data;
  const admin = createAdminSupabaseClient();

  const { data: current, error: fetchError } = await admin
    .from("jobs")
    .select("id, status")
    .eq("id", id)
    .single();

  if (fetchError || !current) {
    return { error: fetchError?.message ?? "Job not found" };
  }

  const { error: updateError } = await admin
    .from("jobs")
    .update({
      title: data.title,
      slug: data.slug,
      department_id: data.departmentId,
      employment_type: data.employmentType,
      location: data.location,
      description: data.description,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      benefits: data.benefits,
      status: data.status,
      deadline: data.deadline || null,
    })
    .eq("id", id);

  if (updateError) {
    return { error: updateError.message };
  }

  await admin.from("activity_logs").insert({
    admin_id: user.id,
    action: "job_updated",
    metadata: {
      job_id: id,
      title: data.title,
      from_status: current.status,
      to_status: data.status,
    },
  });

  revalidatePath("/admin/lowongan");
  revalidatePath(`/admin/lowongan/${id}`);
  redirect(`/admin/lowongan/${id}`);
}

// ---------------------------------------------------------------------------
// updateJobStatusAction
// ---------------------------------------------------------------------------

export async function updateJobStatusAction(id: string, status: string) {
  const { user, error: authError } = await requireAdmin();
  if (authError || !user) {
    return { error: authError ?? "Unauthorized" };
  }

  const admin = createAdminSupabaseClient();

  const { data: current, error: fetchError } = await admin
    .from("jobs")
    .select("id, status")
    .eq("id", id)
    .single();

  if (fetchError || !current) {
    return { error: fetchError?.message ?? "Job not found" };
  }

  const { error: updateError } = await admin
    .from("jobs")
    .update({ status: status as typeof current.status })
    .eq("id", id);

  if (updateError) {
    return { error: updateError.message };
  }

  await admin.from("activity_logs").insert({
    admin_id: user.id,
    action: "job_status_changed",
    metadata: {
      job_id: id,
      from_status: current.status,
      to_status: status,
    },
  });

  revalidatePath("/admin/lowongan");
  revalidatePath(`/admin/lowongan/${id}`);

  return { error: null };
}
