import { LinkButton } from "@/components/ui/button";
import { JobTable } from "@/components/admin/job-table";
import { getAllJobsAdmin } from "@/lib/services/jobs";

export default async function AdminJobsPage() {
  const jobs = await getAllJobsAdmin();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Lowongan
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Kelola draft, publish, close, dan archive lowongan.
          </p>
        </div>
        <LinkButton href="/admin/lowongan/tambah">Tambah Lowongan</LinkButton>
      </div>

      <div className="overflow-x-auto">
        <JobTable jobs={jobs} />
      </div>
    </div>
  );
}
