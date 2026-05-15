import { notFound } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { getJobByIdAdmin } from "@/lib/services/jobs";
import { formatEmploymentType } from "@/lib/domain";
import { formatDate } from "@/lib/utils";

const JOB_STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  active: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  archived: "bg-orange-100 text-orange-700",
};

const JOB_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Aktif",
  closed: "Ditutup",
  archived: "Diarsipkan",
};

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobByIdAdmin(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {job.departmentName}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            {job.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>{formatEmploymentType(job.employmentType)}</span>
            <span>·</span>
            <span>{job.location}</span>
            {job.deadline && (
              <>
                <span>·</span>
                <span>Deadline: {formatDate(job.deadline)}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${JOB_STATUS_COLORS[job.status]}`}
          >
            {JOB_STATUS_LABELS[job.status]}
          </span>
          <LinkButton href={`/admin/lowongan/${id}/edit`} variant="secondary">
            Edit Lowongan
          </LinkButton>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <section className="prose prose-slate max-w-none">
          <h3 className="text-base font-semibold text-slate-950">Deskripsi</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
            {job.description}
          </p>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-950">
                Tanggung Jawab
              </h3>
              <ul className="mt-2 space-y-1">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-950">
                Kualifikasi
              </h3>
              <ul className="mt-2 space-y-1">
                {job.requirements.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-950">Benefit</h3>
              <ul className="mt-2 space-y-1">
                {job.benefits.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
