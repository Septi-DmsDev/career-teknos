"use client";

import type { UseFormReturn } from "react-hook-form";

import type { ApplicationInput } from "@/lib/validations/application";

const educationOptions = [
  "SD",
  "SMP",
  "SMA/SMK",
  "D1",
  "D2",
  "D3",
  "D4",
  "S1",
  "S2",
  "S3",
];

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

export function ApplicationStep1({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Full name */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Nama Lengkap <span className="text-red-500">*</span>
        </span>
        <input
          {...register("fullName")}
          type="text"
          placeholder="Contoh: Budi Santoso"
          className={inputClass}
        />
        {errors.fullName && (
          <p className={errorClass}>{errors.fullName.message}</p>
        )}
      </label>

      {/* Email */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Email <span className="text-red-500">*</span>
        </span>
        <input
          {...register("email")}
          type="email"
          placeholder="nama@email.com"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </label>

      {/* WhatsApp */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Nomor WhatsApp <span className="text-red-500">*</span>
        </span>
        <input
          {...register("whatsapp")}
          type="tel"
          placeholder="08xxxxxxxxxx"
          className={inputClass}
        />
        {errors.whatsapp && (
          <p className={errorClass}>{errors.whatsapp.message}</p>
        )}
      </label>

      {/* Alternate phone */}
      <label className={labelClass}>
        <span className={labelTextClass}>Nomor Telepon Alternatif</span>
        <input
          {...register("alternatePhone")}
          type="tel"
          placeholder="Opsional"
          className={inputClass}
        />
        {errors.alternatePhone && (
          <p className={errorClass}>{errors.alternatePhone.message}</p>
        )}
      </label>

      {/* Birth place */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Tempat Lahir <span className="text-red-500">*</span>
        </span>
        <input
          {...register("birthPlace")}
          type="text"
          placeholder="Contoh: Jakarta"
          className={inputClass}
        />
        {errors.birthPlace && (
          <p className={errorClass}>{errors.birthPlace.message}</p>
        )}
      </label>

      {/* Birth date */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Tanggal Lahir <span className="text-red-500">*</span>
        </span>
        <input {...register("birthDate")} type="date" className={inputClass} />
        {errors.birthDate && (
          <p className={errorClass}>{errors.birthDate.message}</p>
        )}
      </label>

      {/* Gender */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Jenis Kelamin <span className="text-red-500">*</span>
        </span>
        <select {...register("gender")} className={selectClass}>
          <option value="">-- Pilih --</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
        {errors.gender && (
          <p className={errorClass}>{errors.gender.message}</p>
        )}
      </label>

      {/* Education level */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Pendidikan Terakhir <span className="text-red-500">*</span>
        </span>
        <select {...register("educationLevel")} className={selectClass}>
          <option value="">-- Pilih --</option>
          {educationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.educationLevel && (
          <p className={errorClass}>{errors.educationLevel.message}</p>
        )}
      </label>

      {/* Institution */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Nama Institusi <span className="text-red-500">*</span>
        </span>
        <input
          {...register("institution")}
          type="text"
          placeholder="Nama sekolah / universitas"
          className={inputClass}
        />
        {errors.institution && (
          <p className={errorClass}>{errors.institution.message}</p>
        )}
      </label>

      {/* Major */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Jurusan <span className="text-red-500">*</span>
        </span>
        <input
          {...register("major")}
          type="text"
          placeholder="Contoh: Teknik Informatika"
          className={inputClass}
        />
        {errors.major && <p className={errorClass}>{errors.major.message}</p>}
      </label>

      {/* Graduation year */}
      <label className={labelClass}>
        <span className={labelTextClass}>
          Tahun Lulus <span className="text-red-500">*</span>
        </span>
        <input
          {...register("graduationYear")}
          type="number"
          placeholder="Contoh: 2020"
          min={1970}
          max={2100}
          className={inputClass}
        />
        {errors.graduationYear && (
          <p className={errorClass}>{errors.graduationYear.message}</p>
        )}
      </label>

      {/* Address */}
      <label className="grid gap-2 md:col-span-2">
        <span className={labelTextClass}>
          Alamat Domisili <span className="text-red-500">*</span>
        </span>
        <textarea
          {...register("address")}
          rows={3}
          placeholder="Alamat lengkap tempat tinggal saat ini"
          className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        />
        {errors.address && (
          <p className={errorClass}>{errors.address.message}</p>
        )}
      </label>
    </div>
  );
}
