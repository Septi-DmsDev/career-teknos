import Link from "next/link";

import { StatusBadge } from "@/components/admin/status-badge";
import { LinkButton } from "@/components/ui/button";
import { applicantStatuses, APPLICANT_STATUS_LABELS } from "@/lib/domain";
import type { ApplicantStatus } from "@/lib/domain";
import { getApplicants } from "@/lib/services/applicants";
import { formatDate } from "@/lib/utils";

export default async function AdminApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const { search, status, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const limit = 20;

  const validStatus = applicantStatuses.includes(status as ApplicantStatus)
    ? (status as ApplicantStatus)
    : undefined;

  const { data: applicants, count } = await getApplicants({
    search,
    status: validStatus,
    page,
    limit,
  });

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          Pelamar
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {count} pelamar ditemukan.
        </p>
      </div>

      {/* Filter form */}
      <form method="GET" className="flex flex-wrap gap-3">
        <input
          name="search"
          type="text"
          defaultValue={search}
          placeholder="Cari nama, email, WhatsApp…"
          className="h-10 min-w-[220px] rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Semua Status</option>
          {applicantStatuses.map((s) => (
            <option key={s} value={s}>
              {APPLICANT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand/90"
        >
          Filter
        </button>
        {(search || status) && (
          <LinkButton href="/admin/pelamar" variant="secondary" size="sm">
            Reset
          </LinkButton>
        )}
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Posisi</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Tanggal Lamar</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicants.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Tidak ada pelamar ditemukan.
                  </td>
                </tr>
              )}
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-950">
                      {applicant.fullName}
                    </p>
                    <p className="text-xs text-slate-500">{applicant.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {applicant.jobTitle}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {applicant.whatsapp}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(applicant.submittedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={applicant.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/pelamar/${applicant.id}`}
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      Lihat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <LinkButton
              href={`?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}), page: String(page - 1) }).toString()}`}
              variant="secondary"
              size="sm"
            >
              ← Sebelumnya
            </LinkButton>
          )}
          <span className="text-sm text-slate-600">
            Halaman {page} / {totalPages}
          </span>
          {page < totalPages && (
            <LinkButton
              href={`?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}), page: String(page + 1) }).toString()}`}
              variant="secondary"
              size="sm"
            >
              Berikutnya →
            </LinkButton>
          )}
        </div>
      )}
    </div>
  );
}
