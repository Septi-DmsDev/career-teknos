import { sanitizeFileName } from "@/lib/utils";
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
