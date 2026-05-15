"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { employmentTypes, jobStatuses, formatEmploymentType } from "@/lib/domain";
import { slugify } from "@/lib/utils";

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  contract: "Kontrak",
  internship: "Magang",
  part_time: "Part-time",
};

const JOB_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Aktif",
  closed: "Ditutup",
  archived: "Diarsipkan",
};

interface Department {
  id: string;
  name: string;
}

interface ActionResult {
  error?: string;
  issues?: unknown;
}

interface Props {
  departments: Department[];
  defaultValues?: Record<string, unknown>;
  action: (formData: FormData) => Promise<ActionResult | void>;
  submitLabel: string;
}

const inputClass =
  "h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100";
const textareaClass =
  "min-h-32 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100";
const selectClass =
  "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100";
const labelClass = "grid gap-1.5";
const labelTextClass = "text-sm font-semibold text-slate-800";

function arrayToText(value: unknown): string {
  if (Array.isArray(value)) return (value as string[]).join("\n");
  if (typeof value === "string") return value;
  return "";
}

export function JobForm({ departments, defaultValues, action, submitLabel }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  function handleTitleChange() {
    if (!titleRef.current || !slugRef.current) return;
    slugRef.current.value = slugify(titleRef.current.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <label className={labelClass}>
        <span className={labelTextClass}>Judul Lowongan *</span>
        <input
          ref={titleRef}
          name="title"
          type="text"
          required
          onChange={handleTitleChange}
          defaultValue={defaultValues?.title as string | undefined}
          className={inputClass}
          placeholder="Contoh: Staff Desain Grafis"
        />
      </label>

      {/* Slug */}
      <label className={labelClass}>
        <span className={labelTextClass}>Slug</span>
        <input
          ref={slugRef}
          name="slug"
          type="text"
          required
          defaultValue={defaultValues?.slug as string | undefined}
          className={inputClass}
          placeholder="staff-desain-grafis"
        />
        <span className="text-xs text-slate-500">
          Otomatis dari judul. Bisa diedit manual.
        </span>
      </label>

      {/* Department */}
      <label className={labelClass}>
        <span className={labelTextClass}>Divisi *</span>
        <select
          name="departmentId"
          required
          defaultValue={defaultValues?.departmentId as string | undefined}
          className={selectClass}
        >
          <option value="">Pilih divisi…</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </label>

      {/* Employment Type */}
      <label className={labelClass}>
        <span className={labelTextClass}>Tipe Pekerjaan *</span>
        <select
          name="employmentType"
          required
          defaultValue={
            (defaultValues?.employmentType as string | undefined) ?? "full_time"
          }
          className={selectClass}
        >
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {EMPLOYMENT_TYPE_LABELS[type] ?? formatEmploymentType(type)}
            </option>
          ))}
        </select>
      </label>

      {/* Location */}
      <label className={labelClass}>
        <span className={labelTextClass}>Lokasi *</span>
        <input
          name="location"
          type="text"
          required
          defaultValue={defaultValues?.location as string | undefined}
          className={inputClass}
          placeholder="Contoh: Jakarta Selatan"
        />
      </label>

      {/* Deadline */}
      <label className={labelClass}>
        <span className={labelTextClass}>Deadline</span>
        <input
          name="deadline"
          type="date"
          defaultValue={defaultValues?.deadline as string | undefined}
          className={inputClass}
        />
      </label>

      {/* Status */}
      <label className={labelClass}>
        <span className={labelTextClass}>Status *</span>
        <select
          name="status"
          required
          defaultValue={
            (defaultValues?.status as string | undefined) ?? "draft"
          }
          className={selectClass}
        >
          {jobStatuses.map((s) => (
            <option key={s} value={s}>
              {JOB_STATUS_LABELS[s] ?? s}
            </option>
          ))}
        </select>
      </label>

      {/* Description */}
      <label className={labelClass}>
        <span className={labelTextClass}>Deskripsi Pekerjaan *</span>
        <textarea
          name="description"
          required
          defaultValue={defaultValues?.description as string | undefined}
          className={textareaClass}
          rows={6}
          placeholder="Deskripsi singkat tentang posisi ini…"
        />
      </label>

      {/* Responsibilities */}
      <label className={labelClass}>
        <span className={labelTextClass}>Tanggung Jawab</span>
        <textarea
          name="responsibilities"
          defaultValue={arrayToText(defaultValues?.responsibilities)}
          className={textareaClass}
          rows={5}
          placeholder={"Satu item per baris:\nMembuat desain…\nBerkoordinasi dengan…"}
        />
        <span className="text-xs text-slate-500">Satu poin per baris.</span>
      </label>

      {/* Requirements */}
      <label className={labelClass}>
        <span className={labelTextClass}>Kualifikasi *</span>
        <textarea
          name="requirements"
          required
          defaultValue={arrayToText(defaultValues?.requirements)}
          className={textareaClass}
          rows={5}
          placeholder={"Satu item per baris:\nPendidikan S1…\nPengalaman minimal 2 tahun…"}
        />
        <span className="text-xs text-slate-500">Satu poin per baris.</span>
      </label>

      {/* Benefits */}
      <label className={labelClass}>
        <span className={labelTextClass}>Benefit</span>
        <textarea
          name="benefits"
          defaultValue={arrayToText(defaultValues?.benefits)}
          className={textareaClass}
          rows={4}
          placeholder={"Satu item per baris:\nGaji kompetitif\nBPJS Kesehatan & Ketenagakerjaan"}
        />
        <span className="text-xs text-slate-500">Satu poin per baris.</span>
      </label>

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="min-w-40">
          {isPending ? "Menyimpan…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
