"use client";

import type { UseFormReturn } from "react-hook-form";

import type { ApplicationInput } from "@/lib/validations/application";

type Props = {
  form: UseFormReturn<ApplicationInput>;
};

const inputClass =
  "h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 disabled:opacity-60";
const selectClass =
  "h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 bg-white";
const labelClass = "grid gap-2";
const labelTextClass = "text-sm font-semibold text-slate-800";
const errorClass = "text-xs text-red-500 mt-0.5";

const sourceOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website Teknos" },
  { value: "jobstreet", label: "JobStreet" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "teman", label: "Rekomendasi Teman / Kenalan" },
  { value: "lainnya", label: "Lainnya" },
];

export function ApplicationStep2({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Work experience */}
      <label className="grid gap-2 md:col-span-2">
        <span className={labelTextClass}>
          Pengalaman Kerja <span className="text-red-500">*</span>
        </span>
        <textarea
          {...register("workExperience")}
          rows={5}
          placeholder="Ceritakan pengalaman kerja Anda yang relevan. Jika belum pernah bekerja, tuliskan pengalaman organisasi atau magang."
          className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        />
        {errors.workExperience && (
          <p className={errorClass}>{errors.workExperience.message}</p>
        )}
      </label>

      {/* Skills */}
      <label className="grid gap-2 md:col-span-2">
        <span className={labelTextClass}>
          Skill Utama <span className="text-red-500">*</span>
        </span>
        <textarea
          {...register("mainSkills")}
          rows={3}
          placeholder="Contoh: Microsoft Office, desain grafis, operator mesin cetak, dll."
          className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        />
        {errors.mainSkills && (
          <p className={errorClass}>{errors.mainSkills.message}</p>
        )}
      </label>

      {/* Expected salary */}
      <label className={labelClass}>
        <span className={labelTextClass}>Ekspektasi Gaji (Rp)</span>
        <input
          {...register("expectedSalary")}
          type="number"
          placeholder="Contoh: 3500000"
          min={0}
          className={inputClass}
        />
        {errors.expectedSalary && (
          <p className={errorClass}>{errors.expectedSalary.message}</p>
        )}
      </label>

      {/* Available start date */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Tanggal Siap Mulai Kerja <span className="text-red-500">*</span>
        </span>
        <input
          {...register("availableDate")}
          type="date"
          className={inputClass}
        />
        {errors.availableDate && (
          <p className={errorClass}>{errors.availableDate.message}</p>
        )}
      </label>

      {/* Source info */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Info Lowongan dari Mana <span className="text-red-500">*</span>
        </span>
        <select {...register("source")} className={selectClass}>
          <option value="">-- Pilih --</option>
          {sourceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.source && (
          <p className={errorClass}>{errors.source.message}</p>
        )}
      </label>
    </div>
  );
}
