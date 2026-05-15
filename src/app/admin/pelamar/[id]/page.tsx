import { notFound } from "next/navigation";

import { DocumentList } from "@/components/admin/document-list";
import { NotePanel } from "@/components/admin/note-panel";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatusUpdatePanel } from "@/components/admin/status-update-panel";
import { LinkButton } from "@/components/ui/button";
import type { ApplicantStatus } from "@/lib/domain";
import { APPLICANT_STATUS_LABELS } from "@/lib/domain";
import { getApplicantById } from "@/lib/services/applicants";
import { formatCurrency, formatDate } from "@/lib/utils";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-sm text-slate-900">{value ?? "-"}</dd>
    </div>
  );
}

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applicant = await getApplicantById(id);

  if (!applicant) {
    notFound();
  }

  const job = Array.isArray(applicant.jobs)
    ? applicant.jobs[0]
    : applicant.jobs;
  const department = job
    ? Array.isArray(job.departments)
      ? job.departments[0]
      : job.departments
    : null;

  const documents = Array.isArray(applicant.applicant_documents)
    ? applicant.applicant_documents
    : [];

  const notes = Array.isArray(applicant.applicant_notes)
    ? applicant.applicant_notes
    : [];

  const statusHistory = Array.isArray(applicant.status_histories)
    ? applicant.status_histories
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Main */}
      <div className="grid gap-6">
        {/* Profile card */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {applicant.full_name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{applicant.email}</p>
            </div>
            <StatusBadge status={applicant.current_status} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailRow label="WhatsApp" value={applicant.whatsapp_number} />
            <DetailRow
              label="Telepon Alt."
              value={applicant.alternative_phone}
            />
            <DetailRow
              label="Melamar Ke"
              value={job?.title ?? "-"}
            />
            <DetailRow label="Divisi" value={department?.name ?? "-"} />
            <DetailRow
              label="Tanggal Lamar"
              value={formatDate(applicant.submitted_at)}
            />
            <DetailRow label="Domisili" value={applicant.domicile_address} />
            <DetailRow
              label="Tempat Lahir"
              value={applicant.birth_place}
            />
            <DetailRow
              label="Tanggal Lahir"
              value={formatDate(applicant.birth_date)}
            />
            <DetailRow label="Gender" value={applicant.gender} />
            <DetailRow
              label="Pendidikan Terakhir"
              value={applicant.last_education}
            />
            <DetailRow
              label="Institusi"
              value={applicant.institution_name}
            />
            <DetailRow label="Jurusan" value={applicant.major} />
            <DetailRow
              label="Tahun Lulus"
              value={applicant.graduation_year?.toString()}
            />
            <DetailRow
              label="Gaji Diharapkan"
              value={formatCurrency(applicant.expected_salary)}
            />
            <DetailRow
              label="Bisa Mulai"
              value={formatDate(applicant.available_start_date)}
            />
            <DetailRow label="Sumber Info" value={applicant.source_info} />
          </dl>

          {applicant.work_experience && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pengalaman Kerja
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {applicant.work_experience}
              </p>
            </div>
          )}

          {applicant.skills && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Keahlian
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {applicant.skills}
              </p>
            </div>
          )}
        </section>

        {/* Documents */}
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-950">
            Dokumen
          </h3>
          <DocumentList documents={documents} />
        </section>

        {/* Notes history */}
        {notes.length > 0 && (
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-950">
              Catatan HRD
            </h3>
            <ul className="grid gap-4">
              {notes.map((n) => {
                const adminProfile = Array.isArray(n.admin_profiles)
                  ? n.admin_profiles[0]
                  : n.admin_profiles;
                return (
                  <li
                    key={n.id}
                    className="rounded-md border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="whitespace-pre-wrap text-sm text-slate-800">
                      {n.note}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {adminProfile?.full_name ?? "Admin"} ·{" "}
                      {formatDate(n.created_at)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Status history */}
        {statusHistory.length > 0 && (
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-950">
              Riwayat Status
            </h3>
            <ul className="space-y-3">
              {statusHistory.map((h) => (
                <li key={h.id} className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500">
                    {h.from_status
                      ? APPLICANT_STATUS_LABELS[h.from_status as ApplicantStatus]
                      : "—"}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="font-semibold text-slate-900">
                    {APPLICANT_STATUS_LABELS[h.to_status as ApplicantStatus]}
                  </span>
                  <span className="ml-auto text-xs text-slate-400">
                    {formatDate(h.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Sidebar */}
      <aside className="grid gap-6 self-start">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-950">
            Aksi HRD
          </h3>
          <StatusUpdatePanel
            applicantId={applicant.id}
            currentStatus={applicant.current_status}
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <NotePanel applicantId={applicant.id} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <LinkButton
            href="/admin/pelamar"
            variant="ghost"
            size="sm"
            className="w-full"
          >
            ← Kembali ke Daftar
          </LinkButton>
        </div>
      </aside>
    </div>
  );
}
