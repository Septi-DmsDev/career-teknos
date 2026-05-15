import { ApplicantTable } from "@/components/admin/applicant-table";
import { getRecentApplicants } from "@/lib/services/applicants";

export default async function AdminApplicantsPage() {
  const applicants = await getRecentApplicants(20);

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          Pelamar
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Filter posisi, divisi, status, dan urutan submit akan ditambahkan pada
          integrasi data.
        </p>
      </div>
      <div className="overflow-x-auto">
        <ApplicantTable applicants={applicants} />
      </div>
    </div>
  );
}
