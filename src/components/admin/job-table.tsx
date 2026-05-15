"use client";

import Link from "next/link";

import { LinkButton } from "@/components/ui/button";
import type { JobDetail, JobStatus, JobSummary } from "@/lib/domain";
import { formatDate } from "@/lib/utils";

const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  active: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  archived: "bg-orange-100 text-orange-700",
};

const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  active: "Aktif",
  closed: "Ditutup",
  archived: "Diarsipkan",
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  contract: "Kontrak",
  internship: "Magang",
  part_time: "Part-time",
};

interface Props {
  jobs: (JobSummary | JobDetail)[];
}

export function JobTable({ jobs }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">Belum ada lowongan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Judul</th>
            <th className="px-4 py-3">Divisi</th>
            <th className="px-4 py-3">Tipe</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Deadline</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/lowongan/${job.id}`}
                  className="font-semibold text-slate-950 hover:text-brand hover:underline"
                >
                  {job.title}
                </Link>
                <p className="text-xs text-slate-500">{job.location}</p>
              </td>
              <td className="px-4 py-3 text-slate-700">{job.departmentName}</td>
              <td className="px-4 py-3 text-slate-700">
                {EMPLOYMENT_TYPE_LABELS[job.employmentType] ?? job.employmentType}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${JOB_STATUS_COLORS[job.status]}`}
                >
                  {JOB_STATUS_LABELS[job.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDate(job.deadline)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <LinkButton
                    href={`/admin/lowongan/${job.id}`}
                    variant="secondary"
                    size="sm"
                  >
                    Lihat
                  </LinkButton>
                  <LinkButton
                    href={`/admin/lowongan/${job.id}/edit`}
                    variant="ghost"
                    size="sm"
                  >
                    Edit
                  </LinkButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
