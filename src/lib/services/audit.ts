export type AuditAction =
  | "admin.login"
  | "job.created"
  | "job.published"
  | "job.closed"
  | "applicant.status_changed"
  | "applicant.note_added"
  | "document.downloaded"
  | "export.applicants";

export async function recordAuditLog(input: {
  action: AuditAction;
  adminId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  return {
    action: input.action,
    adminId: input.adminId ?? null,
    metadata: input.metadata ?? {},
  };
}
