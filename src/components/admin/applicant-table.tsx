import { Badge } from "@/components/ui/badge";
import type { ApplicantSummary } from "@/lib/domain";

export function ApplicantTable({ applicants }: { applicants: ApplicantSummary[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Posisi</th>
            <th className="px-4 py-3">Divisi</th>
            <th className="px-4 py-3">WhatsApp</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applicants.map((applicant) => (
            <tr key={applicant.id}>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-950">
                  {applicant.fullName}
                </p>
                <p className="text-slate-500">{applicant.email}</p>
              </td>
              <td className="px-4 py-3 text-slate-700">{applicant.jobTitle}</td>
              <td className="px-4 py-3 text-slate-700">
                {applicant.departmentName}
              </td>
              <td className="px-4 py-3 text-slate-700">{applicant.whatsapp}</td>
              <td className="px-4 py-3">
                <Badge>{applicant.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
