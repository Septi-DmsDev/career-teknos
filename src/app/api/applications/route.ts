import { NextResponse } from "next/server";

import { buildApplicantDocumentPath } from "@/lib/services/documents";
import { hasSupabaseAdminEnv } from "@/lib/supabase/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  applicationSchema,
  documentRules,
  documentTypes,
  type DocumentType,
} from "@/lib/validations/application";

export async function POST(request: Request) {
  const formData = await request.formData();
  const applicantId = crypto.randomUUID();

  const payload = Object.fromEntries(
    Array.from(formData.entries()).filter(([, value]) => typeof value === "string"),
  );
  const parsed = applicationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data lamaran tidak valid.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const missingDocuments = documentTypes.filter((type) => {
    const rule = documentRules[type];
    const file = formData.get(type);
    return rule.required && !(file instanceof File && file.size > 0);
  });

  if (missingDocuments.length > 0) {
    return NextResponse.json(
      { error: "Dokumen wajib belum lengkap.", missingDocuments },
      { status: 422 },
    );
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      {
        applicantId,
        message:
          "Supabase belum dikonfigurasi. Validasi server berhasil pada mode scaffold.",
      },
      { status: 202 },
    );
  }

  const supabase = createAdminSupabaseClient();
  const uploadedPaths: string[] = [];
  const uploadedFiles: { storagePath: string; documentType: string; fileName: string; mimeType: string; sizeBytes: number }[] = [];

  try {
    for (const type of documentTypes) {
      const file = formData.get(type);
      if (!(file instanceof File) || file.size === 0) {
        continue;
      }

      validateFile(type, file);
      const storagePath = buildApplicantDocumentPath({
        applicantId,
        documentType: type,
        fileName: file.name,
      });

      const { error } = await supabase.storage
        .from("applicant-documents")
        .upload(storagePath, file, { contentType: file.type, upsert: false });

      if (error) {
        throw error;
      }

      uploadedPaths.push(storagePath);
      uploadedFiles.push({
        storagePath,
        documentType: type,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });
    }

    const { error } = await supabase.from("applicants").insert({
      id: applicantId,
      job_id: parsed.data.jobId,
      full_name: parsed.data.fullName,
      birth_place: parsed.data.birthPlace || null,
      birth_date: parsed.data.birthDate || null,
      gender: parsed.data.gender || null,
      email: parsed.data.email,
      whatsapp_number: parsed.data.whatsapp,
      alternative_phone: parsed.data.alternatePhone || null,
      domicile_address: parsed.data.address,
      last_education: parsed.data.educationLevel,
      institution_name: parsed.data.institution || null,
      major: parsed.data.major || null,
      graduation_year: parsed.data.graduationYear ?? null,
      work_experience: parsed.data.workExperience || null,
      skills: parsed.data.mainSkills || null,
      expected_salary: parsed.data.expectedSalary ?? null,
      available_start_date: parsed.data.availableDate || null,
      source_info: parsed.data.source || null,
      consent_data_usage: true,
      current_status: "new",
    });

    if (error) {
      throw error;
    }

    // After successful applicant insert, insert document metadata
    const docInserts = uploadedFiles.map(({ storagePath, documentType, fileName, mimeType, sizeBytes }) => ({
      applicant_id: applicantId,
      document_type: documentType,
      file_name: fileName,
      storage_path: storagePath,
      mime_type: mimeType,
      size_bytes: sizeBytes,
    }));
    if (docInserts.length > 0) {
      await supabase.from("applicant_documents").insert(docInserts);
    }

    // Insert initial status history
    await supabase.from("status_histories").insert({
      applicant_id: applicantId,
      from_status: null,
      to_status: "new",
      admin_id: null,
      note: "Lamaran masuk",
    });

    return NextResponse.json({ applicantId }, { status: 201 });
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from("applicant-documents").remove(uploadedPaths);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Lamaran gagal diproses. Silakan coba lagi.",
      },
      { status: 500 },
    );
  }
}

function validateFile(type: DocumentType, file: File) {
  const rule = documentRules[type];
  const maxBytes = rule.maxMb * 1024 * 1024;

  if (file.size > maxBytes) {
    throw new Error(`${rule.label} melebihi batas ${rule.maxMb} MB.`);
  }

  if (!rule.mimeTypes.includes(file.type)) {
    throw new Error(`Format ${rule.label} tidak didukung.`);
  }
}
