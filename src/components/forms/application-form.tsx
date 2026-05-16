"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { JobDetail } from "@/lib/domain";
import {
  applicationSchema,
  documentRules,
  documentTypes,
  type ApplicationInput,
  type DocumentType,
} from "@/lib/validations/application";

import { ApplicationStep1 } from "./application-step1";
import { ApplicationStep2 } from "./application-step2";
import { ApplicationStep3 } from "./application-step3";

const zodResolver: Resolver<ApplicationInput> = async (values) => {
  const result = applicationSchema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const fieldErrors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (path && !(path in fieldErrors)) {
      fieldErrors[path] = { type: "validation", message: issue.message };
    }
  }

  return { values: {}, errors: fieldErrors };
};

const STEPS = ["Data Diri", "Info Karir", "Dokumen"] as const;

// Fields that belong to each step — used for per-step validation
const STEP_FIELDS: Array<Array<keyof ApplicationInput>> = [
  [
    "fullName",
    "email",
    "whatsapp",
    "alternatePhone",
    "birthPlace",
    "birthDate",
    "gender",
    "address",
    "educationLevel",
    "institution",
    "major",
    "graduationYear",
  ],
  ["workExperience", "mainSkills", "expectedSalary", "availableDate", "source"],
  ["consent"],
];

export function ApplicationForm({ job }: { job: JobDetail }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  // Document file state (outside RHF — server receives them as FormData)
  const [files, setFiles] = useState<Partial<Record<DocumentType, File>>>({});
  const [fileErrors, setFileErrors] = useState<
    Partial<Record<DocumentType, string>>
  >({});

  const form = useForm<ApplicationInput>({
    resolver: zodResolver,
    mode: "onChange",
    defaultValues: {
      jobId: job.id,
      fullName: "",
      email: "",
      whatsapp: "",
      alternatePhone: "",
      birthPlace: "",
      birthDate: "",
      gender: undefined,
      address: "",
      educationLevel: "",
      institution: "",
      major: "",
      graduationYear: undefined,
      workExperience: "",
      mainSkills: "",
      expectedSalary: undefined,
      availableDate: "",
      source: "",
      consent: undefined,
    },
  });

  function handleFileChange(type: DocumentType, file: File | undefined) {
    setFiles((prev) => {
      const next = { ...prev };
      if (file) {
        next[type] = file;
      } else {
        delete next[type];
      }
      return next;
    });
    // Clear error when a file is selected
    if (file) {
      setFileErrors((prev) => {
        const next = { ...prev };
        delete next[type];
        return next;
      });
    }
  }

  function validateDocuments(): boolean {
    const newErrors: Partial<Record<DocumentType, string>> = {};
    let valid = true;

    for (const type of documentTypes) {
      const rule = documentRules[type];
      const file = files[type];

      if (rule.required && !(file instanceof File)) {
        newErrors[type] = `${rule.label} wajib diunggah.`;
        valid = false;
        continue;
      }

      if (file instanceof File) {
        const maxBytes = rule.maxMb * 1024 * 1024;
        if (file.size > maxBytes) {
          newErrors[type] = `${rule.label} melebihi batas ${rule.maxMb} MB.`;
          valid = false;
        } else if (!rule.mimeTypes.includes(file.type)) {
          newErrors[type] = `Format ${rule.label} tidak didukung.`;
          valid = false;
        }
      }
    }

    setFileErrors(newErrors);
    return valid;
  }

  async function handleNext() {
    // Trigger validation only for fields on this step
    const fieldsToValidate = STEP_FIELDS[step];
    const valid = await form.trigger(fieldsToValidate);

    if (!valid) return;

    setCompletedSteps((prev) => new Set(prev).add(step));
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleStepClick(index: number) {
    // Allow navigating back to any completed step, or the current step
    if (index < step || completedSteps.has(index)) {
      setStep(index);
    }
  }

  async function handleSubmit(data: ApplicationInput) {
    // Validate documents before submitting
    if (!validateDocuments()) return;

    setServerError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();

        // Append all text fields
        const entries = Object.entries(data) as [
          keyof ApplicationInput,
          unknown,
        ][];
        for (const [key, value] of entries) {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }

        // Append files
        for (const type of documentTypes) {
          const file = files[type];
          if (file instanceof File) {
            formData.append(type, file);
          }
        }

        const res = await fetch("/api/applications", {
          method: "POST",
          body: formData,
        });

        if (res.ok || res.status === 202) {
          router.push("/lamaran/berhasil");
          return;
        }

        const body = (await res.json()) as { error?: string };
        setServerError(
          body.error ?? "Terjadi kesalahan. Silakan coba lagi.",
        );
      } catch {
        setServerError("Gagal menghubungi server. Periksa koneksi Anda.");
      }
    });
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="panel-shadow rounded-2xl border border-line bg-white/90 p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((label, index) => {
          const isActive = step === index;
          const isCompleted = completedSteps.has(index);
          const isClickable = index < step || isCompleted;

          return (
            <button
              key={label}
              type="button"
              onClick={() => handleStepClick(index)}
              disabled={!isClickable && !isActive}
              className={[
                "rounded-xl border px-4 py-3 text-left text-sm font-extrabold transition",
                isActive
                  ? "border-brand bg-brand text-white shadow-sm"
                  : isCompleted
                    ? "border-brand/30 bg-brand/5 text-brand hover:bg-brand/10"
                    : "border-line bg-paper text-slate-400 cursor-default",
              ].join(" ")}
            >
              <span className="block text-xs opacity-70">Tahap {index + 1}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Server error */}
      {serverError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-6 grid gap-5"
        noValidate
      >
        {step === 0 && <ApplicationStep1 form={form} />}
        {step === 1 && <ApplicationStep2 form={form} />}
        {step === 2 && (
          <ApplicationStep3
            form={form}
            files={files}
            onFileChange={handleFileChange}
            fileErrors={fileErrors}
          />
        )}

        <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-5">
          <Button
            type="button"
            variant="secondary"
            disabled={step === 0 || isPending}
            onClick={handleBack}
          >
            Sebelumnya
          </Button>

          {!isLastStep ? (
            <Button type="button" onClick={handleNext} disabled={isPending}>
              Lanjut
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? "Mengirim…" : "Kirim Lamaran"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
