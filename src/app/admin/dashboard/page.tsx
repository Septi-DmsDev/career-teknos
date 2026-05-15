import { BriefcaseBusiness, Users } from "lucide-react";

import { ApplicantTable } from "@/components/admin/applicant-table";
import { StatCard } from "@/components/admin/stat-card";
import { getApplicantStats, getRecentApplicants } from "@/lib/services/applicants";

export default async function AdminDashboardPage() {
  const [stats, applicants] = await Promise.all([
    getApplicantStats(),
    getRecentApplicants(),
  ]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pelamar"
          value={stats.total}
          icon={<Users className="h-5 w-5 text-accent" />}
        />
        <StatCard label="Baru" value={stats.new} />
        <StatCard label="Screening" value={stats.screening} />
        <StatCard label="Shortlisted" value={stats.shortlisted} />
        <StatCard label="Interview" value={stats.interview} />
        <StatCard label="Diterima" value={stats.accepted} />
        <StatCard label="Ditolak" value={stats.rejected} />
        <StatCard
          label="Lowongan Aktif"
          value={stats.activeJobs}
          icon={<BriefcaseBusiness className="h-5 w-5 text-accent" />}
        />
      </div>
      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-950">
          Pelamar Terbaru
        </h2>
        <div className="overflow-x-auto">
          <ApplicantTable applicants={applicants} />
        </div>
      </section>
    </div>
  );
}
