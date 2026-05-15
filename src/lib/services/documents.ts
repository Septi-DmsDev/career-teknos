import { sanitizeFileName } from "@/lib/utils";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DocumentType } from "@/lib/validations/application";

export function buildApplicantDocumentPath(input: {
  applicantId: string;
  documentType: DocumentType;
  fileName: string;
  timestamp?: number;
}) {
  const timestamp = input.timestamp ?? Date.now();
  return `applicants/${input.applicantId}/${input.documentType}/${timestamp}-${sanitizeFileName(
    input.fileName,
  )}`;
}

export async function getApplicantDocuments(applicantId: string) {
  if (!hasSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("applicant_documents")
    .select("*")
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}
