"use server";

import { revalidatePath } from "next/cache";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApplicantStatus } from "@/lib/domain";

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
// updateApplicantStatusAction
// ---------------------------------------------------------------------------

export async function updateApplicantStatusAction(
  applicantId: string,
  newStatus: ApplicantStatus,
  note?: string,
) {
  const { user, error: authError } = await requireAdmin();
  if (authError || !user) {
    return { error: authError ?? "Unauthorized" };
  }

  const admin = createAdminSupabaseClient();

  // Fetch current applicant status
  const { data: current, error: fetchError } = await admin
    .from("applicants")
    .select("current_status")
    .eq("id", applicantId)
    .single();

  if (fetchError || !current) {
    return { error: fetchError?.message ?? "Applicant not found" };
  }

  const oldStatus = current.current_status;

  // Update applicant status
  const { error: updateError } = await admin
    .from("applicants")
    .update({ current_status: newStatus })
    .eq("id", applicantId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Insert status history record
  const { error: historyError } = await admin.from("status_histories").insert({
    applicant_id: applicantId,
    from_status: oldStatus,
    to_status: newStatus,
    admin_id: user.id,
    note: note ?? null,
  });

  if (historyError) {
    return { error: historyError.message };
  }

  // Insert activity log
  await admin.from("activity_logs").insert({
    admin_id: user.id,
    action: "applicant_status_changed",
    entity_type: "applicant",
    entity_id: applicantId,
    metadata: { from: oldStatus, to: newStatus },
  });

  revalidatePath(`/admin/pelamar/${applicantId}`);
  revalidatePath("/admin/pelamar");
  revalidatePath("/admin/dashboard");

  return { error: null };
}

// ---------------------------------------------------------------------------
// addApplicantNoteAction
// ---------------------------------------------------------------------------

export async function addApplicantNoteAction(
  applicantId: string,
  note: string,
) {
  const { user, error: authError } = await requireAdmin();
  if (authError || !user) {
    return { error: authError ?? "Unauthorized" };
  }

  const trimmedNote = note.trim();
  if (!trimmedNote) {
    return { error: "Catatan tidak boleh kosong" };
  }

  const admin = createAdminSupabaseClient();

  // Insert note
  const { error: insertError } = await admin.from("applicant_notes").insert({
    applicant_id: applicantId,
    admin_id: user.id,
    note: trimmedNote,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  // Insert activity log
  await admin.from("activity_logs").insert({
    admin_id: user.id,
    action: "note_added",
    entity_type: "applicant",
    entity_id: applicantId,
  });

  revalidatePath(`/admin/pelamar/${applicantId}`);

  return { error: null };
}
