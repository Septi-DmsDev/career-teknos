"use client";

import type { ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  documentRules,
  documentTypes,
  type DocumentType,
} from "@/lib/validations/application";
import type { ApplicationInput } from "@/lib/validations/application";

type Props = {
  form: UseFormReturn<ApplicationInput>;
  files: Partial<Record<DocumentType, File>>;
  onFileChange: (type: DocumentType, file: File | undefined) => void;
  fileErrors: Partial<Record<DocumentType, string>>;
};

const errorClass = "text-xs text-red-500 mt-0.5";

export function ApplicationStep3({
  form,
  files,
  onFileChange,
  fileErrors,
}: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  function handleFileInput(
    type: DocumentType,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    onFileChange(type, file ?? undefined);
  }

  return (
    <div className="grid gap-5">
      <p className="text-sm text-slate-600">
        Upload dokumen pendukung lamaran Anda. Dokumen bertanda{" "}
        <span className="text-red-500">*</span> wajib diunggah.
      </p>

      {documentTypes.map((type) => {
        const rule = documentRules[type];
        const selectedFile = files[type];
        const mimeLabel = rule.mimeTypes
          .map((m) => {
            if (m === "application/pdf") return "PDF";
            if (m === "application/msword") return "DOC";
            if (
              m ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
              return "DOCX";
            if (m === "image/jpeg") return "JPG";
            if (m === "image/png") return "PNG";
            return m;
          })
          .join(", ");

        return (
          <div key={type} className="grid gap-2">
            <label className="block text-sm font-semibold text-slate-800">
              {rule.label}
              {rule.required && <span className="text-red-500"> *</span>}
              <span className="ml-2 text-xs font-normal text-slate-500">
                ({mimeLabel}, maks. {rule.maxMb} MB)
              </span>
            </label>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand">
                <span>{selectedFile ? "Ganti File" : "Pilih File"}</span>
                <input
                  type="file"
                  accept={rule.mimeTypes.join(",")}
                  className="sr-only"
                  onChange={(e) => handleFileInput(type, e)}
                />
              </label>

              {selectedFile ? (
                <span className="truncate text-sm text-slate-700">
                  {selectedFile.name}{" "}
                  <span className="text-slate-400">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </span>
              ) : (
                <span className="text-sm text-slate-400">Belum ada file</span>
              )}
            </div>

            {fileErrors[type] && (
              <p className={errorClass}>{fileErrors[type]}</p>
            )}
          </div>
        );
      })}

      {/* Consent */}
      <div className="mt-2 rounded-md border border-slate-200 p-4">
        <label className="flex cursor-pointer gap-3 text-sm text-slate-700">
          <input
            {...register("consent")}
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
          />
          <span>
            Saya menyetujui pemrosesan data pribadi saya oleh Teknos untuk
            keperluan proses rekrutmen, sesuai dengan{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline hover:no-underline"
            >
              kebijakan privasi
            </a>{" "}
            yang berlaku.
          </span>
        </label>
        {errors.consent && (
          <p className={errorClass + " mt-2"}>{errors.consent.message}</p>
        )}
      </div>
    </div>
  );
}
